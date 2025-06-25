import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then(m => m.DashboardRoutes)
      },

    ]
  }

];
