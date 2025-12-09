import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonLabel,
  IonIcon,
  LoadingController,
  ToastController,
  IonBackButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Materia } from 'src/app/interfaces/materia.interface';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { ProfesorRequest } from 'src/app/interfaces/profesor-request.interface';
import {
  checkmarkCircleOutline,
  pencil,
  callOutline,
  mailOutline,
  logoWhatsapp,
  closeCircle,
  addCircle,
  camera,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-registro-profesor',
  templateUrl: './registro-profesor.page.html',
  styleUrls: ['./registro-profesor.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonLabel,
    IonIcon,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegistroProfesorPage implements OnInit {
  profesorForm: FormGroup;
  materiasDisponibles: Materia[] = [];
  isLoading = false;
  usuarioActual: Usuario | null = null;
  selectedFileName: string = '';
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  customActionSheetOptions = {
    header: 'Selecciona las materias',
    subHeader: 'Puedes seleccionar múltiples materias',
  };

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesoresService,
    private materiaService: MateriasService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {
    this.profesorForm = this.fb.group({
      telefono: ['', Validators.required],
      precio_hora: ['', [Validators.required, Validators.min(0)]],
      foto_url: [''],
      experiencia: ['', Validators.required],
      materias: [[], [Validators.required, Validators.minLength(1)]],
    });
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
      pencil: pencil,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'logo-whatsapp': logoWhatsapp,
      'close-circle': closeCircle,
      'add-circle': addCircle,
      camera: camera,
    });
  }

  ngOnInit() {
    this.cargarMaterias();
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    // Obtener el usuario actual del servicio
    this.usuarioActual = this.authService.getUsuarioActual();

    if (this.usuarioActual) {
      console.log('Usuario logueado:', this.usuarioActual);
      // Pre-llenar el teléfono si el usuario ya lo tiene
      if (this.usuarioActual.telefono) {
        this.profesorForm.patchValue({
          telefono: this.usuarioActual.telefono,
        });
      }
    } else {
      // Si no está logueado, redirigir al login
      this.showToast('Debes iniciar sesión primero', 'warning');
      this.router.navigate(['/login']);
    }
  }

  cargarMaterias() {
    this.materiaService.obtenerTodasMaterias().subscribe({
      next: (materias) => {
        this.materiasDisponibles = materias;
        console.log('Materias cargadas:', materias);
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.showToast('Error al cargar las materias', 'danger');
      },
    });
  }

  getSelectedMaterias(): Materia[] {
    const selectedIds = this.profesorForm.get('materias')?.value || [];
    return this.materiasDisponibles.filter((m) => selectedIds.includes(m.id));
  }

  removeMateria(materiaId: number) {
    const currentMaterias = this.profesorForm.get('materias')?.value || [];
    const newMaterias = currentMaterias.filter(
      (id: number) => id !== materiaId
    );
    this.profesorForm.patchValue({ materias: newMaterias });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        console.error('El archivo debe ser una imagen');
        return;
      }

      // Validar tamaño (opcional, por ejemplo máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.profesorForm.invalid) {
      Object.keys(this.profesorForm.controls).forEach((key) => {
        this.profesorForm.get(key)?.markAsTouched();
      });
      await this.showToast(
        'Por favor completa todos los campos correctamente',
        'warning'
      );
      return;
    }

    if (!this.usuarioActual) {
      await this.showToast('Debes iniciar sesión primero', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    // Validar que se haya seleccionado una foto (opcional)
    if (!this.selectedFile) {
      await this.showToast('Por favor selecciona una foto de perfil', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando profesor...',
      spinner: 'crescent',
    });
    await loading.present();

    this.isLoading = true;

    // Crear FormData para enviar datos + archivo
    const formData = new FormData();
    
    // Agregar datos del usuario y formulario
    formData.append('usuario_id', this.usuarioActual.id.toString());
    formData.append('nombre', this.usuarioActual.nombre);
    formData.append('apellido', this.usuarioActual.apellido);
    formData.append('email', this.usuarioActual.email);
    formData.append('telefono', this.profesorForm.value.telefono);
    formData.append('precio_hora', this.profesorForm.value.precio_hora.toString());
    formData.append('experiencia', this.profesorForm.value.experiencia);
    
    // Agregar las materias como JSON string o como el backend lo espere
    const materias = this.profesorForm.value.materias;
    formData.append('materias_id', JSON.stringify(materias));
    
    // Agregar la foto
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile, this.selectedFile.name);
    }

    console.log('Datos a enviar (FormData)');

    this.profesorService.registrarProfesor(formData).subscribe({
      next: async (res: any) => {
        console.log('Registro de profesor exitoso', res);

        await loading.dismiss();
        this.isLoading = false;

        await this.showToast(
          '¡Registro exitoso! Ahora eres profesor',
          'success'
        );

        // Limpiar la foto seleccionada
        this.selectedFile = null;
        this.selectedFileName = '';
        this.photoPreview = null;

        // Redirigir al perfil o home
        this.router.navigate(['/home'], { replaceUrl: true });
        window.location.reload();
      },
      error: async (error: { status: number; error: { error: string } }) => {
        console.error('Error en registro de profesor:', error);

        await loading.dismiss();
        this.isLoading = false;

        let errorMessage = 'Ocurrió un error en el registro';

        if (error.status === 400) {
          errorMessage = error.error?.error || 'Faltan campos obligatorios';
        } else if (error.status === 401) {
          errorMessage = 'Debes iniciar sesión primero';
        } else if (error.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (error.status === 409) {
          errorMessage =
            error.error?.error || 'Ya estás registrado como profesor';
        } else if (error.status === 413) {
          errorMessage = 'La imagen es demasiado grande. Máximo 5MB';
        } else if (error.status === 415) {
          errorMessage = 'Formato de imagen no válido';
        } else if (error.status === 422) {
          errorMessage = 'Datos inválidos, verifica la información';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }

        await this.showToast(errorMessage, 'danger');
      },
    });
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
