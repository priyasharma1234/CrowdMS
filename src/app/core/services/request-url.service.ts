// setting urls
export const config = {
  // encrypt and decrypt key
  // Accounts Related URLs
  auth: {
    login: {
      url: 'auth/login',
    },
    logout: {
      url: 'auth/logout',
    }
  },
  location: {
    state: {
      url: 'location/state'
    },
    cities: {
      url: 'location/city'
    },
    pincode: {
      url: 'location/pincode'
    }
  },
  serviceRequest: {
    list: {
      url: 'service-request/list'
    },
    get: {
      url: 'service-request/get-order-details'
    },
    update: {
      url: 'service-request/save-order-initial'
    },
    authorize: {
      url: 'service-request/authorize-or-reject'
    },
    show: {
      url: 'service-request/show'
    },
    updatesr: {
      url: 'service-request/update',
    },
    timeslots: {
      url: 'service-request/time-slots',
    },
    hublist: {
      url: 'hubs/get-hub-list'
    },
    checkcustomerrefid: {
      url: 'service-request/check-customer-ref-id'
    }
  },
  custodian: {
    list: {
      url: 'custodians/list',
    },
    add: {
      url: 'custodians/store'
    },
    update: {
      url: 'custodians/update'
    },
    show: {
      url: 'custodians/show'
    },
    delete: {
      url: 'custodians/destroy'
    },

    detail: {
      url: 'custodians/get'
    },
  },
  crew: {
    list: {
      url: 'crews/list',
    },
    add: {
      url: 'crews/store',
    },
    update: {
      url: 'crews/update'
    },
    show: {
      url: 'crews/show'
    },
    delete: {
      url: 'crews/destroy'
    },
  },
  crewMember: {
    list: {
      url: 'crew-members/list',
    },
    add: {
      url: 'crew-members/store',
    },
    update: {
      url: 'crew-members/update'
    },
    show: {
      url: 'crew-members/show'
    },
    delete: {
      url: 'crew-members/destroy'
    },
  },
  hub: {
    list: {
      url: 'hubs/list',
    },
    get: {
      url: 'hubs/show',
    },
    add: {
      url: 'hubs/store',
    },
    update: {
      url: 'hubs/update'
    },
    delete: {
      url: 'hubs/destroy'
    },
  },
  corporate: {
    list: {
      url: 'corporates/list',
    },
    add: {
      url: 'corporates/store',
    },
    update: {
      url: 'corporates/update'
    },
    show: {
      url: 'corporates/show'
    },
    delete: {
      url: 'corporates/destroy'
    },
  },
  corporateuser: {
    list: {
      url: 'corporate-users/list',
    },
    add: {
      url: 'corporate-users/store',
    },
    update: {
      url: 'corporate-users/update'
    },
    show: {
      url: 'corporate-users/show'
    },
    delete: {
      url: 'corporate-users/destroy'
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
    list: {
      url: 'staff/list',
    },
    add: {
      url: 'staff/store'
    },
    update: {
      url: 'staff/update'
    },
    show: {
      url: 'staff/show'
    },
    delete: {
      url: 'staff/destroy'
    },
  },
  vehicle: {
    typelist: {
      url: 'vehicles/get-type',
    },
    list: {
      url: 'vehicles/list',
    },
    add: {
      url: 'vehicles/store'
    },
    update: {
      url: 'vehicles/update'
    },
    show: {
      url: 'vehicles/show'
    },
    delete: {
      url: 'vehicles/destroy'
    },
  },
  // raisesr: {
  //   store: {
  //     url: 'service-request/store',
  //   },
  //   timeslots: {
  //     url: 'service-request/time-slots',
  //   },
  //   states: {
  //     url: 'location/state',
  //   },
  //   cities: {
  //     url: 'location/city',
  //   },
  //   pincode: {
  //     url: 'location/pincode'
  //   },
  //   hublist: {
  //     url: 'hubs/get-hub-list'
  //   },
  //   checkcustomerrefid: {
  //     url: 'service-request/check-customer-ref-id'
  //   }

  // },



} as const;
