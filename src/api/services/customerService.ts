import { apiClient } from "@/api/base";
import type { VenueCard, VenueDetail, VenueFilters } from "@/api/interfaces/venue";

// Interfaces adicionales que no están en venue.ts
export interface EventType {
    eventTypeId: number;
    eventTypeName: string;
    description: string;
}

export interface District {
    districtId: number;
    districtName: string;
}

export interface Furniture {
    furnitureId: number;
    furnitureName: string;
    description: string;
    pricePerUnit: number;
    photoUrl: string;
}

export interface BudgetResponse {
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    breakdown: {
        venueHours: number;
        venueHourlyRate: number;
        furnitureItems: Array<{
            furnitureId: number;
            furnitureName: string;
            quantity: number;
            pricePerUnit: number;
            subtotal: number;
        }>;
    };
}

export interface FurnitureItemRequest {
    furnitureId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface CreateReservationRequest {
    venueId: number;
    eventTypeId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    venueCost: number;
    furnitureCost: number;
    totalCost: number;
    furnitureItems: FurnitureItemRequest[];
    paymentMethodId: number;
    approvalCode: string;
}

export interface ReservationResponse {
    reservationId: number;
    status: string;
    confirmationCode: string;
    message: string;
}

export const useCustomerService = () => {
    // ==================== LOCALES ====================
    const getAllVenues = async (): Promise<VenueCard[]> => {
        const response = await apiClient.get<VenueCard[]>('/venues');
        // La respuesta del backend es: { success, message, data: [...], timestamp }
        return response.data || [];
    };

    const getVenueById = async (id: number): Promise<VenueDetail> => {
        const response = await apiClient.get<VenueDetail>(`/venues/${id}`);
        // La respuesta del backend es: { success, message, data: {...}, timestamp }
        return response.data || ({} as VenueDetail);
    };

    const searchVenues = async (params: VenueFilters): Promise<VenueCard[]> => {
        const queryParams = new URLSearchParams();
        if (params.eventTypeId) queryParams.append('eventTypeId', params.eventTypeId.toString());
        if (params.districtId) queryParams.append('districtId', params.districtId.toString());
        if (params.minCapacity) queryParams.append('minCapacity', params.minCapacity.toString());
        if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

        const response = await apiClient.get<VenueCard[]>(
            `/venues/search?${queryParams.toString()}`
        );
        return response.data || [];
    };

    const getUnavailableDates = async (venueId: number): Promise<string[]> => {
        const response = await apiClient.get<string[]>(
            `/venues/${venueId}/unavailable-dates`
        );
        return response.data || [];
    };

    // ==================== TIPOS DE EVENTO ====================
    const getAllEventTypes = async (): Promise<EventType[]> => {
        const response = await apiClient.get<EventType[]>('/event-types');
        return response.data || [];
    };

    // ==================== DISTRITOS ====================
    const getAllDistricts = async (): Promise<District[]> => {
        const response = await apiClient.get<District[]>('/districts');
        return response.data || [];
    };

    // ==================== MOBILIARIO ====================
    const getAllFurniture = async (): Promise<Furniture[]> => {
        const response = await apiClient.get<Furniture[]>('/furniture');
        return response.data || [];
    };

    // ==================== PRESUPUESTO ====================
    const calculateBudget = async (params: {
        venueId: number;
        eventDate: string;
        startTime: string;
        endTime: string;
        furnitureIds?: number[];
        furnitureQuantities?: number[];
    }): Promise<BudgetResponse> => {
        const response = await apiClient.post<BudgetResponse>(
            '/budget/calculate',
            params
        );
        return response.data || ({} as BudgetResponse);
    };

    // ==================== RESERVAS ====================
    const createReservation = async (params: CreateReservationRequest): Promise<ReservationResponse> => {
        const response = await apiClient.post<ReservationResponse>(
            '/reservations',
            params
        );
        return response.data || ({} as ReservationResponse);
    };

    const getMyReservations = async () => {
        const response = await apiClient.get('/reservations/my-reservations');
        return response.data || [];
    };

    const getReservationDetails = async (reservationId: number) => {
        const response = await apiClient.get(`/reservations/${reservationId}/details`);
        return response.data || {};
    };

    return {
        // Locales
        getAllVenues,
        getVenueById,
        searchVenues,
        getUnavailableDates,
        // Tipos de evento
        getAllEventTypes,
        // Distritos
        getAllDistricts,
        // Mobiliario
        getAllFurniture,
        // Presupuesto
        calculateBudget,
        // Reservas
        createReservation,
        getMyReservations,
        getReservationDetails,
    };
};
