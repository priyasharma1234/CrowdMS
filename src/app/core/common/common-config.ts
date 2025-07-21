

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
    icon: `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M21 11h-5c-1.654 0-3 1.346-3 3v7c0 1.654 1.346 3 3 3h5c1.654 0 3-1.346 3-3v-7c0-1.654-1.346-3-3-3Zm1 10c0 .551-.448 1-1 1h-5c-.552 0-1-.449-1-1v-7c0-.551.448-1 1-1h5c.552 0 1 .449 1 1v7Zm-1-5.003a1 1 0 0 1-1 1h-3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1ZM21 19a1 1 0 0 1-1 1h-3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1ZM9 12c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6ZM9 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4Zm2 13a1 1 0 0 1-1 1H9c-3.859 0-7 3.14-7 7a1 1 0 1 1-2 0c0-4.962 4.037-9 9-9h1a1 1 0 0 1 1 1Z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>`,
    // permission: Permissions.STAFF.permissions.StaffList,
  },
  {
    id: 2,
    value: 'Role List',
    routePath: '/staff/role-list',
    icon:`
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M19 1H5C2.243 1 0 3.243 0 6v12c0 2.757 2.243 5 5 5h14c2.757 0 5-2.243 5-5V6c0-2.757-2.243-5-5-5Zm3 17c0 1.654-1.346 3-3 3H5c-1.654 0-3-1.346-3-3V6c0-1.654 1.346-3 3-3h14c1.654 0 3 1.346 3 3v12ZM19 7a1 1 0 0 1-1 1h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 1 1ZM8 7a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 8 7Zm11 5a1 1 0 0 1-1 1h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 1 1ZM8 12a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 8 12Zm11 5a1 1 0 0 1-1 1h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 1 1ZM8 17a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 8 17Z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>`,
    // permission: Permissions.ROLES.permissions.RolesList,
  },
  {
    id: 3,
    value: 'Permission List',
    routePath: '/staff/permissions',
    icon: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="25" height="25" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512;background: #000;" xml:space="preserve" class=""><g><path d="M24 14c0 2.757-2.243 5-5 5h-6v3h4a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h4v-3H5c-2.757 0-5-2.243-5-5V5c0-2.757 2.243-5 5-5h6a1 1 0 1 1 0 2H5C3.346 2 2 3.346 2 5v9c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3a1 1 0 1 1 2 0zM10 8a2 2 0 1 0-3.999-.001A2 2 0 0 0 10 8zm-5.937 5.649a1 1 0 0 0 1.873.701c.303-.808 1.132-1.351 2.063-1.351s1.761.543 2.063 1.351a1.001 1.001 0 0 0 1.873-.701C11.341 12.064 9.759 11 7.998 11s-3.343 1.064-3.937 2.649zm8.936-6.648V3.524c0-1.029.657-1.94 1.635-2.266L18.028.134c.307-.102.637-.102.943 0l3.392 1.124C23.342 1.583 24 2.494 24 3.524V7c0 3.969-3.639 5.738-4.754 6.187 0 0-.244.184-.745.184-.328 0-.853-.25-.853-.25C16.56 12.577 13 10.523 13 7.001zM18 6.5V10a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1H19v-3a2.002 2.002 0 0 0 1.972-2.338C20.81 3.179 19.885 2.5 18.888 2.5h-.776c-.997 0-1.922.679-2.084 1.662A2.002 2.002 0 0 0 18 6.5zm0-1.014h1c.551 0 1-.449 1-1s-.449-1-1-1h-1c-.551 0-1 .449-1 1s.449 1 1 1z" fill="#ffffff" opacity="1" data-original="#000000"/></g></svg>`,
    // permission: Permissions.ROLES.permissions.permissionsList,
  }

] as const;


