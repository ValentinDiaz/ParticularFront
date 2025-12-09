import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request.interface';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Materia } from '../interfaces/materia.interface';
import { Profesor } from '../interfaces/profesor.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private URL_BASE = 'http://localhost:3000/api/auth';
  private URL_BASE_MATERIAS = 'http://localhost:3000/api/materias';

  private endPoints = {
    login: '/login',
    register: '/registro',
    logOut: '/logout',
    me: '/me',
    profesorRegister: '/profeRegister',
    refres_token: '/refresh-token',
  };

  constructor(private http: HttpClient) {
    this.cargarUsuarioLocalStorage();
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get usuarioProfesor(): Profesor | null {
    return this.usuarioSubject.value as Profesor | null;
  }

  // Cargar usuario desde localStorage al iniciar la app
  private cargarUsuarioLocalStorage(): void {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        this.usuarioSubject.next(usuario);
        
        // Verificar que la sesión siga válida con el backend
        this.cargarUsuarioDesdeSesion().subscribe({
          error: () => {
            // Si la cookie expiró, limpiar todo
            this.clearUserData();
          }
        });
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
        this.clearUserData();
      }
    }
  }

  // Verificar sesión con el backend
  cargarUsuarioDesdeSesion(): Observable<Usuario> {
    return this.http
      .get<Usuario>(this.URL_BASE + this.endPoints.me, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.usuarioSubject.next(user);
          localStorage.setItem('usuario', JSON.stringify(user));
        }),
        catchError((error) => {
          this.usuarioSubject.next(null);
          localStorage.removeItem('usuario');
          return throwError(() => error);
        })
      );
  }

  // Login
  login(data: LoginRequest): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(this.URL_BASE + this.endPoints.login, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.usuarioSubject.next(res.user);
          localStorage.setItem('usuario', JSON.stringify(res.user));
        }),
        map((res) => res.user)
      );
  }

  // Registro
  register(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.URL_BASE + this.endPoints.register, usuario, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.usuarioSubject.next(user);
          localStorage.setItem('usuario', JSON.stringify(user));
          console.log('Usuario registrado y guardado:', user);
        })
      );
  }

  // Logout
  logOut(): Observable<any> {
    return this.http
      .post(
        this.URL_BASE + this.endPoints.logOut,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => this.clearUserData())
      );
  }

  // Limpiar datos del usuario
  private clearUserData(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario');
  }

  // Refresh token
  refreshToken(): Observable<any> {
    const url = this.URL_BASE + this.endPoints.refres_token;
    return this.http.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );
  }

  

  // Verificar si está logueado
  isLogged(): boolean {
    return this.usuarioSubject.value !== null;
  }

  // Obtener usuario actual
  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Método para establecer usuario manualmente (si lo necesitas)
  setUsuario(usuario: Usuario | null): void {
    this.usuarioSubject.next(usuario);
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }
}