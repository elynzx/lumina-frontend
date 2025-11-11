import { apiClient } from '@/api/base';
import type { 
    Venue, 
    VenueCreateRequest, 
    District, 
    DistrictCreateRequest, 
    EventType, 
    EventTypeCreateRequest, 
    Furniture, 
    FurnitureCreateRequest,
    Customer,
    Reservation,
    DashboardStats
} from '@/api/interfaces/admin';

interface BackendResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const useAdminService = () => {
    // ==================== DASHBOARD ====================
    const getDashboardStats = async (): Promise<DashboardStats> => {
        const response = await apiClient.get<BackendResponse<DashboardStats>>('/admin/dashboard/stats');
        return response.data;
    };


    // ==================== LOCALES ====================
    const getAllVenues = async (): Promise<Venue[]> => {
        const response = await apiClient.get<BackendResponse<Venue[]>>('/admin/venues');
        return response.data;
    };

    const getVenueById = async (id: number): Promise<Venue> => {
        const response = await apiClient.get<BackendResponse<Venue>>(`/admin/venues/${id}`);
        return response.data;
    };

    const createVenue = async (venue: VenueCreateRequest): Promise<Venue> => {
        const response = await apiClient.post<BackendResponse<Venue>>('/admin/venues', venue);
        return response.data;
    };

    const updateVenue = async (id: number, venue: VenueCreateRequest): Promise<Venue> => {
        const response = await apiClient.put<BackendResponse<Venue>>(`/admin/venues/${id}`, venue);
        return response.data;
    };

    const deleteVenue = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/venues/${id}`);
    };

    const searchVenues = async (name: string): Promise<Venue[]> => {
        const response = await apiClient.get<BackendResponse<Venue[]>>(`/admin/venues/search?name=${name}`);
        return response.data;
    };

    // ==================== DISTRITOS ====================
    const getAllDistricts = async (): Promise<District[]> => {
        const response = await apiClient.get<BackendResponse<District[]>>('/admin/districts');
        return response.data;
    };

    const getDistrictById = async (id: number): Promise<District> => {
        const response = await apiClient.get<BackendResponse<District>>(`/admin/districts/${id}`);
        return response.data;
    };

    const createDistrict = async (district: DistrictCreateRequest): Promise<District> => {
        const response = await apiClient.post<BackendResponse<District>>('/admin/districts', district);
        return response.data;
    };

    const updateDistrict = async (id: number, district: DistrictCreateRequest): Promise<District> => {
        const response = await apiClient.put<BackendResponse<District>>(`/admin/districts/${id}`, district);
        return response.data;
    };

    const deleteDistrict = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/districts/${id}`);
    };

    const searchDistricts = async (name: string): Promise<District[]> => {
        const response = await apiClient.get<BackendResponse<District[]>>(`/admin/districts/search?name=${name}`);
        return response.data;
    };

    // ==================== TIPOS DE EVENTO ====================
    const getAllEventTypes = async (): Promise<EventType[]> => {
        const response = await apiClient.get<BackendResponse<EventType[]>>('/admin/event-types');
        return response.data;
    };

    const getEventTypeById = async (id: number): Promise<EventType> => {
        const response = await apiClient.get<BackendResponse<EventType>>(`/admin/event-types/${id}`);
        return response.data;
    };

    const createEventType = async (eventType: EventTypeCreateRequest): Promise<EventType> => {
        const response = await apiClient.post<BackendResponse<EventType>>('/admin/event-types', eventType);
        return response.data;
    };

    const updateEventType = async (id: number, eventType: EventTypeCreateRequest): Promise<EventType> => {
        const response = await apiClient.put<BackendResponse<EventType>>(`/admin/event-types/${id}`, eventType);
        return response.data;
    };

    const deleteEventType = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/event-types/${id}`);
    };

    const searchEventTypes = async (name: string): Promise<EventType[]> => {
        const response = await apiClient.get<BackendResponse<EventType[]>>(`/admin/event-types/search?name=${name}`);
        return response.data;
    };

    // ==================== MOBILIARIO ====================
    const getAllFurniture = async (): Promise<Furniture[]> => {
        const response = await apiClient.get<BackendResponse<Furniture[]>>('/admin/furniture');
        return response.data;
    };

    const getFurnitureById = async (id: number): Promise<Furniture> => {
        const response = await apiClient.get<BackendResponse<Furniture>>(`/admin/furniture/${id}`);
        return response.data;
    };

    const createFurniture = async (furniture: FurnitureCreateRequest): Promise<Furniture> => {
        const response = await apiClient.post<BackendResponse<Furniture>>('/admin/furniture', furniture);
        return response.data;
    };

    const updateFurniture = async (id: number, furniture: FurnitureCreateRequest): Promise<Furniture> => {
        const response = await apiClient.put<BackendResponse<Furniture>>(`/admin/furniture/${id}`, furniture);
        return response.data;
    };

    const deleteFurniture = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/furniture/${id}`);
    };

    const searchFurniture = async (name: string): Promise<Furniture[]> => {
        const response = await apiClient.get<BackendResponse<Furniture[]>>(`/admin/furniture/search?name=${name}`);
        return response.data;
    };

    // ==================== CLIENTES ====================
    const getAllCustomers = async (): Promise<Customer[]> => {
        const response = await apiClient.get<BackendResponse<Customer[]>>('/admin/users/clients');
        return response.data;
    };

    const searchCustomers = async (keyword: string): Promise<Customer[]> => {
        const response = await apiClient.get<BackendResponse<Customer[]>>(`/admin/users/customers/search?keyword=${keyword}`);
        return response.data;
    };

    // ==================== RESERVAS ====================
    const getAllReservations = async (): Promise<Reservation[]> => {
        const response = await apiClient.get<BackendResponse<Reservation[]>>('/admin/reservations');
        return response.data;
    };

    const updateReservationStatus = async (id: number, status: string): Promise<Reservation> => {
        const response = await apiClient.put<BackendResponse<Reservation>>(
            `/admin/reservations/${id}/status?status=${status}`
        );
        return response.data;
    };

    return {
        // Dashboard
        getDashboardStats,
        // Locales
        getAllVenues,
        getVenueById,
        createVenue,
        updateVenue,
        deleteVenue,
        searchVenues,
        // Distritos
        getAllDistricts,
        getDistrictById,
        createDistrict,
        updateDistrict,
        deleteDistrict,
        searchDistricts,
        // Tipos de Evento
        getAllEventTypes,
        getEventTypeById,
        createEventType,
        updateEventType,
        deleteEventType,
        searchEventTypes,
        // Mobiliario
        getAllFurniture,
        getFurnitureById,
        createFurniture,
        updateFurniture,
        deleteFurniture,
        searchFurniture,
        // Clientes
        getAllCustomers,
        searchCustomers,
        // Reservas
        getAllReservations,
        updateReservationStatus,
    };
};
