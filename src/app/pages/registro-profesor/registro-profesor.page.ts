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
  ToastController, IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Materia } from 'src/app/interfaces/materia.interface';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { ProfesorRequest } from 'src/app/interfaces/profesor-request.interface';

@Component({
  selector: 'app-registro-profesor',
  templateUrl: './registro-profesor.page.html',
  styleUrls: ['./registro-profesor.page.scss'],
  standalone: true,
  imports: [IonBackButton, 
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
    ReactiveFormsModule
  ]
})
export class RegistroProfesorPage implements OnInit {
  profesorForm: FormGroup;
  materiasDisponibles: Materia[] = [];
  isLoading = false;
  usuarioActual: Usuario | null = null;

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
          telefono: this.usuarioActual.telefono
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
      }
    });
  }



  getSelectedMaterias(): Materia[] {
    const selectedIds = this.profesorForm.get('materias')?.value || [];
    return this.materiasDisponibles.filter(m => selectedIds.includes(m.id));
  }

  removeMateria(materiaId: number) {
    const currentMaterias = this.profesorForm.get('materias')?.value || [];
    const newMaterias = currentMaterias.filter((id: number) => id !== materiaId);
    this.profesorForm.patchValue({ materias: newMaterias });
  }

    async onSubmit() {
    if (this.profesorForm.invalid) {
      Object.keys(this.profesorForm.controls).forEach(key => {
        this.profesorForm.get(key)?.markAsTouched();
      });
      await this.showToast('Por favor completa todos los campos correctamente', 'warning');
      return;
    }

    if (!this.usuarioActual) {
      await this.showToast('Debes iniciar sesión primero', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando profesor...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isLoading = true;

    // Preparar datos según lo que espera el backend
    const profesorData : ProfesorRequest= {
      usuario_id: this.usuarioActual.id,
      nombre: this.usuarioActual.nombre,
      apellido: this.usuarioActual.apellido,
      email: this.usuarioActual.email,
      telefono: this.profesorForm.value.telefono,
      precio_hora: this.profesorForm.value.precio_hora,
      foto_url: this.profesorForm.value.foto_url || '',
      experiencia: this.profesorForm.value.experiencia,
      materias_id: this.profesorForm.value.materias, // Array de IDs
    };

    console.log('Datos a enviar:', profesorData);

    this.profesorService.registrarProfesor(profesorData).subscribe({
      next: async (res: any) => {
        console.log('Registro de profesor exitoso', res);
        
        await loading.dismiss();
        this.isLoading = false;
        
        await this.showToast('¡Registro exitoso! Ahora eres profesor', 'success');
        
        // Redirigir al perfil o home
        this.router.navigate(['/home'], { replaceUrl: true });
         window.location.reload();
      },
      error: async (error: { status: number; error: { error: string; }; }) => {
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
          errorMessage = error.error?.error || 'Ya estás registrado como profesor';
        } else if (error.status === 422) {
          errorMessage = 'Datos inválidos, verifica la información';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }
        
        await this.showToast(errorMessage, 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}