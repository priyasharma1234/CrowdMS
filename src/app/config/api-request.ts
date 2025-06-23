
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
    createDepositorOrBene: {
      url: 'escrow/create-corporate',
    },
    aggreement: {
      url: 'escrow/agreement',
    },
    deposit: {
      url: 'escrow/deposit'
    },
    releaseCondition: {
      url: 'escrow/release-condition'
    },
    corporateList: {
      url: 'escrow/corporate-list',
    },
    depositData: {
      url: 'escrow/get-deposit-data'
    }
  }
} as const;
