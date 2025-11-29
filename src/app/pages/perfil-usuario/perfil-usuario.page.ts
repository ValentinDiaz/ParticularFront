import { Component, OnInit, signal } from '@angular/core';
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
  checkmarkCircleOutline 
} from 'ionicons/icons';

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
  ],
})
export class PerfilUsuarioPage implements OnInit {
  usuario?: Usuario;
  usuarioOriginal?: Usuario;
  modoEdicion = signal(false);
  haycambios = false;

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
    private loadingCtrl: LoadingController
  ) {
    // Registrar íconos
    addIcons({
      'create-outline': createOutline,
      'camera': camera,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.cargarUsuario();
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
            if (!data.passwordActual || !data.passwordNueva || !data.passwordConfirmar) {
              this.showToast('Completa todos los campos', 'warning');
              return false;
            }

            if (data.passwordNueva !== data.passwordConfirmar) {
              this.showToast('Las contraseñas no coinciden', 'danger');
              return false;
            }

            if (data.passwordNueva.length < 5) {
              this.showToast('La contraseña debe tener al menos 5 caracteres', 'danger');
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

    try {
      // Preparar datos para enviar
      const usuarioData = {
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        email: this.usuario.email,
        telefono: this.usuario.telefono,
        fotoPerfil: this.usuario.fotoPerfil,
      };

      // Aquí llamarías a tu servicio para actualizar el usuario
      // await this.authService.actualizarUsuario(this.usuario.id, usuarioData).toPromise();

      // Actualizar el usuario en el servicio de auth
      this.authService.setUsuario(this.usuario);

      await loading.dismiss();
      await this.showToast('Cambios guardados exitosamente', 'success');

      this.haycambios = false;
      this.usuarioOriginal = JSON.parse(JSON.stringify(this.usuario));
      
      // Recargar el usuario
      this.cargarUsuario();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      await loading.dismiss();
      await this.showToast('Error al guardar los cambios', 'danger');
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
}