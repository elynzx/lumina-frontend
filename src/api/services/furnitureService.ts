import { apiClient } from '@/api/base';
import type { Furniture } from '@/api/interfaces';
import { ENDPOINTS } from '@/api/config/endpoints';

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
    const response = await apiClient.get<Furniture[]>(ENDPOINTS.FURNITURE.BASE);
    return response.data;
  };

  /**
   * Obtener mobiliario por ID
   * @param id - ID del mobiliario
   * @returns Detalle del mobiliario específico
   */
  const getFurnitureById = async (id: number): Promise<Furniture> => {
    const response = await apiClient.get<Furniture>(ENDPOINTS.FURNITURE.BY_ID(id));
    return response.data;
  };

  /**
   * Verificar disponibilidad de mobiliario para una fecha y cantidad específicas
   * @param id - ID del mobiliario
   * @param quantity - Cantidad requerida
   * @param date - Fecha para verificar disponibilidad
   * @returns `true` si hay stock suficiente, `false` en caso contrario
   */
  const checkFurnitureAvailability = async (
    id: number,
    quantity: number,
    date: string
  ): Promise<boolean> => {
    const response = await apiClient.get<{ data: boolean }>(
      ENDPOINTS.FURNITURE.CHECK_AVAILABILITY(id, quantity, date)
    );
    return response.data.data;
  };

  return {
    getAllFurniture,
    getFurnitureById,
    checkFurnitureAvailability,
  };
};
