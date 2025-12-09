import { RegistroProfesorPage } from './../pages/registro-profesor/registro-profesor.page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../interfaces/profesor.interface';
import { ProfesorRequest } from '../interfaces/profesor-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  constructor(private http: HttpClient) {}

  private URL_BASE = 'http://localhost:3000/api/profesores';
  private URL_RESENIAS = 'http://localhost:3000/api/calificacion';

  private endPoints = {
    obtenerProfesorPorMateria: '/materia/',
    obternerProfesorPorUsuario: '/usuario/',
    resgistarProfesor: '/registroProfesor',
  };



  actualizarProfesor(
    id: number,
    profesorData: Partial<ProfesorRequest>
  ): Observable<ProfesorRequest> {
    const url = `${this.URL_BASE}/${id}`;
    return this.http.put<ProfesorRequest>(url, profesorData, {
      withCredentials: true,
    });
  }







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





  registrarProfesor(profesorData: FormData): Observable<ProfesorRequest> {
    const url = `${this.URL_BASE}`;
    return this.http.post<ProfesorRequest>(url, profesorData, {
      withCredentials: true,
    });
  } 



  calificarProfesor( profesorId:number , calificacionData: any): Observable<any> {
    const url = `${this.URL_RESENIAS}/${profesorId}`;
    return this.http.post<any>(url, calificacionData, {
      withCredentials: true,
    });
  }
}
