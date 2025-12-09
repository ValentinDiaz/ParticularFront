import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Materia } from '../interfaces/materia.interface';
import { Nivel } from '../interfaces/nivel.interface';
import { Area } from '../interfaces/area.interface';
@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  constructor(private http: HttpClient) {}

  private URL_BASE = 'http://localhost:3000/api/';
  private URL_BASE_MATERIAS = 'http://localhost:3000/api/materias';
  private URL_BASE_NIVELES = 'http://localhost:3000/api/niveles';
  private URL_BASE_AREA = 'http://localhost:3000/api/categorias';

  private endPoints = {
    obtenerAreasPorNivel: '/nivel/',
    obtenerMateriaPorArea: '/categoria/',
    
  };


  obtenerMateriaPorAreaYNivel(areaId: number, nivelId: number): Observable<Materia[]> {
  const url = `${this.URL_BASE_MATERIAS}${this.endPoints.obtenerMateriaPorArea}${areaId}/nivel/${nivelId}`;
  return this.http.get<Materia[]>(url, { withCredentials: true });
}

  obtenerAreasPorNivel(id: number): Observable<Area[]> {
    const url = `${this.URL_BASE_AREA}${this.endPoints.obtenerAreasPorNivel}${id}`;
    return this.http.get<Area[]>(url, {
      withCredentials: true,
    });
  }

  // Obtener materias
  obtenerTodasMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.URL_BASE_MATERIAS, {
      withCredentials: true,
    });
  }
  

  obtenerNivles(): Observable<Nivel[]> {
    const url = this.URL_BASE_NIVELES;
    const data = this.http.get<Nivel[]>(url, {
      withCredentials: true,
    });
    return data;
  }
}
