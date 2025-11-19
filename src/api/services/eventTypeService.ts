import { apiClient } from '@/api/base';
import type { EventType } from '@/api/interfaces';
import { ENDPOINTS } from '@/api/config/endpoints';

/**
 * Servicio para gestionar tipos de eventos (Vista Cliente)
 * Endpoints base: /api/event-types/*
 */
export const useEventTypeService = () => {
  /**
   * Obtener todos los tipos de eventos
   * @returns Lista de tipos de eventos disponibles
   */
  const getAllEventTypes = async (): Promise<EventType[]> => {
    const response = await apiClient.get<EventType[]>(ENDPOINTS.EVENT_TYPES.BASE);
    return response.data;
  };

  /**
   * Obtener tipo de evento por ID
   * @param id - ID del tipo de evento
   * @returns Detalle del tipo de evento
   */
  const getEventTypeById = async (id: number): Promise<EventType> => {
    const response = await apiClient.get<EventType>(ENDPOINTS.EVENT_TYPES.BY_ID(id));
    return response.data;
  };

  return {
    getAllEventTypes,
    getEventTypeById,
  };
};
