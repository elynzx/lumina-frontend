// ============================================
// DTOs de Locales (basados en los DTOs del backend)
// ============================================

// VenueCardDTO - Para catálogo/listado (GET /api/venues, GET /api/venues/search)
export interface VenueCard {
  venueId: number;
  venueName: string;
  address: string;
  districtName: string;
  maxCapacity: number;
  pricePerHour: number;
  description: string;
  mainPhotoUrl: string;
  status: VenueStatus;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}

// VenueSliderDTO - Para slider de inicio (GET /api/venues/slider)
export interface VenueSlider {
  venueId: number;
  venueName: string;
  mainPhoto: string;
}

// VenueDetailDTO - Para página de detalle de local (GET /api/venues/{id})
export interface VenueDetail {
  venueId: number;
  venueName: string;
  address: string;
  districtName: string;
  maxCapacity: number;
  pricePerHour: number;
  fullDescription: string;
  photos: string[];
  availableEventTypes: string[];
  services: VenueService[];
  status: VenueStatus;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}

export interface VenueService {
  serviceName: string;
  description: string;
  iconUrl: string;
}

// VenuePreviewDTO - Para previsualizaciones rápidas
export interface VenuePreview {
  venueId: number;
  venueName: string;
  districtName: string;
  description: string;
  mainPhoto: string;
  pricePerHour: number;
}

export type VenueStatus = 'AVAILABLE' | 'UNAVAILABLE';

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

// VenueFilterDTO - Para filtros de búsqueda (GET /api/venues/search)
export interface VenueFilters {
  districtId?: number;
  eventTypeId?: number;
  minCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
}