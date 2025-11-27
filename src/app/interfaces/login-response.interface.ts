import { Usuario } from './usuario.interface';

export interface LoginResponse {
  message: string;
  user: Usuario;
}
