import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya hay usuario en memoria, permitir acceso
  if (authService.isLogged()) {
    return true;
  }

  // Sino, verificar sesión con el backend
  return authService.cargarUsuarioDesdeSesion().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};