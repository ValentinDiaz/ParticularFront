import { Profesor } from "./profesor.interface";

export interface Mensaje {
  tipo: 'usuario' | 'ia';
  texto: string;
  profesores?: Profesor[];
  timestamp: Date;
}