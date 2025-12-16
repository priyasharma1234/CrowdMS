import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { CrowdEntriesComponent } from './crowd-entries/crowd-entries.component';

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
        {
    path: 'crowd-entries',
    component: CrowdEntriesComponent
  },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];
