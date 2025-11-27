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

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login exitoso', res);
          // this.authService.setUsuario(res.user);
          localStorage.setItem('usuario', JSON.stringify(res));
          this.router.navigate(['/home'], { replaceUrl: true });
        },
        error: (err) => {
          console.error('Error en login', err);
        },
      });
    }
  }

  ngOnInit() {}

  olvidePassword() {
  this.router.navigate(['/register'], { replaceUrl: true });
}


}
