export interface Calificacion {
  id: number;
  estrellas: number;
  comentario: string;
  createdAt: string;
  usuario: { id: number; nombre: string; apellido: string };
  profesor: { id: number; nombre: string; apellido: string };
}

export interface CalificacionRequest {
  estrellas: number;
  comentario?: string;
}
