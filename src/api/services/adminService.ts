import { apiClient } from '@/api/base';
import type { 
    AdminVenue as Venue,
    VenueCreateRequest, 
    District, 
    DistrictCreateRequest, 
    EventType, 
    EventTypeCreateRequest, 
    AdminFurniture as Furniture,
    CreateFurnitureRequest as FurnitureCreateRequest,
    Customer,
    AdminReservation as Reservation,
    DashboardStats
} from '@/api/interfaces';

export const useAdminService = () => {
    // ==================== DASHBOARD ====================
    const getDashboardStats = async (): Promise<DashboardStats> => {
        const response = await apiClient.get<any>('/admin/dashboard/stats');
        return response.data;
    };


    // ==================== LOCALES ====================
    const getAllVenues = async (): Promise<Venue[]> => {
        const response = await apiClient.get<any>('/admin/venues');
        return response.data || [];
    };

    const getVenueById = async (id: number): Promise<Venue> => {
        const response = await apiClient.get<any>(`/admin/venues/${id}`);
        return response.data;
    };

    const createVenue = async (venue: VenueCreateRequest): Promise<Venue> => {
        const response = await apiClient.post<any>('/admin/venues', venue);
        return response.data;
    };

    const updateVenue = async (id: number, venue: VenueCreateRequest): Promise<Venue> => {
        const response = await apiClient.put<any>(`/admin/venues/${id}`, venue);
        return response.data;
    };

    const deleteVenue = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/venues/${id}`);
    };

    const searchVenues = async (name: string): Promise<Venue[]> => {
        const response = await apiClient.get<any>(`/admin/venues/search?name=${name}`);
        return response.data || [];
    };

    // ==================== DISTRITOS ====================
    const getAllDistricts = async (): Promise<District[]> => {
        const response = await apiClient.get<any>('/admin/districts');
        return response.data || [];
    };

    const getDistrictById = async (id: number): Promise<District> => {
        const response = await apiClient.get<any>(`/admin/districts/${id}`);
        return response.data;
    };

    const createDistrict = async (district: DistrictCreateRequest): Promise<District> => {
        const response = await apiClient.post<any>('/admin/districts', district);
        return response.data;
    };

    const updateDistrict = async (id: number, district: DistrictCreateRequest): Promise<District> => {
        const response = await apiClient.put<any>(`/admin/districts/${id}`, district);
        return response.data;
    };

    const deleteDistrict = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/districts/${id}`);
    };

    const searchDistricts = async (name: string): Promise<District[]> => {
        const response = await apiClient.get<any>(`/admin/districts/search?name=${name}`);
        return response.data || [];
    };

    // ==================== TIPOS DE EVENTO ====================
    const getAllEventTypes = async (): Promise<EventType[]> => {
        const response = await apiClient.get<any>('/admin/event-types');
        return response.data || [];
    };

    const getEventTypeById = async (id: number): Promise<EventType> => {
        const response = await apiClient.get<any>(`/admin/event-types/${id}`);
        return response.data;
    };

    const createEventType = async (eventType: EventTypeCreateRequest): Promise<EventType> => {
        const response = await apiClient.post<any>('/admin/event-types', eventType);
        return response.data;
    };

    const updateEventType = async (id: number, eventType: EventTypeCreateRequest): Promise<EventType> => {
        const response = await apiClient.put<any>(`/admin/event-types/${id}`, eventType);
        return response.data;
    };

    const deleteEventType = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/event-types/${id}`);
    };

    const searchEventTypes = async (name: string): Promise<EventType[]> => {
        const response = await apiClient.get<any>(`/admin/event-types/search?name=${encodeURIComponent(name)}`);
        return response.data || [];
    };

    // ==================== MOBILIARIO ====================
    const getAllFurniture = async (): Promise<Furniture[]> => {
        const response = await apiClient.get<any>('/admin/furniture');
        return (response.data || []).map((item: Furniture) => ({
            furnitureId: item.furnitureId,
            furnitureName: item.furnitureName,
            description: item.description,
            unitPrice: item.unitPrice || 0,
            totalStock: item.totalStock || 0,
            photoUrl: item.photoUrl || '',
            createdAt: item.createdAt || '',
            totalReservations: item.totalReservations || 0
        }));
    };

    const getFurnitureById = async (id: number): Promise<Furniture> => {
        const response = await apiClient.get<any>(`/admin/furniture/${id}`);
        const item: Furniture = response.data;
        return {
            furnitureId: item.furnitureId,
            furnitureName: item.furnitureName,
            description: item.description,
            unitPrice: item.unitPrice || 0,
            totalStock: item.totalStock || 0,
            photoUrl: item.photoUrl || '',
            createdAt: item.createdAt || '',
            totalReservations: item.totalReservations || 0
        };
    };

    const createFurniture = async (furniture: FurnitureCreateRequest): Promise<Furniture> => {
        const requestBody: FurnitureCreateRequest = {
            furnitureName: furniture.furnitureName,
            description: furniture.description,
            unitPrice: furniture.unitPrice,
            totalStock: furniture.totalStock,
            photoUrl: furniture.photoUrl
        };
        const response = await apiClient.post<any>('/admin/furniture', requestBody);
        const item: Furniture = response.data;
        return {
            furnitureId: item.furnitureId,
            furnitureName: item.furnitureName,
            description: item.description,
            unitPrice: item.unitPrice || 0,
            totalStock: item.totalStock || 0,
            photoUrl: item.photoUrl || '',
            createdAt: item.createdAt || '',
            totalReservations: item.totalReservations || 0
        };
    };

    const updateFurniture = async (id: number, furniture: FurnitureCreateRequest): Promise<Furniture> => {
        const requestBody: FurnitureCreateRequest = {
            furnitureName: furniture.furnitureName,
            description: furniture.description,
            unitPrice: furniture.unitPrice,
            totalStock: furniture.totalStock,
            photoUrl: furniture.photoUrl
        };
        const response = await apiClient.put<any>(`/admin/furniture/${id}`, requestBody);
        const item: Furniture = response.data;
        return {
            furnitureId: item.furnitureId,
            furnitureName: item.furnitureName,
            description: item.description,
            unitPrice: item.unitPrice || 0,
            totalStock: item.totalStock || 0,
            photoUrl: item.photoUrl || '',
            createdAt: item.createdAt || '',
            totalReservations: item.totalReservations || 0
        };
    };

    const deleteFurniture = async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/furniture/${id}`);
    };

    const searchFurniture = async (name: string): Promise<Furniture[]> => {
        const response = await apiClient.get<any>(`/admin/furniture/search?name=${encodeURIComponent(name)}`);
        return (response.data || []).map((item: Furniture) => ({
            furnitureId: item.furnitureId,
            furnitureName: item.furnitureName,
            description: item.description,
            unitPrice: item.unitPrice || 0,
            totalStock: item.totalStock || 0,
            photoUrl: item.photoUrl || '',
            createdAt: item.createdAt || '',
            totalReservations: item.totalReservations || 0
        }));
    };

    // ==================== CLIENTES ====================
    const getAllCustomers = async (): Promise<Customer[]> => {
        const response = await apiClient.get<any>('/admin/users/clients');
        return response.data || [];
    };

    const searchCustomers = async (keyword: string): Promise<Customer[]> => {
        try {
            const response = await apiClient.get<any>(`/admin/users/customers/search?keyword=${encodeURIComponent(keyword)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error en searchCustomers:', error);
            throw error;
        }
    };

    // ==================== RESERVAS ====================
    const getAllReservations = async (): Promise<Reservation[]> => {
        const response = await apiClient.get<any>('/admin/reservations');
        return response.data || [];
    };

    const updateReservationStatus = async (id: number, status: string): Promise<Reservation> => {
        const response = await apiClient.put<any>(
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
