import { apiClient } from '@/api/base';
import type { District, DistrictCard } from '@/api/interfaces';
import { ENDPOINTS } from '@/api/config/endpoints';

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
    const response = await apiClient.get<District[]>(ENDPOINTS.DISTRICTS.BASE);
    return response.data;
  };

  /**
   * Obtener distritos con fotos y conteo de locales
   * @returns Distritos con información visual para tarjetas
   */
  const getDistrictCards = async (): Promise<DistrictCard[]> => {
    const response = await apiClient.get<DistrictCard[]>(ENDPOINTS.DISTRICTS.CARDS);
    return response.data;
  };

  return {
    getAllDistricts,
    getDistrictCards,
  };
};
