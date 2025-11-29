import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { LoginRequest } from 'src/app/interfaces/login-request.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      // Marcar campos para mostrar errores
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });

      await this.showToast(
        'Por favor completa todos los campos correctamente',
        'warning'
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: async (res) => {
        console.log('Login exitoso', res);

        // Guardar el usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(res));

        await loading.dismiss();
        this.isLoading = false;

        await this.showToast('¡Bienvenido!', 'success');

        // Redirigir al home
        this.router.navigate(['/home'], { replaceUrl: true });
      },

      error: async (err) => {
        console.error('Error en login:', err);

        await loading.dismiss();
        this.isLoading = false;

        let errorMessage = 'Ocurrió un error al iniciar sesión';

        if (err.status === 400) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (err.status === 422) {
          errorMessage = 'Datos inválidos, verifica la información';
        } else if (err.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }

        await this.showToast(errorMessage, 'danger');
      },
    });
  }

  ngOnInit() {}

  olvidePassword() {
    this.router.navigate(['/register'], { replaceUrl: true });
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
