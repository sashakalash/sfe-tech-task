import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { USERS_PATH } from '@app/features/users/users.routes';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { tokenInterceptor } from '@core/interceptors/token.interceptor';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: USERS_PATH,
    loadChildren: () =>
      import('./features/users/users.routes').then((r) => r.USERS_ROUTES),
    canActivate: [AuthGuard],
    providers: [provideHttpClient(withInterceptors([tokenInterceptor]))],
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
];
