// ============================================
// DTOs de Tipo de Evento (basados en los DTOs del backend)
// ============================================

// EventTypeDTO - Tipo de evento básico (GET /api/event-types)
export interface EventType {
    eventTypeId: number;
    eventTypeName: string;
    description: string;
    photoUrl?: string;
}

// AdminEventTypeDTO - Para vistas de administración
export interface AdminEventType {
    eventTypeId: number;
    eventTypeName: string;
    description: string;
    photoUrl?: string;
}

// CreateEventTypeDTO - Para crear tipo de evento (admin)
export interface CreateEventTypeRequest {
    eventTypeName: string;
    description?: string;
}

// UpdateEventTypeDTO - Para actualizar tipo de evento (admin)
export interface UpdateEventTypeRequest {
    eventTypeName?: string;
    description?: string;
}
