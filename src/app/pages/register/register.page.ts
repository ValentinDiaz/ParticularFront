import { ProfesoresService } from 'src/app/services/profesores.service';
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
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/standalone';
import { ModalController, IonicModule } from '@ionic/angular';
import { ReclamarProfesorModalComponent } from './reclamar-profesor-modal/reclamar-profesor-modal.component';
import {
  applyValidationErrors,
  extractErrorMessage,
} from 'src/app/shared/api-error.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private profesoresService: ProfesoresService
  ) {
    this.registerForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        password: ['', Validators.required],
        confirmarPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmarPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      await this.showToast(
        'Por favor completa todos los campos correctamente',
        'warning'
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent',
    });
    await loading.present();

    this.isLoading = true;
    let respuesta: any = null;
    this.authService.register(this.registerForm.value).subscribe({
      next: async (res: any) => {

        await loading.dismiss();
        this.isLoading = false;

        // ✅ Si existe un profesor precargado para reclamar, abrir modal
        if (res.profesorParaReclamar) {
          await this.abrirModalReclamarProfesor(
            res.profesorParaReclamar,
            res.id
          );

          return; // Detener flujo normal
        }

        await this.showToast('¡Registro exitoso! Bienvenido', 'success');

        // Navegar al login o home
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;

        if (applyValidationErrors(this.registerForm, error)) {
          await this.showToast('Datos inválidos, revisa el formulario', 'warning');
          return;
        }

        const errorMessage = extractErrorMessage(
          error,
          'Ocurrió un error en el registro'
        );

        await this.showToast(errorMessage, 'danger');
      },
    });
  }

  async abrirModalReclamarProfesor(profesor: any, usuarioId: number) {
  

    const modal = await this.modalCtrl.create({
      component: ReclamarProfesorModalComponent,
      componentProps: { profesor, usuarioId },
    });

    console.log('🔷 Modal creado, presentando...');
    await modal.present();
    console.log('🔷 Modal presentado');

    const { data } = await modal.onDidDismiss();
    console.log('🔷 Modal cerrado con data:', data);

    if (data?.reclamado === true) {
      console.log('✅ Usuario aceptó reclamar');
      await this.reclamarProfesor(profesor.id, usuarioId);
    } else {
      console.log('⚠️ Usuario canceló o cerró modal');
      await this.showToast('Registro completado', 'success');
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  async reclamarProfesor(id_profesor: number, id_usuario: number) {
    

    this.profesoresService.reclamarProfesor(id_profesor, id_usuario).subscribe({
      next: async () => {
        console.log('✅ Profesor reclamado exitosamente');
        await this.showToast(
          'Perfil de profesor reclamado correctamente',
          'success'
        );
        console.log('🏠 Navegando a /home');
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: async (err) => {
        await this.showToast('No se pudo reclamar el perfil', 'danger');
        this.router.navigate(['/login'], { replaceUrl: true });
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
