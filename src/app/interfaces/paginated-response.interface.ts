import { Usuario } from './usuario.interface';
import { Profesor } from './profesor.interface';

export interface PaginatedUsuarios {
  total: number;
  page: number;
  totalPages: number;
  usuarios: Usuario[];
}

export interface PaginatedProfesores {
  total: number;
  page: number;
  totalPages: number;
  profesores: Profesor[];
}
