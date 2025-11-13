// ============================================
// DTOs de Distrito (basados en los DTOs del backend)
// ============================================

// DistrictDTO - Información básica de distrito (GET /api/districts)
export interface District {
    districtId: number;
    districtName: string;
}

// DistrictCardDTO - Para tarjetas de distrito con cantidad de locales (GET /api/districts/cards)
export interface DistrictCard {
    districtId: number;
    districtName: string;
    photoUrl: string;
    venueCount: number;
}

// AdminDistrictDTO - Para vistas de administración
export interface AdminDistrict {
    districtId: number;
    districtName: string;
}

// CreateDistrictDTO - Para crear distrito (admin)
export interface CreateDistrictRequest {
    districtName: string;
}

// UpdateDistrictDTO - Para actualizar distrito (admin)
export interface UpdateDistrictRequest {
    districtName?: string;
}
