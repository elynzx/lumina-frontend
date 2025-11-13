import { apiClient } from '@/api/base';
import type { EventType } from '@/api/interfaces';

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
    try {
      const response = await apiClient.get<EventType[]>('/event-types');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de eventos:', error);
      throw error;
    }
  };

  /**
   * Obtener tipo de evento por ID
   * @param id - ID del tipo de evento
   * @returns Detalle del tipo de evento
   */
  const getEventTypeById = async (id: number): Promise<EventType> => {
    try {
      const response = await apiClient.get<EventType>(`/event-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tipo de evento ${id}:`, error);
      throw error;
    }
  };

  return {
    getAllEventTypes,
    getEventTypeById,
  };
};
