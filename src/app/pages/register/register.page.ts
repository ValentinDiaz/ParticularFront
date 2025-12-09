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

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
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

    this.authService.register(this.registerForm.value).subscribe({
      next: async (res) => {
        console.log('Registro exitoso', res);

        // Guardar en localStorage
        localStorage.setItem('usuario', JSON.stringify(res));

        await loading.dismiss();
        this.isLoading = false;

        await this.showToast('¡Registro exitoso! Bienvenido', 'success');

        // Navegar al home o dashboard en lugar de login
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: async (error) => {
        console.error('Error en registro:', error);

        await loading.dismiss();
        this.isLoading = false;

        // Mensaje de error personalizado según el código de error
        let errorMessage = 'Ocurrió un error en el registro';

        if (error.status === 400) {
          errorMessage = 'El email ya está registrado';
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
