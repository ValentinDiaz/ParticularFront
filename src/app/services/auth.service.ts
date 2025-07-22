import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Materia } from '../interfaces/materia.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private URL_BASE = 'http://localhost:3000/api/auth';
    private URL_BASE_MATERIAS = 'http://localhost:3000/api/materias';


  private endPoints = {
    login: '/login',
    register: '/register',
    logOut: '/logout',
    me: '/me',
    profesorRegister: '/profeRegister',
    refres_token: '/refresh-token',

  };

  login(data: LoginRequest): Observable<LoginResponse> {
    const url = this.URL_BASE + this.endPoints.login;
    return this.http.post<LoginResponse>(url, data, {
      withCredentials: true,
    });
  }

  logOut(): Observable<any> {
    const url = this.URL_BASE + this.endPoints.logOut;
    return this.http.post(url, {}, { withCredentials: true });
  }

 obtenerTodasMaterias(): Observable<Materia[]> {
  return this.http.get<Materia[]>(this.URL_BASE_MATERIAS, {
    withCredentials: true
  });
}


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
}
