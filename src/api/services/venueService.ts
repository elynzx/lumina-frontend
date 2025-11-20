import { apiClient } from '@/api/base';
import type {
  VenueCard,
  VenueSlider,
  VenueDetail,
  VenueFilters
} from '@/api/interfaces';
import { ENDPOINTS } from '@/api/config/endpoints';

/**
 * Servicio para gestionar locales de eventos (Vista Cliente)
 * Endpoints base: /api/venues/*
 */
export const useVenueService = () => {
  /**
   * Obtener todos los locales disponibles
   * @returns Lista de locales con estado AVAILABLE
   */
  const getAllVenues = async (): Promise<VenueCard[]> => {
    const response = await apiClient.get<VenueCard[]>(ENDPOINTS.VENUES.BASE);
    return response.data;
  };

  /**
   * Obtener locales destacados para el slider del home
   * @returns Lista de locales destacados (máximo 5)
   */
  const getFeaturedVenues = async (): Promise<VenueSlider[]> => {
    const response = await apiClient.get<VenueSlider[]>(ENDPOINTS.VENUES.FEATURED);
    return response.data;
  };

  /**
   * Obtener detalle completo de un local específico
   * Incluye descripción, fotos, servicios, tipos de eventos y ubicación
   * @param id - ID del local
   * @returns Detalle completo del local
   */
  const getVenueById = async (id: number): Promise<VenueDetail> => {
    const response = await apiClient.get<VenueDetail>(ENDPOINTS.VENUES.BY_ID(id));
    return response.data;
  };

  /**
   * Buscar locales con filtros
   * Todos los filtros son opcionales y se combinan con AND
   * @param filters - Criterios de búsqueda (distrito, tipo evento, capacidad, precio)
   * @returns Locales que cumplen los criterios
   */
  const searchVenues = async (filters: VenueFilters): Promise<VenueCard[]> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    const response = await apiClient.get<VenueCard[]>(
      `${ENDPOINTS.VENUES.SEARCH}?${params.toString()}`
    );
    return response.data;

  };

  /**
   * Obtener fechas no disponibles para un local específico
   * @param venueId - ID del local
   * @returns Lista de fechas no disponibles (YYYY-MM-DD)
   */
  const getUnavailableDates = async (venueId: number): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      ENDPOINTS.VENUES.UNAVAILABLE_DATES(venueId)
    );
    return response.data || [];
  };

  return {
    getAllVenues,
    getFeaturedVenues,
    getVenueById,
    searchVenues,
    getUnavailableDates,
  };
};
