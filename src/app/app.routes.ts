import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users-page/users-page.component').then(m => m.UsersPageComponent),
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
]
