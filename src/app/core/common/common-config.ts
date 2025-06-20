import { config } from '@core/services/request-url.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

export const KYC_Service_Steps = [
  { name: 'Contact Details', selected: 1, sub_type: [], status: 4 },
  { name: 'Business Details', selected: 2, sub_type: [], status: 4 },
  { name: 'Verify Documents', selected: 3, sub_type: [], status: 4 },
  { name: 'Bank Details', selected: 9, sub_type: [], status: 4 },
] as const;
export const SEARCH_BY = [
  { name: 'Sr.No', value: 'Sr.No' },
  { name: 'Txn Id', value: 'Txn Id' },
  { name: 'Ref Id', value: 'Ref Id' },
  { name: 'Mobile', value: 'Mobile' },
  { name: 'User Name', value: 'username' },
] as const;

export const STATUS = [
  // { name: 'All', value: '' },
  { name: 'Success', value: '1' },
  { name: 'In Process', value: '2' },
  // { name: 'Processing', value: '3' },
  // { name: 'Processed', value: '4 ' },
  { name: 'Failed', value: '0' },
] as const;

export const STATUS1 = {
  2: 'In Process',
  3: 'In Process',
  4: 'In Process',
  1: 'Success',
  0: 'Failed',
} as const;

export const STATUS2 = {
  5: 'Exception',
  4: 'Authorized',
  3: 'Authorizing',
  2: 'Awaiting for authorize',
  1: 'Success',
  0: 'Failed',
} as const;
export const STATUS3 = {
  4: 'Authorized',
  3: 'Authorizing',
  2: 'Non Authorized',
  1: 'Success',
  0: 'Failed',
}

export const DOWNLOAD_TYPE = [
  { name: 'XLSX', value: '.xlsx' },
  // { name: 'XLS', value: '.xls' },
  { name: 'CSV', value: '.csv' },
] as const;

export const FILTER_TYPE = [
  { name: 'Saving Accounts', value: 'saving' },
  { name: 'Current Accounts', value: 'current' },
  { name: 'FD Accounts', value: 'fd' },
  { name: 'Loan Accounts', value: 'loan' },
  { name: 'All', value: '' },
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

export const Custordian_Crew_Mode = [
  {
    id: 1,
    value: 'Custordian',
    routePath: '/custodian/custodian-list',
    icon: 'assets/assets/img/svg/custodinal.svg',
    permission: Permissions.CUSTODIANS.permissions.CustodiansList,
  },
  {
    id: 2,
    value: 'Crew Member',
    routePath: '/custodian/crew-member-list',
    icon: 'assets/assets/img/svg/crew.svg',
    permission: Permissions.CREWMEMBERS.permissions.CrewMembersList,
  },
  {
    id: 3,
    value: 'Crew',
    routePath: '/custodian/crew-list',
    icon: 'assets/assets/img/svg/crew.svg',
    permission: Permissions.CREWS.permissions.CrewsList,
  }

] as const;
export const Corporate_Mode = [
  {
    id: 1,
    value: 'Corporate',
    routePath: '/corporate/corporate-list',
    icon: 'assets/assets/img/svg/corporation.svg',
    permission: Permissions.CORPORATES.permissions.CorporatesList,
  },
  {
    id: 2,
    value: 'Corporate User',
    routePath: '/corporate/corporate-user-list',
    icon: 'assets/assets/img/svg/corporation.svg',
    permission: Permissions.CORPORATEUSERS.permissions.CorporateUsersList,
  }

] as const;
export const Service_Requests_Mode = [
  {
    id: 1,
    value: 'Service Request List',
    routePath: '/service-requests',
    icon: 'assets/assets/img/svg/raise-sr.svg',
    permission: Permissions.SERVICEREQUEST.permissions.ServiceRequestList,
  }, {
    id: 1,
    value: 'Service Request Pending List',
    routePath: '/service-requests/service-request-pending-list',
    icon: 'assets/assets/img/svg/raise-sr.svg',
    permission: Permissions.SERVICEREQUEST.permissions.ServiceRequestList,
  },
  {
    id: 2,
    value: 'Service Request Edit',
    routePath: '/service-requests/service-request-edit',
    icon: 'assets/assets/img/svg/raise-sr.svg',
    permission: Permissions.SERVICEREQUEST.permissions.ServiceRequestUpdate,
  },
  

] as const;
export const User_Management_Sub_Menu = [
  {
    id: 1,
    value: 'Role List',
    routePath: '/roles/role-list',
    icon: 'assets/assets/img/svg/User-Management.svg',
    permission: Permissions.ROLES.permissions.RolesList,
  },
  {
    id: 2,
    value: 'Permission List',
    routePath: '/roles/permissions',
    icon: 'assets/assets/img/svg/User-Management.svg',
    permission: Permissions.ROLES.permissions.RolesList,
  }

] as const;
export const Staff_Management_Sub_Menu = [
  {
    id: 1,
    value: 'Staff List',
    routePath: '/staff/staff-list',
    icon: 'assets/assets/img/svg/Staff-Management.svg',
    permission: Permissions.STAFF.permissions.StaffList,
  },
  {
    id: 2,
    value: 'Role List',
    routePath: '/staff/role-list',
    icon: 'assets/assets/img/svg/Staff-Management.svg',
    permission: Permissions.ROLES.permissions.RolesList,
  },
  {
    id: 3,
    value: 'Permission List',
    routePath: '/staff/permissions',
    icon: 'assets/assets/img/svg/Staff-Management.svg',
    permission: Permissions.ROLES.permissions.permissionsList,
  }

] as const;


export const Side_Bar: any = [
  {
    id: 1,
    name: 'Service Requests',
    is_active: 1,
    icon: 'assets/assets/img/svg/raise-sr.svg',
    routeUrl: 'service-requests',
    module: Permissions.SERVICEREQUEST.module,
    subMenu: [...Service_Requests_Mode],
  }, {
    id: 2,
    name: 'Custodians & Crews',
    is_active: 1,
    icon: 'assets/assets/img/svg/custodian-crew.svg',
    routeUrl: 'custodian',
    module: Permissions.CUSTODIANS.module,
    subMenu: [...Custordian_Crew_Mode],
  },
  {
    id: 3,
    name: 'Vaults',
    is_active: 1,
    icon: 'assets/assets/img/svg/Vaults.svg',
    routeUrl: 'hubs',
    module: Permissions.Vehicles.module,
  }, {
    id: 4,
    name: 'Vehicles',
    is_active: 1,
    icon: 'assets/assets/img/svg/Vehicle.svg',
    routeUrl: 'vehicles',
    module: Permissions.HUBS.module,
  },
  {
    id: 5,
    name: 'Corporates',
    is_active: 1,
    icon: 'assets/assets/img/svg/corporation.svg',
    routeUrl: 'corporate',
    module: Permissions.CORPORATES.module,
    subMenu: [...Corporate_Mode],
  },
  {
    id: 6,
    name: 'User Management',
    is_active: 1,
    icon: 'assets/assets/img/svg/User-Management.svg',
    routeUrl: 'roles/role-list',
    module: Permissions.ROLES.module,
    subMenu: [...User_Management_Sub_Menu],
  },
  {
    id: 7,
    name: 'Staff Management',
    is_active: 1,
    icon: 'assets/assets/img/svg/Staff-Management.svg',
    routeUrl: 'roles/role-list',
    module: Permissions.STAFF.module,
    subMenu: [...Staff_Management_Sub_Menu],
  }

] as const;

