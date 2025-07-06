

export const DOWNLOAD_TYPE = [
  { name: 'XLSX', value: '.xlsx' },
  // { name: 'XLS', value: '.xls' },
  { name: 'CSV', value: '.csv' },
] as const;



export const Permissions = {
  SERVICEREQUEST: {
    module: 'sr',
    enabled: true,
    permissions: {
      ServiceRequestList: 'sr-list',
      ServiceRequestUpdate: 'sr-update',
    }
  },
  CREWS: {
    module: 'crews',
    enabled: true,
    permissions: {
      CrewsList: 'crews-list',
      CrewsUpdate: 'crews-update',
      CrewsCreate: 'crews-create'
    }
  },
  CUSTODIANS: {
    module: 'custodians',
    enabled: true,
    permissions: {
      CustodiansList: 'custodians-list',
      CustodiansUpdate: 'custodians-update',
      CustodiansCreate: 'custodians-create'
    }
  },
  CREWMEMBERS: {
    module: 'crew-members',
    enabled: true,
    permissions: {
      CrewMembersList: 'crew-members-list',
      CrewMembersUpdate: 'crew-members-update',
      CrewMembersCreate: 'crew-members-create'
    }
  },
  Vehicles: {
    module: 'vehicles',
    enabled: true,
    permissions: {
      VehiclesList: 'vehicles-list',
      VehiclesUpdate: 'vehicles-update',
      VehiclesCreate: 'vehicles-create'
    }
  },
  HUBS: {
    module: 'hubs',
    enabled: true,
    permissions: {
      HubsList: 'hubs-list',
      HubsUpdate: 'hubs-update',
      HubsCreate: 'hubs-create'
    }
  },
  CORPORATEUSERS: {
    module: 'corporate-users',
    enabled: true,
    permissions: {
      CorporateUsersList: 'corporate-users-list',
      CorporateUsersUpdate: 'corporate-users-update',
      CorporateUsersCreate: 'corporate-users-create'
    }
  },
  CORPORATES: {
    module: 'corporates',
    enabled: true,
    permissions: {
      CorporatesList: 'corporates-list',
      CorporatesUpdate: 'corporates-update',
      CorporatesCreate: 'corporates-create'
    }
  },
  ROLES: {
    module: 'roles',
    enabled: true,
    permissions: {
      RolesList: 'roles-list',
      RolesUpdate: 'roles-update',
      RolesCreate: 'roles-create',
      permissionsList: 'permissions-list',
      permissionsUpdate: 'permissions-update',
      permissionsCreate: 'permissions-create'
    }
  },
  STAFF: {
    module: 'staff',
    enabled: true,
    permissions: {
      StaffList: 'staff-list',
      StaffUpdate: 'staff-update',
      StaffCreate: 'staff-create'
    }
  }
} as const;

export type IPermissions = {
  [key in keyof typeof Permissions]: IPermissionsElement;
}

export type IPermissionsElement = {
  module: string;
  enabled: boolean;
  permissions: string[];
}
export type IPermissionsServiceElement = {
  module: string;
  enabled: boolean;
  permission: string[];
}

export const Staff_Management_Sub_Menu = [
  {
    id: 1,
    value: 'Staff List',
    routePath: '/staff/staff-list',
    icon: 'assets/img/svg/staff-list.svg',
    // permission: Permissions.STAFF.permissions.StaffList,
  },
  {
    id: 2,
    value: 'Role List',
    routePath: '/staff/role-list',
    icon: 'assets/img/svg/role-list.svg',
    // permission: Permissions.ROLES.permissions.RolesList,
  },
  {
    id: 3,
    value: 'Permission List',
    routePath: '/staff/permissions',
    icon: 'assets/img/svg/permissions-list.svg',
    // permission: Permissions.ROLES.permissions.permissionsList,
  }

] as const;


export const Side_Bar: any = [
  {
    id: 1,
    name: 'Dashboard',
    is_active: 1,
    icon: 'assets/img/svg/dashboard.svg',
    routeUrl: 'dashboard',
    // module: Permissions.SERVICEREQUEST.module,
    // subMenu: [...Service_Requests_Mode],
  },
  {
    id: 2,
    name: 'Staff Management',
    is_active: 1,
    icon: 'assets/img/svg/staff-management.svg',
    routeUrl: 'staff/staff-list',
    // module: Permissions.STAFF.module,
    subMenu: [...Staff_Management_Sub_Menu],
  },
  {
    id: 3,
    name: 'Release Requests',
    is_active: 1,
    icon: 'assets/img/svg/release-requests.svg',
    routeUrl: 'release-requests',
  }

] as const;

