// ============================================
// COMMON DTOs (Backend DTOs)
// ============================================

// ApiResponseDTO<T> - Estructura base de respuesta de la API
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
    timestamp: string; // LocalDateTime -> ISO 8601
}

// BackendResponseDTO<T> - Alias para ApiResponseDTO<T>
export type BackendResponse<T> = ApiResponse<T>;

// PagedResponseDTO<T> - Respuesta paginada genérica
export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
    errors?: Record<string, string[]>;
    status?: number;
}

// ============================================
// Formularios (para componentes)
// ============================================

export interface ReservationFormData {
    eventTypeId: number;
    date: string; // DD/MM/YYYY from DatePicker
    quantity: number;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}

export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
}

export interface FurnitureFormData {
    [furnitureId: number]: number; // furnitureId -> quantity
}