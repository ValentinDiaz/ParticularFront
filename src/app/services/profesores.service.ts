import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../interfaces/profesor.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  constructor(private http: HttpClient) {}

  private URL_BASE = 'http://localhost:3000/api/profesores';

  private endPoints = {
    obtenerProfesorPorMateria: '/materia/',
    obternerProfesorPorUsuario: '/usuario/',
  };

  obtenerProfesorPorId(id: number): Observable<Profesor> {
    const url = `${this.URL_BASE}/${id}`;
    return this.http.get<Profesor>(url, { withCredentials: true });
  }

  obtenerProfesorPorIdUsuario(id_usuario: number): Observable<Profesor> {
    const url = `${this.URL_BASE}${this.endPoints.obternerProfesorPorUsuario}${id_usuario}`;
    return this.http.get<Profesor>(url, { withCredentials: true });
  }


  obtenerProfesorByMateria(
    id: number,
    page: number = 1,
    limit: number = 10
  ): Observable<Profesor[]> {
    const url = `${this.URL_BASE}${this.endPoints.obtenerProfesorPorMateria}${id}?page=${page}&limit=${limit}`;
    return this.http.get<Profesor[]>(url, { withCredentials: true });
  }
}
