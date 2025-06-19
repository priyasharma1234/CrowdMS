
export const apiRoutes = {
  auth: {
    login: {
      url: '/api/corporate/auth/login',
      method: 'POST',
      description: 'Login API for corporate users'
    },
    logout: {
      url: '/api/corporate/auth/logout',
      method: 'POST',
      description: 'Logout API for corporate users'
    }
  },
  escrow: {
    list: {
      url: '/api/corporate/escrow/list',
    }
  }
} as const;
