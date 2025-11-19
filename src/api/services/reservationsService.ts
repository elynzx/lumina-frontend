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
import { ENDPOINTS } from '@/api/config/endpoints';

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
    const response = await apiClient.post<ReservationResponse>(
      ENDPOINTS.RESERVATIONS.CREATE,
      data
    );
    return response.data;
  };

  /**
   * Verificar disponibilidad de un local
   * @param data - Local, fecha y rango horario a verificar
   * @returns Estado de disponibilidad y conflictos si existen
   */
  const checkAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
    const response = await apiClient.post<AvailabilityResponse>(
      ENDPOINTS.RESERVATIONS.CHECK_AVAILABILITY,
      data
    );
    return response.data;
  };

  /**
   * Calcular presupuesto de una reserva
   * @param data - Datos de la reserva para calcular costos
   * @returns Desglose completo de costos (local, mobiliario, total)
   */
  const calculateBudget = async (data: ReservationRequest): Promise<BudgetCalculation> => {
    const response = await apiClient.post<BudgetCalculation>(
      ENDPOINTS.RESERVATIONS.CALCULATE_BUDGET,
      data
    );
    return response.data;
  };

  /**
   * Obtener detalle completo de una reserva
   * Incluye información de pago, mobiliario, local y cliente
   * @param id - ID de la reserva
   * @returns Detalle completo con código de confirmación
   */
  const getReservationDetails = async (id: number): Promise<ReservationSuccess> => {
    const response = await apiClient.get<ReservationSuccess>(
      ENDPOINTS.RESERVATIONS.DETAILS(id)
    );
    return response.data;
  };

  /**
   * Obtener todas las reservas del usuario autenticado
   * @returns Lista de reservas propias (confirmadas, pendientes, canceladas)
   */
  const getMyReservations = async (): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>(
      ENDPOINTS.RESERVATIONS.MY_RESERVATIONS
    );
    return response.data;
  };

  /**
   * Cancelar una reserva
   * @param id - ID de la reserva a cancelar
   * @returns Datos de la reserva cancelada
   */
  const cancelReservation = async (id: number): Promise<ReservationResponse> => {
    const response = await apiClient.put<ReservationResponse>(
      ENDPOINTS.RESERVATIONS.CANCEL(id)
    );
    return response.data;
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
