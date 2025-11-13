import { apiClient } from '@/api/base';
import type { 
  ReservationRequest,
  ReservationResponse,
  ReservationSuccess,
  AvailabilityRequest,
  AvailabilityResponse,
  BudgetCalculation,
  Reservation
} from '@/api/interfaces';

/**
 * Servicio para gestionar reservas (Vista Cliente)
 * Endpoints base: /api/reservations/*
 */
export const useReservationService = () => {
  /**
   * Crear una nueva reserva
   * @param data - Datos de la reserva (local, fecha, hora, invitados, mobiliario)
   * @returns Datos de la reserva creada
   */
  const createReservation = async (data: ReservationRequest): Promise<ReservationResponse> => {
    try {
      const response = await apiClient.post<ReservationResponse>(
        '/reservations',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  };

  /**
   * Verificar disponibilidad de un local
   * @param data - Local, fecha y rango horario a verificar
   * @returns Estado de disponibilidad y conflictos si existen
   */
  const checkAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
    try {
      const response = await apiClient.post<AvailabilityResponse>(
        '/reservations/availability',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  };

  /**
   * Calcular presupuesto de una reserva
   * @param data - Datos de la reserva para calcular costos
   * @returns Desglose completo de costos (local, mobiliario, total)
   */
  const calculateBudget = async (data: ReservationRequest): Promise<BudgetCalculation> => {
    try {
      const response = await apiClient.post<BudgetCalculation>(
        '/reservations/calculate-budget',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error al calcular presupuesto:', error);
      throw error;
    }
  };

  /**
   * Obtener detalle completo de una reserva
   * Incluye información de pago, mobiliario, local y cliente
   * @param id - ID de la reserva
   * @returns Detalle completo con código de confirmación
   */
  const getReservationDetails = async (id: number): Promise<ReservationSuccess> => {
    try {
      const response = await apiClient.get<ReservationSuccess>(
        `/reservations/${id}/details`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalle de reserva ${id}:`, error);
      throw error;
    }
  };

  /**
   * Obtener todas las reservas del usuario autenticado
   * @returns Lista de reservas propias (confirmadas, pendientes, canceladas)
   */
  const getMyReservations = async (): Promise<Reservation[]> => {
    try {
      const response = await apiClient.get<Reservation[]>(
        '/reservations/my-reservations'
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis reservas:', error);
      throw error;
    }
  };

  /**
   * Cancelar una reserva
   * @param id - ID de la reserva a cancelar
   * @returns Datos de la reserva cancelada
   */
  const cancelReservation = async (id: number): Promise<ReservationResponse> => {
    try {
      const response = await apiClient.put<ReservationResponse>(
        `/reservations/${id}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar reserva ${id}:`, error);
      throw error;
    }
  };

  return {
    createReservation,
    checkAvailability,
    calculateBudget,
    getReservationDetails,
    getMyReservations,
    cancelReservation,
  };
};
