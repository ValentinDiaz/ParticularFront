import { Materia } from "./materia.interface";

export interface Profesor {
  foto: string;
  id: number;
  nombre: string;
  apellido:string;
  email: string;
  precio_hora:number;
  telefono:number;
  experiencia:string;
  materias:Materia[];
  id_usuario:number;
  rating_promedio:number;
  cantidad_calificacione:number;
  resenias:string[];
}