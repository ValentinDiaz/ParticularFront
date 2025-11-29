import { Materia } from "./materia.interface";

export interface Profesor {
  foto_url: string;
  id: number;
  nombre: string;
  apellido:string;
  email: string;
  precio_hora:number;
  telefono:number;
  experiencia:string;
  materias:Materia[];
  id_usuario:number;
}