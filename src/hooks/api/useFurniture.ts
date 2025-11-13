import { useState, useEffect, useCallback } from 'react';
import { useFurnitureService } from '@/api/services/furnitureService';
import { parseApiError } from '@/api/base';
import type { Furniture } from '@/api/interfaces';

const furnitureService = useFurnitureService();

/**
 * Hook para obtener todo el mobiliario disponible
 */
export const useFurniture = () => {
    const [furniture, setFurniture] = useState<Furniture[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFurniture = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await furnitureService.getAllFurniture();
            setFurniture(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFurniture();
    }, [fetchFurniture]);

    return { furniture, loading, error, refetch: fetchFurniture };
};

/**
 * Hook para obtener un mueble específico por ID
 */
export const useFurnitureById = (furnitureId: number) => {
    const [furniture, setFurniture] = useState<Furniture | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFurniture = useCallback(async () => {
        if (!furnitureId) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await furnitureService.getFurnitureById(furnitureId);
            setFurniture(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, [furnitureId]);

    useEffect(() => {
        fetchFurniture();
    }, [fetchFurniture]);

    return { furniture, loading, error, refetch: fetchFurniture };
};
