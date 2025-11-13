// ============================================
// DTOs de Mobiliario (basados en los DTOs del backend)
// ============================================

// FurnitureDTO - Para catálogo de mobiliario (GET /api/furniture)
export interface Furniture {
    furnitureId: number;
    furnitureName: string;
    description: string;
    totalStock: number;
    unitPrice: number;
    photoUrl: string;
}

// FurnitureCartDTO - Para carrito/selección en reserva
export interface FurnitureCart {
    furnitureId: number;
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// FurnitureSelection - Alias para selección de mobiliario en reserva
export type FurnitureSelection = FurnitureCart;

// AdminFurnitureDTO - Para vistas de administración
export interface AdminFurniture {
    furnitureId: number;
    furnitureName: string;
    description: string;
    totalStock: number;
    unitPrice: number;
    photoUrl: string;
    createdAt: string;
    totalReservations: number;
}

// CreateFurnitureDTO - Para crear mobiliario (admin)
export interface CreateFurnitureRequest {
    furnitureName: string;
    description?: string;
    totalStock: number;
    unitPrice: number;
    photoUrl: string;
}

// UpdateFurnitureDTO - For updating furniture (admin)
export interface UpdateFurnitureRequest {
    furnitureName?: string;
    description?: string;
    totalStock?: number;
    unitPrice?: number;
    photoUrl?: string;
}