import { useState, useEffect, useCallback } from 'react';
import { useEventTypeService } from '@/api/services/eventTypeService';
import { parseApiError } from '@/api/base';
import type { EventType } from '@/api/interfaces';


/**
 * Hook para obtener todos los tipos de evento
 */
export const useEventTypes = () => {
    const eventTypeService = useEventTypeService();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEventTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await eventTypeService.getAllEventTypes();
            setEventTypes(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEventTypes();
    }, [fetchEventTypes]);

    return { eventTypes, loading, error, refetch: fetchEventTypes };
};

/**
 * Hook para obtener un tipo de evento por ID
 */
export const useEventTypeById = (eventTypeId: number) => {
    const eventTypeService = useEventTypeService();
    const [eventType, setEventType] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEventType = useCallback(async () => {
        if (!eventTypeId) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await eventTypeService.getEventTypeById(eventTypeId);
            setEventType(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, [eventTypeId]);

    useEffect(() => {
        fetchEventType();
    }, [fetchEventType]);

    return { eventType, loading, error, refetch: fetchEventType };
};
