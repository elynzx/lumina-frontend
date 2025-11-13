export const ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ADMIN_LOGIN: '/auth/admin/login',
    },
    
    // Locales / Venues
    VENUES: {
        BASE: '/venues',
        BY_ID: (id: number) => `/venues/${id}`,
        FEATURED: '/venues/featured',
        SEARCH: '/venues/search',
        AVAILABILITY: (id: number) => `/venues/${id}/availability`,
    },
    
    // Reservaciones / Reservations
    RESERVATIONS: {
        BASE: '/reservations',
        BY_ID: (id: number) => `/reservations/${id}`,
        MY_RESERVATIONS: '/reservations/my-reservations',
        CHECK_AVAILABILITY: '/reservations/check-availability',
        CALCULATE_BUDGET: '/reservations/calculate-budget',
        CANCEL: (id: number) => `/reservations/${id}/cancel`,
    },
    
    // Mobiliario / Furniture
    FURNITURE: {
        BASE: '/furniture',
        BY_ID: (id: number) => `/furniture/${id}`,
    },
    
    // Distritos / Districts
    DISTRICTS: {
        BASE: '/districts',
        CARDS: '/districts/cards',
    },
    
    // Tipos de Evento / Event Types
    EVENT_TYPES: {
        BASE: '/event-types',
        BY_ID: (id: number) => `/event-types/${id}`,
    },
    
    // Admin
    ADMIN: {
        // Venues
        VENUES: {
            BASE: '/admin/venues',
            BY_ID: (id: number) => `/admin/venues/${id}`,
        },
        // Reservations
        RESERVATIONS: {
            BASE: '/admin/reservations',
            BY_ID: (id: number) => `/admin/reservations/${id}`,
        },
        // Districts
        DISTRICTS: {
            BASE: '/admin/districts',
            BY_ID: (id: number) => `/admin/districts/${id}`,
        },
        // Event Types
        EVENT_TYPES: {
            BASE: '/admin/event-types',
            BY_ID: (id: number) => `/admin/event-types/${id}`,
        },
        // Furniture
        FURNITURE: {
            BASE: '/admin/furniture',
            BY_ID: (id: number) => `/admin/furniture/${id}`,
        },
        // Customers
        CUSTOMERS: {
            BASE: '/admin/customers',
            BY_ID: (id: number) => `/admin/customers/${id}`,
        },
    },
} as const;