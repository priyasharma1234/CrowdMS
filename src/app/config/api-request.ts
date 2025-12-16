
export const apiRoutes = {
    auth: {
        login: {
            url: 'auth/login',
            method: 'POST',
            description: 'Login API'
        }
    },
    analyticsDwell: {
        url: 'analytics/dwell',
        method: 'POST',
        description: 'API for analytics dwell'
    },
    analyticsFootfall: {
        url: 'analytics/footfall',
        method: 'POST',
        description: 'API for analytics footfall'
    },
    analyticsOccupancy: {
        url: 'analytics/occupancy',
        method: 'POST',
        description: 'API for analytics occupany'
    },
    analyticsDemographics: {
        url: 'analytics/demographics',
        method: 'POST',
        description: 'API for analytics demographics'
    },
    analyticsEntryExit: {
        url: 'analytics/entry-exit',
        method: 'POST',
        description: 'API for analytics entry exit'
    }

} as const;
