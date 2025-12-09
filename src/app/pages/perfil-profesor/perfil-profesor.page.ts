import { MateriasService } from 'src/app/services/materias.service';
import { Usuario } from './../../interfaces/usuario.interface';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonButton,
  IonSpinner,
  IonBackButton,
  IonIcon,
  AlertController,
  ToastController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { AuthService } from 'src/app/services/auth.service';
import { Profesor } from 'src/app/interfaces/profesor.interface';
import { Materia } from 'src/app/interfaces/materia.interface';
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
  starOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-perfil-profesor',
  templateUrl: './perfil-profesor.page.html',
  styleUrls: ['./perfil-profesor.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonBackButton,
    IonSpinner,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class PerfilProfesorPage implements OnInit {
  profesor?: Profesor;
  profesorOriginal?: Profesor; // Para cancelar cambios
  modoEdicion = signal(false);
  haycambios = false;

  // Estados de edición
  editandoPrecio = false;
  editandoExperiencia = false;
  editandoContacto = false;

  materiasDisponibles: Materia[] = [];
  ratingSeleccionado = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profesorService: ProfesoresService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private materiaService: MateriasService,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
      pencil: pencil,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'logo-whatsapp': logoWhatsapp,
      'close-circle': closeCircle,
      camera: camera,
      'star-outline': starOutline,
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const usuario = this.authService.usuario;

    if (id) {
      console.log('Cargando profesor por ID de ruta:', id);
      this.profesorService
        .obtenerProfesorPorId(Number(id))
        .subscribe((data) => {
          this.profesor = data;
          this.profesorOriginal = JSON.parse(JSON.stringify(data));
          this.modoEdicion.set(this.profesor?.id_usuario === usuario?.id);
          console.log('Profesor cargado:', this.profesor); // ✅ Verifica aquí qué campos tiene
          console.log('URL de foto:', this.profesor.foto); // ✅ Verifica la URL
        });
    } else {
      console.log('No se proporcionó ID en la ruta, buscando por usuario...');
      const usuarioId = this.authService.usuario?.id;

      if (usuarioId !== undefined) {
        this.profesorService
          .obtenerProfesorPorIdUsuario(usuarioId)
          .subscribe((data) => {
            this.profesor = data;
            this.profesorOriginal = JSON.parse(JSON.stringify(data));
            this.modoEdicion.set(true);
          });
      } else {
        console.error('No hay usuario logueado');
      }
    }

    // Cargar materias disponibles para agregar

    this.materiaService.obtenerTodasMaterias().subscribe((materias) => {
      this.materiasDisponibles = materias;
      console.log('Materias cargadas:', materias); // ✔ acá sí funciona
    });
  }

  round(value: number | null | undefined): number {
    return Math.round(value || 0);
  }

  // Editar precio
  editarPrecio() {
    this.editandoPrecio = true;
  }

  // Editar experiencia
  editarExperiencia() {
    this.editandoExperiencia = true;
  }

  cancelarEdicionExperiencia() {
    if (this.profesor && this.profesorOriginal) {
      this.profesor.experiencia = this.profesorOriginal.experiencia;
    }
    this.editandoExperiencia = false;
  }

  guardarExperiencia() {
    this.editandoExperiencia = false;
    this.haycambios = true;
  }

  // Editar contacto
  editarContacto() {
    this.editandoContacto = true;
  }

  cancelarEdicionContacto() {
    if (this.profesor && this.profesorOriginal) {
      this.profesor.telefono = this.profesorOriginal.telefono;
      this.profesor.email = this.profesorOriginal.email;
    }
    this.editandoContacto = false;
  }

  guardarContacto() {
    this.editandoContacto = false;
    this.haycambios = true;
  }

  // Editar foto
  async editarFoto() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar foto de perfil',
      inputs: [
        {
          name: 'foto_url',
          type: 'url',
          placeholder: 'URL de la imagen',
          value: this.profesor?.foto || '',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (this.profesor) {
              this.profesor.foto = data.foto_url;
              this.haycambios = true;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async seleccionarRating(valor: number) {
    this.ratingSeleccionado = valor;
    if (this.ratingSeleccionado < 1 || this.ratingSeleccionado > 5) {
      await this.showToast(
        'Debes seleccionar una calificación de 1 a 5 estrellas',
        'warning'
      );
      return;
    }
    if (!this.profesor?.id) {
      await this.showToast('Profesor no válido', 'danger');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Dejar Reseña',
      message: `Calificación: ${this.ratingSeleccionado} ⭐`,
      inputs: [
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Escribe tu comentario (opcional)',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            const loading = await this.loadingCtrl.create({
              message: 'Enviando reseña...',
            });
            await loading.present();

            const usuarioId = this.authService.usuario?.id;
            if (!usuarioId) {
              await loading.dismiss();
              await this.showToast(
                'Debes iniciar sesión para dejar una reseña',
                'warning'
              );
              this.router.navigate(['/login']);
              return false;
            }

            const reviewData = {
              usuario_id: usuarioId,
              estrellas: this.ratingSeleccionado,
              comentario: data.comentario || '',
            };

            if (!this.profesor?.id) {
              await loading.dismiss();
              await this.showToast('Profesor no válido', 'danger');
              return false;
            }

            this.profesorService.calificarProfesor(
              this.profesor.id,
              reviewData).subscribe({
              next: async () => {
                await loading.dismiss();
                await this.showToast('¡Reseña enviada con éxito!', 'success');

                this.ratingSeleccionado = 0; // reset estrellas

                if (this.profesor) {
                  this.profesorService
                    .obtenerProfesorPorId(this.profesor.id)
                    .subscribe((data) => {
                      this.profesor = data;
                    });
                }
              },
              error: async (error) => {
                await loading.dismiss();

                let errorMessage = 'Error al enviar la reseña';
                if (error.status === 409) {
                  errorMessage = 'Ya has dejado una reseña para este profesor';
                }

                await this.showToast(errorMessage, 'danger');
              },
            });

            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  // Formatear fecha para las reseñas
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else {
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  // Agregar materia
  async agregarMateria() {
    if (!this.profesor) return;

    // Filtrar materias que no tiene el profesor
    const materiasNoAgregadas = this.materiasDisponibles.filter(
      (m) => !this.profesor?.materias?.some((pm) => pm.id === m.id)
    );
    console.log(materiasNoAgregadas);

    if (materiasNoAgregadas.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Ya tienes todas las materias agregadas',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una materia',
      buttons: [
        ...materiasNoAgregadas.map((materia) => ({
          text: materia.nombre,
          handler: () => {
            if (this.profesor) {
              if (!this.profesor.materias) {
                this.profesor.materias = [];
              }
              this.profesor.materias.push(materia);
              this.haycambios = true;
            }
          },
        })),
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  // Eliminar materia
  async eliminarMateria(materiaId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar materia',
      message: '¿Estás seguro de que deseas eliminar esta materia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (this.profesor && this.profesor.materias) {
              this.profesor.materias = this.profesor.materias.filter(
                (m) => m.id !== materiaId
              );
              this.haycambios = true;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Guardar todos los cambios
  async guardarCambios() {
    if (!this.profesor || !this.haycambios) return;

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      // Preparar datos para enviar
      const profesorData: ProfesorRequest = {
        nombre: this.profesor.nombre,
        apellido: this.profesor.apellido,
        email: this.profesor.email,
        telefono: this.profesor.telefono,
        precio_hora: this.profesor.precio_hora,
        foto_url: this.profesor.foto,
        experiencia: this.profesor.experiencia,
        materias_id: this.profesor.materias?.map((m) => m.id) || [],
        usuario_id: 0,
      };

      await this.profesorService
        .actualizarProfesor(this.profesor.id, profesorData)
        .toPromise();

      await loading.dismiss();

      await this.showToast('Cambios guardados exitosamente', 'success');

      this.haycambios = false;
      this.profesorOriginal = JSON.parse(JSON.stringify(this.profesor));

      this.cargarProfesor();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      await loading.dismiss();
      await this.showToast('Error al guardar los cambios', 'danger');
    }
  }

  cargarProfesor() {
    const id = this.route.snapshot.paramMap.get('id');
    const usuario = this.authService.usuario;

    if (id) {
      this.profesorService
        .obtenerProfesorPorId(Number(id))
        .subscribe((data) => {
          this.profesor = data;
          this.profesorOriginal = JSON.parse(JSON.stringify(data));
          this.modoEdicion.set(this.profesor?.id_usuario === usuario?.id);

          if (this.modoEdicion()) {
            this.cargarMaterias();
          }
        });
    } else {
      const usuarioId = this.authService.usuario?.id;

      if (usuarioId !== undefined) {
        this.profesorService
          .obtenerProfesorPorIdUsuario(usuarioId)
          .subscribe((data) => {
            this.profesor = data;
            this.profesorOriginal = JSON.parse(JSON.stringify(data));
            this.modoEdicion.set(true);
            this.cargarMaterias();
          });
      } else {
        console.error('No hay usuario logueado');
      }
    }
  }

  cargarMaterias() {
    this.materiaService.obtenerTodasMaterias().subscribe((materias) => {
      this.materiasDisponibles = materias;
    });
  }

  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  enviarWhatsApp(numero: number) {
    const mensaje = encodeURIComponent(
      '¡Hola! Estoy interesado en tus clases.'
    );
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
  }
}
