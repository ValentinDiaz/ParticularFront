import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from '../interfaces/profesor.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  private URL_BASE = 'http://localhost:3000/api/usuarios';

  private endPoints = {
    favoritos: '/favoritos',
  };

  actualizarUsuario(
    id: number,
    usuarioData: Partial<Usuario>
  ): Observable<Usuario> {
    const url = `${this.URL_BASE}/${id}`;
    return this.http.put<Usuario>(url, usuarioData, {
      withCredentials: true,
    });
  }

  agregarFavorito(profesorId: number, usuarioId: number) {
  const url = `${this.URL_BASE}/${usuarioId}${this.endPoints.favoritos}/${profesorId}`;
  return this.http.post(
    url,
    {}, // body vacío
    { withCredentials: true }
  );
}

  quitarFavorito(profesorId: number, usuarioId: number) {
    const url = `${this.URL_BASE}/${usuarioId}${this.endPoints.favoritos}/${profesorId}`;
    return this.http.delete(url, {
      withCredentials: true,
    });
  }

  obtenerFavoritos(usuarioId:number){
    const url = `${this.URL_BASE}/${usuarioId}${this.endPoints.favoritos}`;
    return this.http.get<Profesor[]>(url, { withCredentials: true });

  }
}
