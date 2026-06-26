import { Materia } from './materia.interface';

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  experiencia: string;
  precio_hora: number;
  foto: string;
  rating_promedio: number;
  cantidad_calificaciones: number;
  usuario_id: number;
  materias: Materia[];
  createdAt?: string;
  updateAt?: string;
}
