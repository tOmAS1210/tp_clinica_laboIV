import { Auth } from '@angular/fire/auth';
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },

  {
    path: 'bienvenido',
    loadComponent: () =>
      import('./bienvenido/bienvenido.component').then(
        (c) => c.BienvenidoComponent
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    canActivate: [authGuard],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
  },

  {
    path: 'seccionUsuarios',
    loadComponent: () =>
      import('./seccion-usuarios/seccion-usuarios.component').then(
        (c) => c.SeccionUsuariosComponent
      ),
  },

  {
    path: 'misTurnos',
    loadComponent: () =>
      import('./mis-turnos/mis-turnos.component').then(
        (c) => c.MisTurnosComponent
      ),
  },

  {
    path: 'turnos',
    loadComponent: () =>
      import('./turnos/turnos.component').then((c) => c.TurnosComponent),
  },

  {
    path: 'solicitarTurnos',
    loadComponent: () =>
      import('./solicitar-turno/solicitar-turno.component').then(
        (c) => c.SolicitarTurnoComponent
      ),
  },

  {
    path: 'miPerfil',
    loadComponent: () =>
      import('./mi-perfil/mi-perfil.component').then(
        (c) => c.MiPerfilComponent
      ),
  },

  {
    path: 'usuarios',
    loadComponent: () =>
      import('./usuarios/usuarios.component').then((c) => c.UsuariosComponent),
  },

  {
    path: 'pacientes',
    loadComponent: () =>
      import('./pacientes/pacientes.component').then(
        (c) => c.PacientesComponent
      ),
  },
];
