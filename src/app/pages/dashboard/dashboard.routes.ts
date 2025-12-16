import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-list/dashboard-list.component').then(m => m.DashboardListComponent)
      }
    ]

  }
];
