import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { AddEscrowComponent } from './add-escrow/add-escrow.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '', 
        loadComponent: () => import('./dashboard-list/dashboard-list.component').then(m => m.DashboardListComponent)
      },{
        path: 'select-service',
        component: SelectServiceComponent
      },{
        path: 'add-escrow',
        component: AddEscrowComponent
      }
    ]

  }
];
