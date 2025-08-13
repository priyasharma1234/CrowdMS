
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
    },
    forgotUserId: {
      url: 'auth/forgot-userid',
      method: 'POST',
      description: 'API to send forgot user ID email'
    },
    forgotPassword: {
      url: 'auth/reset-password',
      method: 'POST',
      description: 'API to send forgot password email'
    }, resetPassword: {
      url: 'auth/reset-password-complete',
      method: 'POST',
      description: 'API to reset password'
    }, resetPasswordVerifyOtp: {
      url: 'auth/reset-password-verify',
      method: 'POST',
      description: 'API to send otp for reset password'
    }, resetPasswordVerifyToken: {
      url: 'auth/reset-password-verify-token',
      method: 'POST',
      description: 'API to reset password verify token'
    },
  },
  uploadDocument: {
    fileUrl: {
      url: 'common/upload-document',
    }, getToken: {
      url: 'common/get-file-token',
    }
  },
  release: {
    takeAction: {
      url: 'escrow/release/action',
    },
    getConditionList: {
      url: 'escrow/release/get-condition'
    },
    addRelease: {
      url: 'escrow/release/add'
    }
  },
  escrow: {
    updateTeamMember: {
      url: 'user/team-members/update'
    },
    sendEmailTeamMember: {
      url: 'escrow/team-member/send-mail'
    },
    getEscrowList: {
      url: 'escrow/release/escrow-list'
    },
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
    },
    integrationFlow: {
      url: 'escrow/git/workflow',
    },
    integrationStatus: {
      url: 'escrow/git/status',
    },
    integration_workspace: {
      url: 'escrow/git/workspaces',
    },
    integration_repo: {
      url: 'escrow/git/repos',
    },
    integration_branch: {
      url: 'escrow/git/branches',
    },
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
  deposits:{
   updateDeposit: {
   url: 'escrow/deposits/update',
   }
  },
  requests: {
    takeAction: {
      url: 'escrow/requests/action',
    }

  }
} as const;
