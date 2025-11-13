export type { BackendResponse } from './common';

export interface DashboardStats {
    totalVenues: number;
    todayReservations: number;
    totalUsers: number;
    monthlyRevenue: number;
    pendingReservations: number;
    recentReservations: Reservation[];
    monthlyRevenue6Months: MonthlyData[];
    monthlyReservations6Months: MonthlyData[];
    reservationsByStatus: { [key: string]: number };
    topVenues: VenuePopularity[];
    topFurniture: FurniturePopularity[];
    topEventTypes: EventTypePopularity[];
}

export interface MonthlyData {
    month: string;
    revenue: number;
    reservations: number;
}

export interface VenuePopularity {
    venueName: string;
    reservationCount: number;
}

export interface FurniturePopularity {
    furnitureName: string;
    requestCount: number;
}

export interface EventTypePopularity {
    eventTypeName: string;
    reservationCount: number;
    [key: string]: string | number;
}

export interface Venue {
    venueId: number;
    venueName: string;
    address: string;
    maxCapacity: number;
    pricePerHour: number;
    description: string;
    status: string; // "AVAILABLE" | "UNAVAILABLE"
    districtId: number;
    districtName?: string;
    photos?: string;
    availableEventTypes?: string;
    availableEventTypeIds?: string;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
}

export interface VenueCreateRequest {
    venueName: string;
    address: string;
    maxCapacity: number;
    pricePerHour: number;
    description: string;
    districtId: number;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
}

export interface District {
    districtId: number;
    districtName: string;
    venueCount?: number;
}

export interface DistrictCreateRequest {
    districtName: string;
}

export interface EventType {
    eventTypeId: number;
    eventTypeName: string;
    photoUrl?: string;
}

export interface EventTypeCreateRequest {
    eventTypeName: string;
}

export interface Furniture {
    furnitureId: number;
    furnitureName: string;
    description: string;
    pricePerUnit: number;
    availableStock: number;
}

export interface FurnitureCreateRequest {
    furnitureName: string;
    description: string;
    pricePerUnit: number;
    availableStock: number;
}

export interface Customer {
    userId: number;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    registrationDate: string;
    roleName: string;
}

export interface Reservation {
    reservationId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    status: string;
    createdAt: string;
    userId: number;
    venueId: number;
    eventTypeId: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    venueName?: string;
    venueAddress?: string;
    eventTypeName?: string;
    furnitureItems?: FurnitureItem[];
}

export interface FurnitureItem {
    furnitureId: number;
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
