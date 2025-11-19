// ============================================
// BARREL EXPORT FOR ALL INTERFACES
// ============================================

/**
 * Exporta los tipos comunes utilizados en toda la aplicación.
 * Incluye respuestas genéricas de la API, paginación y errores.
 */
export type { ApiResponse, PagedResponse, PaginationParams, ApiError, ReservationFormData } from './common';

/**
 * Exporta todos los DTOs relacionados con locales (venues) para el cliente.
 */
export * from './venue';

/**
 * Exporta los tipos relacionados con autenticación.
 * Se realiza exportación selectiva para evitar conflictos de tipos.
 */
export type { LoginRequest, RegisterRequest, AdminLoginRequest, AuthResponse, UserProfile, BackendResponse } from './auth';

/**
 * Exporta los tipos relacionados con mobiliario.
 * Incluye DTOs para el cliente y para el administrador.
 */
export type { Furniture, FurnitureCart, FurnitureSelection, AdminFurniture, CreateFurnitureRequest, UpdateFurnitureRequest } from './furniture';

/**
 * Exporta los tipos relacionados con reservas.
 * Incluye DTOs para solicitudes, respuestas, detalles y utilidades.
 */
export type { 
    Reservation, 
    ReservationRequest, 
    ReservationResponse, 
    ReservationSuccess, 
    ReservationStatus,
    AvailabilityRequest, 
    AvailabilityResponse, 
    BudgetCalculation, 
    FurnitureItemRequest, 
    FurnitureItemDTO, 
    FurnitureItemDetail, 
    CostBreakdown, 
    PaymentInfo,
    FurnitureCartItem,
    ConflictInfo,
    BudgetFurnitureItem,
    CreateReservationRequest,
    CreateReservationResponse,
} from './reservation';

/**
 * Exporta los tipos relacionados con pagos.
 * Incluye detalles, solicitudes, respuestas y métodos de pago.
 */
export type { 
    PaymentDetail, 
    PaymentRequest, 
    PaymentResponse, 
    PaymentStatus, 
    PaymentMethod 
} from './payment';

/**
 * Exporta los tipos relacionados con distritos.
 * Incluye DTOs para el cliente y para el administrador.
 */
export type { District, DistrictCard, AdminDistrict, CreateDistrictRequest, UpdateDistrictRequest } from './district';

/**
 * Exporta los tipos relacionados con tipos de evento.
 * Incluye DTOs para el cliente y para el administrador.
 */
export type { EventType, AdminEventType, CreateEventTypeRequest, UpdateEventTypeRequest } from './event';

/**
 * Exporta los DTOs específicos para el panel de administración.
 * Se realiza importación específica para evitar conflictos con los DTOs del cliente.
 */
export type { 
    Venue as AdminVenue,
    VenueCreateRequest,
    District as AdminDistrictFull,
    DistrictCreateRequest,
    EventType as AdminEventTypeFull,
    EventTypeCreateRequest,
    Furniture as AdminFurnitureFull,
    FurnitureCreateRequest,
    Customer,
    Reservation as AdminReservation,
    DashboardStats,
    MonthlyData,
    VenuePopularity,
    FurniturePopularity,
    EventTypePopularity
} from './admin';