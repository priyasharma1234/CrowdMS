

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
    icon: `<svg width="18" height="19" viewBox="0 0 18 19" fill="" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.44444 14.3701H12.5556M8.12684 1.45116L2.09812 6.23824C1.69513 6.55824 1.49364 6.71824 1.34847 6.91861C1.21988 7.0961 1.12409 7.29605 1.0658 7.50865C1 7.74865 1 8.00926 1 8.53052V15.0961C1 16.1125 1 16.6207 1.19377 17.009C1.3642 17.3505 1.63617 17.6282 1.97068 17.8022C2.35097 18 2.84879 18 3.84444 18H14.1556C15.1512 18 15.6491 18 16.0293 17.8022C16.3638 17.6282 16.6358 17.3505 16.8062 17.009C17 16.6207 17 16.1125 17 15.0961V8.53052C17 8.00926 17 7.74865 16.9342 7.50865C16.8759 7.29605 16.7801 7.0961 16.6516 6.91861C16.5064 6.71824 16.3049 6.55824 15.9019 6.23825L9.87316 1.45116C9.56089 1.20319 9.40471 1.0792 9.23227 1.03154C9.08018 0.989487 8.91982 0.989487 8.76773 1.03154C8.59529 1.0792 8.43911 1.20319 8.12684 1.45116Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
</svg>`,
    routeUrl: 'dashboard',
    // module: Permissions.SERVICEREQUEST.module,
    // subMenu: [...Service_Requests_Mode],
  },
  {
    id: 2,
    name: 'Staff Management',
    is_active: 1,
    icon: `<svg width="18" height="19" fill="none"  xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
  <path d="m13.5,12c0,2.206,1.794,4,4,4s4-1.794,4-4-1.794-4-4-4-4,1.794-4,4Zm4-2c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm-5.5-2c2.206,0,4-1.794,4-4S14.206,0,12,0s-4,1.794-4,4,1.794,4,4,4Zm0-6c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm-5.5,14c2.206,0,4-1.794,4-4s-1.794-4-4-4-4,1.794-4,4,1.794,4,4,4Zm0-6c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm17.5,11v3h-2v-3c0-.938-.636-1.717-1.511-1.934l-2.983,3.457-3.023-3.447c-.859.227-1.483,1.002-1.483,1.923v3h-2v-3c0-.938-.636-1.717-1.51-1.934l-2.984,3.457-3.023-3.447c-.859.227-1.483,1.002-1.483,1.923v3H0v-3c0-2.148,1.686-3.899,3.839-3.987l.478-.02,2.178,2.483,2.141-2.481.474.013c1.166.032,2.186.557,2.893,1.362.697-.791,1.697-1.312,2.836-1.358l.478-.02,2.178,2.483,2.141-2.481.474.013c2.182.06,3.891,1.813,3.891,3.991Z" stroke="" stroke-width="20"/>
</svg>
`,
    routeUrl: 'staff/staff-list',
    // module: Permissions.STAFF.module,
    subMenu: [...Staff_Management_Sub_Menu],
  },
  {
    id: 3,
    name: 'Release Requests',
    is_active: 1,
  icon: `<svg width="18" height="19" viewBox="0 0 18 19" fill="" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.44444 14.3701H12.5556M8.12684 1.45116L2.09812 6.23824C1.69513 6.55824 1.49364 6.71824 1.34847 6.91861C1.21988 7.0961 1.12409 7.29605 1.0658 7.50865C1 7.74865 1 8.00926 1 8.53052V15.0961C1 16.1125 1 16.6207 1.19377 17.009C1.3642 17.3505 1.63617 17.6282 1.97068 17.8022C2.35097 18 2.84879 18 3.84444 18H14.1556C15.1512 18 15.6491 18 16.0293 17.8022C16.3638 17.6282 16.6358 17.3505 16.8062 17.009C17 16.6207 17 16.1125 17 15.0961V8.53052C17 8.00926 17 7.74865 16.9342 7.50865C16.8759 7.29605 16.7801 7.0961 16.6516 6.91861C16.5064 6.71824 16.3049 6.55824 15.9019 6.23825L9.87316 1.45116C9.56089 1.20319 9.40471 1.0792 9.23227 1.03154C9.08018 0.989487 8.91982 0.989487 8.76773 1.03154C8.59529 1.0792 8.43911 1.20319 8.12684 1.45116Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
</svg>`,
    routeUrl: 'release-requests',
  },
  {
    id: 4,
    name: 'Requests',
    is_active: 1,
    icon: `<svg width="18" height="19" viewBox="0 0 18 19" fill="" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.44444 14.3701H12.5556M8.12684 1.45116L2.09812 6.23824C1.69513 6.55824 1.49364 6.71824 1.34847 6.91861C1.21988 7.0961 1.12409 7.29605 1.0658 7.50865C1 7.74865 1 8.00926 1 8.53052V15.0961C1 16.1125 1 16.6207 1.19377 17.009C1.3642 17.3505 1.63617 17.6282 1.97068 17.8022C2.35097 18 2.84879 18 3.84444 18H14.1556C15.1512 18 15.6491 18 16.0293 17.8022C16.3638 17.6282 16.6358 17.3505 16.8062 17.009C17 16.6207 17 16.1125 17 15.0961V8.53052C17 8.00926 17 7.74865 16.9342 7.50865C16.8759 7.29605 16.7801 7.0961 16.6516 6.91861C16.5064 6.71824 16.3049 6.55824 15.9019 6.23825L9.87316 1.45116C9.56089 1.20319 9.40471 1.0792 9.23227 1.03154C9.08018 0.989487 8.91982 0.989487 8.76773 1.03154C8.59529 1.0792 8.43911 1.20319 8.12684 1.45116Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path>
</svg>`,
    routeUrl: 'requests',
  }

] as const;

