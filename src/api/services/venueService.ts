import { apiClient } from '@/api/base';
import type {
  VenueCard,
  VenueSlider,
  VenueDetail,
  VenueFilters
} from '@/api/interfaces';

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
    try {
      const response = await apiClient.get<VenueCard[]>('/venues');
      return response.data;
    } catch (error) {
      console.error('Error al obtener locales:', error);
      throw error;
    }
  };

  /**
   * Obtener locales destacados para el slider del home
   * @returns Lista de locales destacados (máximo 5)
   */
  const getFeaturedVenues = async (): Promise<VenueSlider[]> => {
    try {
      const response = await apiClient.get<VenueSlider[]>('/venues/slider');
      return response.data;
    } catch (error) {
      console.error('Error al obtener locales destacados:', error);
      throw error;
    }
  };

  /**
   * Obtener detalle completo de un local específico
   * Incluye descripción, fotos, servicios, tipos de eventos y ubicación
   * @param id - ID del local
   * @returns Detalle completo del local
   */
  const getVenueById = async (id: number): Promise<VenueDetail> => {
    try {
      const response = await apiClient.get<VenueDetail>(`/venues/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener local ${id}:`, error);
      throw error;
    }
  };

  /**
   * Buscar locales con filtros
   * Todos los filtros son opcionales y se combinan con AND
   * @param filters - Criterios de búsqueda (distrito, tipo evento, capacidad, precio)
   * @returns Locales que cumplen los criterios
   */
  const searchVenues = async (filters: VenueFilters): Promise<VenueCard[]> => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
      const response = await apiClient.get<VenueCard[]>(
        `/venues/search?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error en búsqueda de locales:', error);
      throw error;
    } 
  };

  return {
    getAllVenues,
    getFeaturedVenues,
    getVenueById,
    searchVenues,
  };
};
