
export const apiRoutes = {
  auth: {
    login: {
      url: 'auth/login',
      method: 'POST',
      description: 'Login API for corporate users'
    },
    logout: {
      url: 'auth/logout',
      method: 'POST',
      description: 'Logout API for corporate users'
    }
  },
  uploadDocument: {
    fileUrl: {
      url: 'common/upload-document',
    }
  },
  release:{
      takeAction: {
      url: 'escrow/release/action',
    }
  },
  escrow: {
    submitReleaseRequest: {
      url: 'escrow/release/submit',
    },
    getEscrowDetails: {
      url: 'escrow/detailsById',
    },
    getEscrow: {
      url: 'escrow'
    },
    dashboardCount: {
      url: 'escrow/count'
    },
    list: {
      url: 'escrow/list',
    },
    add: {
      url: 'escrow/add',
    },
    submitCorporate: {
      url: 'escrow/corporates/submit',
    },
    aggreement: {
      url: 'escrow/agreements/create',
    },
    deposit: {
      url: 'escrow/deposits/submit'
    },
    releaseCondition: {
      url: 'escrow/release-condition'
    },
    corporateList: {
      url: 'escrow/corporates/list',
    },
    getCorporate: {
      url: 'escrow/corporates'
    },
    depositData: {
      url: 'escrow/deposits/data'
    }
  },
  roles: {
    roleCreate: {
      url: 'roles/store',
    },
    roleList: {
      url: 'roles/list',
    },
    roleUpdate: {
      url: 'roles/update',
    },
    roleDelete: {
      url: 'roles/destroy',
    }
  },
  permissions: {

    permissionList: {
      url: 'permissions/list',
    },
    permissionCreate: {
      url: 'permissions/store',
    },
    customPermissionCreate: {
      url: 'permissions/custom',
    },
    removePermission: {
      url: 'permissions/remove',
    },
    canDelete: {
      url: 'permission/can-delete-permission',
    }

  },
  staff: {
    rolelist: {
      url: 'roles/admin-roles'
    },
    getStaff: {
      url: 'usermanagement/staff'
    },
    list: {
      url: 'usermanagement/staff/list',
    },
    add: {
      url: 'usermanagement/staff/store'
    },
    update: {
      url: 'usermanagement/staff/update'
    },
    show: {
      url: 'usermanagement/staff/show'
    },
    delete: {
      url: 'usermanagement/staff/destroy'
    },
  },
} as const;
