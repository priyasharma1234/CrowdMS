
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
  escrow: {
    list: {
      url: 'escrow/list',
    },
     add: {
      url: 'escrow/add',
    },
    // createDepositorOrBene: {
    //   url: 'escrow/create-corporate',
    // },
    //  updateDepositorOrBene: {
    //   url: 'escrow/update-corporate',
    // },
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
      url: 'escrow/deposits'
    }
  }
} as const;
