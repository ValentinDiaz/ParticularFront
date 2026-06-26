import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request.interface';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();
  private URL_BASE = 'http://localhost:3000/api/auth';

  private endPoints = {
    login: '/login',
    register: '/registro',
    logOut: '/logout',
    me: '/me',
    refres_token: '/refresh-token',
  };

  constructor(private http: HttpClient) {
    // La sesión vive en cookies httpOnly: la única fuente de verdad es el backend
    this.cargarUsuarioDesdeSesion().subscribe({
      error: () => this.clearUserData(),
    });
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
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
        }),
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.clearUserData();
          }
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
        }),
        map((res) => res.user)
      );
  }

  // Registro
  register(usuario: Partial<Usuario> & { password: string }): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.URL_BASE + this.endPoints.register, usuario, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.usuarioSubject.next(user);
        })
      );
  }

  // Logout (invalida la sesión en todos los dispositivos del usuario)
  logOut(): Observable<any> {
    return this.http
      .post(
        this.URL_BASE + this.endPoints.logOut,
        {},
        { withCredentials: true }
      )
      .pipe(finalize(() => this.clearUserData()));
  }

  // Limpiar datos del usuario en memoria
  private clearUserData(): void {
    this.usuarioSubject.next(null);
  }

  // Refresh token (normalmente no hace falta llamarlo manual, el backend auto-refresca)
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

  // Método para establecer usuario manualmente (ej: tras editar perfil)
  setUsuario(usuario: Usuario | null): void {
    this.usuarioSubject.next(usuario);
  }
}
