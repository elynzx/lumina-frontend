// ============================================
// DTOs de Pago (basados en los DTOs del backend)
// ============================================

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

// PaymentMethodDTO - Métodos de pago disponibles (GET /api/payment-methods)
export interface PaymentMethod {
    paymentMethodId: number;
    methodName: string;
    description: string;
    active: boolean;
}

// PaymentDetailDTO - Detalles de la transacción de pago
export interface PaymentDetail {
    paymentId: number;
    amount: number;
    paymentMethod: string;
    confirmationCode: string;
    status: string;
    paymentDate: string; // LocalDateTime -> ISO 8601
    receiptUrl: string;
    customerName: string;
    customerEmail: string;
}

// PaymentRequestDTO - Crear un pago (POST /api/payments)
export interface PaymentRequest {
    reservationId: number;
    paymentMethodId: number;
    amount: number;
    transactionCode?: string;
    customerName?: string;
    customerEmail?: string;
}

// PaymentResponseDTO - Respuesta después de crear el pago
export interface PaymentResponse {
    paymentId: number;
    status: PaymentStatus;
    confirmationCode?: string;
    message?: string;
    // For PagoEfectivo
    cipCode?: string;
    expirationDate?: string;
}
