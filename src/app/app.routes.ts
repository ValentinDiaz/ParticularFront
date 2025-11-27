import { Routes } from '@angular/router';
import { permisosGuard } from './guards/permisos.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'buscar-profesor',
    loadComponent: () =>
      import('./pages/buscar-profesor/buscar-profesor.page').then(
        (m) => m.BucasProfesorPage
      ),
    canActivate: [permisosGuard],
  },
  {
    path: 'perfil-profesor/:id',
    loadComponent: () =>
      import('./pages/perfil-profesor/perfil-profesor.page').then(
        (m) => m.PerfilProfesorPage
      ),
    canActivate: [permisosGuard],
  },
  {
    path: 'perfil-profesor',
    loadComponent: () =>
      import('./pages/perfil-profesor/perfil-profesor.page').then(
        (m) => m.PerfilProfesorPage
      ),
  },
  {
    path: 'registro-profesor',
    loadComponent: () =>
      import('./pages/registro-profesor/registro-profesor.page').then(
        (m) => m.RegistroProfesorPage
      ),
  },
  {
    path: 'perfil-usuario/:id',
    loadComponent: () =>
      import('./pages/perfil-usuario/perfil-usuario.page').then(
        (m) => m.PerfilUsuarioPage
      ),
  },
];
