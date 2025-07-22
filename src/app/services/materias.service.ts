import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Materia } from '../interfaces/materia.interface';
import { Nivel } from '../interfaces/nivel.interface';
@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(private http: HttpClient) {

   }


    private URL_BASE = 'http://localhost:3000/api/';
    private URL_BASE_MATERIAS = 'http://localhost:3000/api/materias';
        private URL_BASE_NIVELES = 'http://localhost:3000/api/niveles';




  private endPoints = {

  };


   obtenerNivles (): Observable<Nivel[]> {
    const url = this.URL_BASE
    const data = this.http.get<Nivel[]>(url, {
      withCredentials: true,
    });
    return data;
  }
}
