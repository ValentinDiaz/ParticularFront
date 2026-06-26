import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSpinner,
  IonBackButton,
  IonIcon,
  IonText,
  AlertController,
  ToastController,
  LoadingController,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { addIcons } from 'ionicons';
import {
  createOutline,
  camera,
  callOutline,
  mailOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { Profesor } from 'src/app/interfaces/profesor.interface';
import { extractErrorMessage } from 'src/app/shared/api-error.util';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
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
    IonText,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
  ],
})
export class PerfilUsuarioPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  usuario?: Usuario;
  usuarioOriginal?: Usuario;
  modoEdicion = signal(false);
  haycambios = false;
  mostrarFavoritos = false;

  favoritos: Profesor[] = [];

  // Estados de edición
  editandoNombre = false;
  editandoEmail = false;
  editandoTelefono = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private UsuariosService: UsuariosService
  ) {
    // Registrar íconos
    addIcons({
      'create-outline': createOutline,
      camera: camera,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.cargarUsuario();
    this.obtenerFavoritos();
  }

  obtenerFavoritos() {
    if (!this.usuario) return;
    this.UsuariosService.obtenerFavoritos(this.usuario.id).subscribe({
      next: (favoritos) => {
        console.log('Favoritos obtenidos:', favoritos);
        this.favoritos = favoritos;
      },
      error: (error) => {
        console.error('Error al obtener favoritos:', error);
      },
    });
  }

  cargarUsuario() {
    const id = this.route.snapshot.paramMap.get('id');
    const usuarioActual = this.authService.getUsuarioActual() as Usuario;
    // Ver mi propio perfil
    if (usuarioActual) {
      this.usuario = { ...usuarioActual };
      this.usuarioOriginal = JSON.parse(JSON.stringify(usuarioActual));
      this.modoEdicion.set(true);
    } else {
      this.showToast('No hay usuario logueado', 'danger');
      this.router.navigate(['/login']);
    }
  }

  obtenerNombresMaterias(profesor: Profesor): string {
    return profesor.materias?.map((m) => m.nombre).join(', ') ?? '';
  }

  // Editar foto
  async editarFoto() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar foto de perfil',
      message: 'Ingresa la URL de tu nueva foto',
      inputs: [
        {
          name: 'fotoPerfil',
          type: 'url',
          placeholder: 'https://ejemplo.com/foto.jpg',
          value: this.usuario?.fotoPerfil || '',
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
            if (this.usuario && data.fotoPerfil) {
              this.usuario.fotoPerfil = data.fotoPerfil;
              this.haycambios = true;
              return true;
            }
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  // Editar nombre
  editarNombre() {
    this.editandoNombre = true;
  }

  cancelarEdicionNombre() {
    if (this.usuario && this.usuarioOriginal) {
      this.usuario.nombre = this.usuarioOriginal.nombre;
      this.usuario.apellido = this.usuarioOriginal.apellido;
    }
    this.editandoNombre = false;
  }

  guardarNombre() {
    this.editandoNombre = false;
    this.haycambios = true;
  }

  // Editar email
  editarEmail() {
    this.editandoEmail = true;
  }

  cancelarEdicionEmail() {
    if (this.usuario && this.usuarioOriginal) {
      this.usuario.email = this.usuarioOriginal.email;
    }
    this.editandoEmail = false;
  }

  guardarEmail() {
    this.editandoEmail = false;
    this.haycambios = true;
  }

  // Editar teléfono
  editarTelefono() {
    this.editandoTelefono = true;
  }

  cancelarEdicionTelefono() {
    if (this.usuario && this.usuarioOriginal) {
      this.usuario.telefono = this.usuarioOriginal.telefono;
    }
    this.editandoTelefono = false;
  }

  guardarTelefono() {
    this.editandoTelefono = false;
    this.haycambios = true;
  }

  // Cambiar contraseña
  async cambiarContrasena() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar contraseña',
      inputs: [
        {
          name: 'passwordActual',
          type: 'password',
          placeholder: 'Contraseña actual',
        },
        {
          name: 'passwordNueva',
          type: 'password',
          placeholder: 'Nueva contraseña',
        },
        {
          name: 'passwordConfirmar',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cambiar',
          handler: async (data) => {
            if (
              !data.passwordActual ||
              !data.passwordNueva ||
              !data.passwordConfirmar
            ) {
              this.showToast('Completa todos los campos', 'warning');
              return false;
            }

            if (data.passwordNueva !== data.passwordConfirmar) {
              this.showToast('Las contraseñas no coinciden', 'danger');
              return false;
            }

            if (data.passwordNueva.length < 5) {
              this.showToast(
                'La contraseña debe tener al menos 5 caracteres',
                'danger'
              );
              return false;
            }

            // Aquí llamarías a tu servicio para cambiar la contraseña
            try {
              // await this.authService.cambiarPassword(data.passwordActual, data.passwordNueva).toPromise();
              this.showToast('Contraseña cambiada exitosamente', 'success');
              return true;
            } catch (error) {
              this.showToast('Error al cambiar la contraseña', 'danger');
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Guardar todos los cambios
  async guardarCambios() {
    if (!this.usuario || !this.haycambios) return;

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...',
      spinner: 'crescent',
    });
    await loading.present();

    const usuarioData = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      fotoPerfil: this.usuario.fotoPerfil,
    };

    this.UsuariosService.actualizarUsuario(this.usuario.id, usuarioData).subscribe({
      next: async (usuarioActualizado) => {
        this.authService.setUsuario(usuarioActualizado);

        await loading.dismiss();
        await this.showToast('Cambios guardados exitosamente', 'success');

        this.haycambios = false;
        this.usuario = usuarioActualizado;
        this.usuarioOriginal = JSON.parse(JSON.stringify(usuarioActualizado));
      },
      error: async (error) => {
        await loading.dismiss();
        await this.showToast(
          extractErrorMessage(error, 'Error al guardar los cambios'),
          'danger'
        );
      },
    });
  }
  toggleFavoritos() {
    this.mostrarFavoritos = !this.mostrarFavoritos;

    if (this.mostrarFavoritos) {
      setTimeout(() => {
        this.scrollToFavoritos();
      }, 150); // espera a que renderice
    }
  }

  scrollToFavoritos() {
    const el = document.getElementById('favoritos-section');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  // Helper para mostrar toast
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

  seleccionarProfesor(profesor: Profesor) {
    this.router.navigate(['/perfil-profesor', profesor.id]);

  }
}
