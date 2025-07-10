// import { Routes } from '@angular/router';
// import { PagesComponent } from './pages.component';
// import { StamentsGuardGuard } from '../core/guards/staments-guard.guard';

// export const PagesRoutes: Routes = [
//   {
//     path: '',
//     component: PagesComponent,
//     children: [
//       {
//         path: 'dashboard',
//         loadChildren: () =>
//           import('./dashboard/dashboard.routes').then(m => m.DashboardRoutes)
//       },
//        {
//         path: 'staff',
//         loadChildren: () =>
//             import('./staff-management/staff-management.routes').then(m => m.staffManagementRoutes)
//     },

//     ]
//   }

// ];
import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { StamentsGuardGuard } from '../core/guards/staments-guard.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    // canActivateChild: [StamentsGuardGuard], // optional guard for all children
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then(m => m.DashboardRoutes)
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./staff-management/staff-management.routes').then(m => m.staffManagementRoutes)
      },
      {
        path: 'release-requests',
        loadComponent: () => import('./release/release.component').then(m => m.ReleaseComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];
