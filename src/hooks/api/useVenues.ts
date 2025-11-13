import { useState, useEffect, useCallback } from 'react';
import { useVenueService } from '@/api/services/venueService';
import { parseApiError } from '@/api/base';
import type { VenueCard, VenueDetail, VenueFilters, VenueSlider } from '@/api/interfaces';

/**
 * Hook para obtener todos los locales
 */
export const useVenues = () => {
    const [venues, setVenues] = useState<VenueCard[]>([]);
    const venueService = useVenueService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVenues = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await venueService.getAllVenues();
            setVenues(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVenues();
    }, [fetchVenues]);

    return { venues, loading, error, refetch: fetchVenues };
};

/**
 * Hook para obtener locales destacados
 */
export const useFeaturedVenues = () => {
    const venueService = useVenueService();
    const [venues, setVenues] = useState<VenueSlider[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeaturedVenues = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await venueService.getFeaturedVenues();
            setVenues(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeaturedVenues();
    }, [fetchFeaturedVenues]);

    return { venues, loading, error, refetch: fetchFeaturedVenues };
};

/**
 * Hook para obtener detalle de un local
 */
export const useVenueDetail = (venueId: number) => {
  const venueService = useVenueService();
    const [venue, setVenue] = useState<VenueDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVenueDetail = useCallback(async () => {
        if (!venueId) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await venueService.getVenueById(venueId);
            setVenue(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, [venueId]);

    useEffect(() => {
        fetchVenueDetail();
    }, [fetchVenueDetail]);

    return { venue, loading, error, refetch: fetchVenueDetail };
};

/**
 * Hook para buscar locales con filtros
 */
export const useSearchVenues = () => {
    const venueService = useVenueService();
    const [venues, setVenues] = useState<VenueCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchVenues = useCallback(async (params: VenueFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await venueService.searchVenues(params);
            setVenues(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { venues, loading, error, searchVenues };
};
