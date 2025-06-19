import {Routes} from '@angular/router';
import {PagesComponent} from './pages.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

    ]
  }

];
