import { apiClient } from '@/api/base';
import type { District, DistrictCard } from '@/api/interfaces';

/**
 * Servicio para gestionar distritos (Vista Cliente)
 * Endpoints base: /api/districts/*
 */
export const useDistrictService = () => {
  /**
   * Obtener todos los distritos
   * @returns Lista básica de distritos (id y nombre)
   */
  const getAllDistricts = async (): Promise<District[]> => {
    try {
      const response = await apiClient.get<District[]>('/districts');
      return response.data;
    } catch (error) {
      console.error('Error al obtener distritos:', error);
      throw error;
    }
  };

  /**
   * Obtener distritos con fotos y conteo de locales
   * @returns Distritos con información visual para tarjetas
   */
  const getDistrictCards = async (): Promise<DistrictCard[]> => {
    try {
      const response = await apiClient.get<DistrictCard[]>('/districts/cards');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tarjetas de distritos:', error);
      throw error;
    }
  };

  return {
    getAllDistricts,
    getDistrictCards,
  };
};
