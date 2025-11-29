export interface ProfesorRequest {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  precio_hora: number;
  foto_url?: string;
  experiencia: string;
  materias_id: number[];
}