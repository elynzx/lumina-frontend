import { useState, useEffect, useCallback } from 'react';
import { useDistrictService } from '@/api/services/districtService';
import { parseApiError } from '@/api/base';
import type { District, DistrictCard } from '@/api/interfaces';


/**
 * Hook para obtener todos los distritos
 */
export const useDistricts = () => {
    const districtService = useDistrictService();
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDistricts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const districts = await districtService.getAllDistricts();
            setDistricts(districts);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [fetchDistricts]);

    return { districts, loading, error, refetch: fetchDistricts };
};

/**
 * Hook para obtener tarjetas de distritos (para vista de cliente)
 */
export const useDistrictCards = () => {
    const districtService = useDistrictService();
    const [districtCards, setDistrictCards] = useState<DistrictCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDistrictCards = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const cards = await districtService.getDistrictCards();
            setDistrictCards(cards);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDistrictCards();
    }, [fetchDistrictCards]);

    return { districtCards, loading, error, refetch: fetchDistrictCards };
};
