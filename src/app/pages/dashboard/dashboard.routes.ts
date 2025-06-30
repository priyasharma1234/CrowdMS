import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { AddEscrowComponent } from './add-escrow/add-escrow.component';
import { exitGuard } from 'src/app/core/guards/exit.guard';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-list/dashboard-list.component').then(m => m.DashboardListComponent)
      }, {
        path: 'select-service',
        component: SelectServiceComponent
      }, {
        path: 'add-escrow',
        component: AddEscrowComponent,
        canDeactivate: [exitGuard]
      }, {
        path: 'edit-escrow/:id',
        component: AddEscrowComponent,
        canDeactivate: [exitGuard]
      }
    ]

  }
];
