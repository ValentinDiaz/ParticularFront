import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// URLs que NUNCA deben disparar el flujo de refresh/logout automático:
// - login/registro: un 401/400 ahí es "credenciales inválidas", no "sesión vencida"
// - refresh-token: si esto falla, ya estamos en el flujo de refresh, no hay que reintentarlo
// - me: lo usa AuthService para chequear si hay sesión activa; un 401 ahí es normal
//       para un visitante anónimo y NO debe forzar un logout ni una redirección
const EXCLUDED_URLS = ['/auth/login', '/auth/registro', '/auth/refresh-token', '/auth/me'];

function isExcludedUrl(url: string): boolean {
  return EXCLUDED_URLS.some((excluded) => url.includes(excluded));
}

// Comparte una única llamada a /refresh-token entre todas las requests que
// fallen con 401 al mismo tiempo, en vez de que cada una dispare su propio refresh.
let refreshInProgress$: Observable<any> | null = null;

function getOrCreateRefresh(authService: AuthService): Observable<any> {
  if (!refreshInProgress$) {
    refreshInProgress$ = authService.refreshToken().pipe(
      finalize(() => {
        refreshInProgress$ = null;
      }),
      shareReplay(1)
    );
  }
  return refreshInProgress$;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isExcludedUrl(req.url)) {
        return throwError(() => error);
      }

      return getOrCreateRefresh(authService).pipe(
        switchMap(() => next(req)),
        catchError((refreshError) => {
          authService.logOut().subscribe();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
