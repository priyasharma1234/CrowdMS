
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
     createDepositorOrBene: {
      url: 'escrow/create-corporate',
    }
  }
} as const;
