import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'forgot-user-id',
        loadComponent: () => import('./forgot-userid/forgot-userid.component').then(m => m.ForgotUseridComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        data: { type: 'reset' }
      },
      {
        path: 'create-password',
        loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        data: { type: 'create' }
      }
    ]
  }
];
