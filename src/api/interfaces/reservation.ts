// ============================================
// DTOs de Reservas (basados en los DTOs del backend)
// ============================================

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

// ReservationRequestDTO - Para crear una reserva (POST /api/reservations)
export interface ReservationRequest {
    venueId: number;
    eventTypeId: number;
    reservationDate: string; // LocalDate -> YYYY-MM-DD
    startTime: string; // LocalTime -> HH:mm:ss
    endTime: string; // LocalTime -> HH:mm:ss
    guestCount: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    furnitureItems: FurnitureItemRequest[];
}

export interface FurnitureItemRequest {
    furnitureId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// ReservationResponseDTO - Respuesta después de crear la reserva
export interface ReservationResponse {
    reservationId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    status: ReservationStatus;
    createdAt: string; // LocalDateTime -> ISO 8601

    venueId: number;
    venueName: string;
    venueAddress: string;

    eventTypeId: number;
    eventTypeName: string;

    userId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;

    furnitureItems: FurnitureItemDTO[];
}

export interface FurnitureItemDTO {
    furnitureId: number;
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// ReservationSuccessDTO - Detalles completos (GET /api/reservations/{id}/details)
export interface ReservationSuccess {
    reservationId: number;
    confirmationCode: string;
    createdAt: string;
    status: string;

    eventDate: string;
    startTime: string;
    endTime: string;
    duration: string;
    guestCount: number;
    eventTypeName: string;

    venueName: string;
    venueAddress: string;
    venueDistrict: string;
    venuePhotos: string[];

    customerName: string;
    customerEmail: string;
    customerPhone: string;

    costBreakdown: CostBreakdown;
    furnitureItems: FurnitureItemDetail[];
    paymentInfo: PaymentInfo;
}

// CostBreakdownDTO - Desglose de costos de la reserva
export interface CostBreakdown {
    totalHours: number;
    venueHourlyRate: number;
    venueCost: number;
    furnitureCost: number;
    subtotal: number;
    taxes: number;
    totalCost: number;
}

export interface FurnitureItemDetail {
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    photoUrl: string;
}

export interface PaymentInfo {
    status: string; // PENDING, PARTIAL, PAID
    paidAmount: number;
    pendingAmount: number;
    nextPaymentDue: string;
    payments: PaymentDetail[];
}

// PaymentDetailDTO - Detalles de la transacción de pago
export interface PaymentDetail {
    paymentId: number;
    amount: number;
    paymentMethod: string;
    confirmationCode: string;
    status: string;
    paymentDate: string;
    receiptUrl: string;
    customerName: string;
    customerEmail: string;
}

// ============================================
// DISPONIBILIDAD Y PRESUPUESTO
// ============================================

// AvailabilityRequestDTO (POST /api/reservations/availability)
export interface AvailabilityRequest {
    venueId: number;
    reservationDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
}

// AvailabilityResponseDTO - Respuesta del chequeo de disponibilidad
export interface AvailabilityResponse {
    isAvailable: boolean;
    message: string;
    conflicts: ConflictInfo[];
}

// ConflictInfoDTO - Detalles de conflictos en disponibilidad
export interface ConflictInfo {
    startTime: string;
    endTime: string;
    eventType: string;
}

// BudgetCalculationDTO - Calcular presupuesto (POST /api/reservations/calculate-budget)
export interface BudgetCalculation {
    venueId: number;
    venueName: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    eventTypeId: number;
    furnitureItems: BudgetFurnitureItem[];

    totalHours: number;
    venueHourlyRate: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
}

// BudgetFurnitureItemDTO - Detalles de mobiliario para presupuesto
export interface BudgetFurnitureItem {
    furnitureId: number;
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// ReservationDTO - Para listar reservas de usuario
export interface Reservation {
    reservationId: number;
    venueName: string;
    eventTypeName: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    status: string;
    createdAt: string;
    furnitureItems: FurnitureCartItem[];
}

// FurnitureCartItemDTO - Detalles de mobiliario en la reserva
export interface FurnitureCartItem {
    furnitureId: number;
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
