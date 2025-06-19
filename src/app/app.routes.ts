import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {AppComponent} from './app.component';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AuthRoutes),
  },

  {
    path: '',
    loadChildren: () => import('./pages/pages.routes').then(m => m.PagesRoutes),
    canActivate: [authGuard],
  }
];
