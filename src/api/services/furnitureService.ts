import { apiClient } from '@/api/base';
import type { Furniture } from '@/api/interfaces';

/**
 * Servicio para gestionar mobiliario (Vista Cliente)
 * Endpoints base: /api/furniture/*
 */
export const useFurnitureService = () => {
  /**
   * Obtener todo el mobiliario disponible
   * @returns Lista de mobiliario con stock y precios
   */
  const getAllFurniture = async (): Promise<Furniture[]> => {
    try {
      const response = await apiClient.get<Furniture[]>('/furniture');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mobiliario:', error);
      throw error;
    }
  };

  /**
   * Obtener mobiliario por ID
   * @param id - ID del mobiliario
   * @returns Detalle del mobiliario específico
   */
  const getFurnitureById = async (id: number): Promise<Furniture> => {
    try {
      const response = await apiClient.get<Furniture>(`/furniture/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mobiliario ${id}:`, error);
      throw error;
    }
  };

  return {
    getAllFurniture,
    getFurnitureById,
  };
};