export const Side_Bar: any = [
  {
    id: 1,
    name: 'Dashboard',
    is_active: 1,
    icon: `
<svg id="svg8"  width="25"  height="25" viewBox="0 0 6.3499999 6.3500002" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g id="layer13"><path id="path1317" d="m1.2942365.52839152c-.41913398 0-.76584398.346705-.76584498.76584398v3.761529c0 .419132.346711.765844.76584498.765844h3.761527c.419134 0 .765845-.346712.765845-.765844v-3.761529c0-.41913898-.346711-.76584398-.765845-.76584398zm0 .52968498h3.761527c.133151 0 .236162.103011.236162.236159v.822175h-4.234367v-.822175c0-.133148.103527-.236159.236678-.236159zm2.761588.265616c-.14532.000567-.262984.118231-.26355.263551-.000571.146125.117425.265045.26355.265615h.706934c.146125-.00057.264121-.11949.26355-.265615-.000566-.14532-.11823-.262984-.26355-.263551zm-2.998266 1.321884h4.234367v2.410188c0 .133151-.103011.236678-.236162.236678h-3.761527c-.133151 0-.236678-.103527-.236678-.236678zm2.117183.353465c-.146328-.000572-.265333.11774-.265617.264068v1.234032c-.000576.146934.118683.266193.265617.265618.146126-.00057.264122-.119492.26355-.265618v-1.234032c-.000282-.145522-.118029-.2635-.26355-.264068zm-1.058333.529685c-.145319.000567-.262983.11823-.26355.263549v.704866c-.000572.146126.117424.265048.26355.265618.146934.000575.266193-.118684.265617-.265618v-.704866c-.00057-.146126-.119491-.264121-.265617-.263549zm2.117183 0c-.146126-.000572-.265047.117423-.265617.263549v.704866c-.000576.146934.118683.266193.265617.265618.146126-.00057.264122-.119492.26355-.265618v-.704866c-.000567-.145319-.118231-.262982-.26355-.263549z" font-variant-ligatures="normal" font-variant-position="normal" font-variant-caps="normal" font-variant-numeric="normal" font-variant-alternates="normal" font-variant-east-asian="normal" font-feature-settings="normal" font-variation-settings="normal" text-indent="0" text-align="start" text-decoration-line="none" text-decoration-style="solid" text-decoration-color="rgb(0,0,0)" text-transform="none" text-orientation="mixed" white-space="normal" shape-padding="0" shape-margin="0" inline-size="0" isolation="auto" mix-blend-mode="normal" solid-color="rgb(0,0,0)" solid-opacity="1" vector-effect="none" paint-order="markers fill stroke"/></g></svg>`,
    routeUrl: 'dashboard',
    // module: Permissions.SERVICEREQUEST.module,
    // subMenu: [...Service_Requests_Mode],
  },
  {
    id: 2,
    name: 'Staff Management',
    is_active: 1,
    icon: `<svg width="25"  height="25" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
  <path d="m13.5,12c0,2.206,1.794,4,4,4s4-1.794,4-4-1.794-4-4-4-4,1.794-4,4Zm4-2c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm-5.5-2c2.206,0,4-1.794,4-4S14.206,0,12,0s-4,1.794-4,4,1.794,4,4,4Zm0-6c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm-5.5,14c2.206,0,4-1.794,4-4s-1.794-4-4-4-4,1.794-4,4,1.794,4,4,4Zm0-6c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2Zm17.5,11v3h-2v-3c0-.938-.636-1.717-1.511-1.934l-2.983,3.457-3.023-3.447c-.859.227-1.483,1.002-1.483,1.923v3h-2v-3c0-.938-.636-1.717-1.51-1.934l-2.984,3.457-3.023-3.447c-.859.227-1.483,1.002-1.483,1.923v3H0v-3c0-2.148,1.686-3.899,3.839-3.987l.478-.02,2.178,2.483,2.141-2.481.474.013c1.166.032,2.186.557,2.893,1.362.697-.791,1.697-1.312,2.836-1.358l.478-.02,2.178,2.483,2.141-2.481.474.013c2.182.06,3.891,1.813,3.891,3.991Z"/>
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
  icon: `<svg width="25"  height="25"  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512">
  <!-- Generator: Adobe Illustrator 28.7.8, SVG Export Plug-In . SVG Version: 1.2.0 Build 200)  -->
  <g>
    <g id="Layer_1">
      <path d="M143.9,382.8c18.6-14.5,30.7-37.1,30.7-62.5,0-43.7-35.6-79.3-79.3-79.3s-79.3,35.6-79.3,79.3,12,48,30.7,62.5C20.4,398.5,0,428,0,464.9v32.1c0,8.3,6.7,15,15,15h160.7c8.3,0,15-6.7,15-15v-32.1c0-36.8-20.4-66.4-46.7-82.1ZM46.1,320.3c0-27.2,22.1-49.3,49.3-49.3s49.3,22.1,49.3,49.3-22.1,49.3-49.3,49.3-49.3-22.1-49.3-49.3ZM160.7,482H30v-17.1c0-36.1,29.2-65.3,65.3-65.3s65.3,29.2,65.3,65.3v17.1h0Z"/>
      <path d="M448.8,0h-192.8C221.1,0,192.8,28.2,192.8,63.2v289.2c0,12.3,14.1,19.4,24,12l60.3-45.2h171.7c34.9,0,63.2-28.2,63.2-63.2V63.2C512,28.3,483.8,0,448.8,0ZM482,256c0,18.4-14.8,33.2-33.2,33.2h-176.7c-3.2,0-6.4,1.1-9,3l-40.3,30.2V63.2c0-18.4,14.8-33.2,33.2-33.2h192.8c18.4,0,33.2,14.8,33.2,33.2v192.8Z"/>
      <g>
        <path d="M439.3,168c0,3.3-1.5,6.5-4.1,8.6l-34.8,27.6c-1.9,1.5-4.3,2.4-6.8,2.4s-6.5-1.5-8.6-4.1c-1.8-2.3-2.6-5.1-2.3-8,.3-2.9,1.8-5.5,4.1-7.3l24-19-24-19c-2.3-1.8-3.7-4.4-4.1-7.3-.3-2.9.5-5.8,2.3-8,1.8-2.3,4.4-3.7,7.3-4.1,2.9-.3,5.8.5,8,2.3l34.8,27.6c2.6,2.1,4.1,5.2,4.1,8.6Z"/>
        <path d="M311.7,202.4c-2.1,2.6-5.2,4.1-8.6,4.1s-4.8-.8-6.8-2.4l-34.8-27.6c-2.6-2.1-4.1-5.2-4.1-8.6s1.5-6.5,4.1-8.6l34.8-27.6c2.3-1.8,5.1-2.6,8-2.3,2.9.3,5.5,1.8,7.3,4.1,3.7,4.7,3,11.6-1.8,15.3l-24,19,24,19c2.3,1.8,3.7,4.4,4.1,7.3.3,2.9-.5,5.8-2.3,8Z"/>
        <path d="M370.7,126.9l-23.3,87.8c-1.3,4.8-5.6,8.1-10.5,8.1s-1.9-.1-2.8-.4c-2.8-.8-5.2-2.5-6.7-5.1-1.5-2.5-1.9-5.5-1.1-8.3l23.3-87.8c.7-2.8,2.5-5.2,5.1-6.6,2.5-1.5,5.5-1.9,8.3-1.1,5.8,1.5,9.3,7.5,7.8,13.4Z"/>
      </g>
    </g>
  </g>
</svg>`,
    routeUrl: 'release-requests',
  },
  {
    id: 4,
    name: 'Requests',
    is_active: 1,
    icon: `
<svg width="25"  height="25"  viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m367.398438 231.898438c0 8.285156-6.714844 15-15 15-8.28125 0-15-6.714844-15-15 0-8.28125 6.71875-15 15-15 8.285156 0 15 6.71875 15 15zm0 0"/><path d="m352.382812 72.300781c-30.449218 0-55.148437 24.640625-55.148437 55.148438v.019531c0 8.28125 6.714844 14.992188 15 14.992188s15-6.726563 15-15.011719c0-13.867188 11.214844-25.148438 25.167969-25.148438 13.875 0 25.164062 11.289063 25.164062 25.167969 0 13.875-11.289062 25.164062-25.164062 25.164062-8.285156 0-15 6.71875-15 15v16.066407c0 8.285156 6.714844 15 15 15 8.28125 0 15-6.714844 15-15v-3.136719c23.152344-6.550781 40.164062-27.875 40.164062-53.09375 0-30.421875-24.746094-55.167969-55.183594-55.167969zm0 0"/><path d="m143.9375 382.8125c18.640625-14.515625 30.664062-37.148438 30.664062-62.546875 0-43.707031-35.5625-79.265625-79.269531-79.265625s-79.265625 35.558594-79.265625 79.265625c0 25.398437 12.023438 48.03125 30.660156 62.546875-26.304687 15.648438-46.726562 45.203125-46.726562 82.054688v32.132812c0 8.285156 6.714844 15 15 15h160.667969c8.28125 0 15-6.714844 15-15v-32.132812c0-36.84375-20.417969-66.402344-46.730469-82.054688zm-97.871094-62.546875c0-27.164063 22.101563-49.265625 49.269532-49.265625 27.164062 0 49.265624 22.101562 49.265624 49.265625 0 27.167969-22.101562 49.269531-49.265624 49.269531-27.167969 0-49.269532-22.101562-49.269532-49.269531zm114.601563 161.734375h-130.667969v-17.132812c0-36.085938 29.195312-65.332032 65.332031-65.332032 36.085938 0 65.332031 29.195313 65.332031 65.332032v17.132812zm0 0"/><path d="m448.800781 0h-192.800781c-34.90625 0-63.199219 28.242188-63.199219 63.199219v289.199219c0 12.269531 14.070313 19.445312 24 12l60.265625-45.199219h171.734375c34.90625 0 63.199219-28.242188 63.199219-63.199219v-192.800781c0-34.90625-28.242188-63.199219-63.199219-63.199219zm33.199219 256c0 18.351562-14.839844 33.199219-33.199219 33.199219h-176.734375c-3.246094 0-6.402344 1.054687-9 3l-40.265625 30.199219v-259.199219c0-18.351563 14.839844-33.199219 33.199219-33.199219h192.800781c18.351563 0 33.199219 14.839844 33.199219 33.199219zm0 0"/></svg>`,
    routeUrl: 'requests',
  }

] as const;

