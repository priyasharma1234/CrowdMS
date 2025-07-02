import { StaffManagementComponent } from './staff-management.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { RoleListComponent } from './role-management/role-list/role-list.component';
import { RoleCreateComponent } from './role-management/role-create/role-create.component';
import { PermissionListComponent } from './permission-management/permission-list/permission-list.component';

export const staffManagementRoutes = [
  {
    path: '',
    children: [
      {
        path: 'role-list',
        component: RoleListComponent,
      },
      {
        path: 'add',
        component: RoleCreateComponent,
      },
      {
        path: 'role-edit',
        component: RoleCreateComponent,
        data: { edit: true, role: 'role-update' },
      },
      {
        path: 'permissions',
        component: PermissionListComponent,
        data: { page: 'permission' },
      },
      {
        path: 'staff-list',
        component: StaffListComponent,
      }
      // {
      //   path: 'add-staff',
      //   component: AddStaffComponent,
      // },
      // {
      //   path: 'edit-staff/:id',
      //   component: AddStaffComponent,
      // },
    ],
    component: StaffManagementComponent,
  },
];
