import { useState, useCallback } from 'react';
import { useReservationService } from '@/api/services/reservationsService';
import { parseApiError } from '@/api/base';
import type {
    ReservationRequest,
    ReservationResponse,
    ReservationSuccess,
    AvailabilityRequest,
    AvailabilityResponse,
    BudgetCalculation,
    Reservation,
    CreateReservationRequest,
    CreateReservationResponse,
} from '@/api/interfaces';



/**
 * Hook para crear una nueva reserva
 */
export const useCreateReservation = () => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reservation, setReservation] = useState<CreateReservationResponse | null>(null);

    const createReservation = useCallback(async (data: CreateReservationRequest) => {
        setLoading(true);
        setError(null);
        try {
            const result = await reservationsService.createReservation(data);
            setReservation(result);
            return result;
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createReservation, reservation, loading, error };
};

/**
 * Hook para verificar disponibilidad de un local
 */
export const useCheckAvailability = () => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);

    const checkAvailability = useCallback(async (data: AvailabilityRequest) => {
        setLoading(true);
        setError(null);
        try {
            const result = await reservationsService.checkAvailability(data);
            setAvailability(result);
            return result;
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { checkAvailability, availability, loading, error };
};

/**
 * Hook para calcular presupuesto de una reserva
 */
export const useCalculateBudget = () => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [budget, setBudget] = useState<BudgetCalculation | null>(null);

    const calculateBudget = useCallback(async (data: ReservationRequest) => {
        setLoading(true);
        setError(null);
        try {
            const result = await reservationsService.calculateBudget(data);
            setBudget(result);
            return result;
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { calculateBudget, budget, loading, error };
};

/**
 * Hook para obtener detalles de una reserva
 */
export const useReservationDetails = (reservationId: number) => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reservation, setReservation] = useState<ReservationSuccess | null>(null);

    const fetchReservation = useCallback(async () => {
        if (!reservationId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await reservationsService.getReservationDetails(reservationId);
            setReservation(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, [reservationId]);

    return { reservation, loading, error, refetch: fetchReservation };
};

/**
 * Hook para obtener mis reservas
 */
export const useMyReservations = () => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const fetchMyReservations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await reservationsService.getMyReservations();
            setReservations(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { reservations, loading, error, refetch: fetchMyReservations };
};

/**
 * Hook para cancelar una reserva
 */
export const useCancelReservation = () => {
    const reservationsService = useReservationService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelReservation = useCallback(async (reservationId: number) => {
        setLoading(true);
        setError(null);
        try {
            await reservationsService.cancelReservation(reservationId);
            return true;
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { cancelReservation, loading, error };
};
