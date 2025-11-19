import { useState, useEffect, useCallback } from 'react';
import { useEventTypeService } from '@/api/services/eventTypeService';
import { parseApiError } from '@/api/base';
import type { EventType } from '@/api/interfaces';

/**
 * Hook para obtener los tipos de evento asociados a un local
 */
export const useEventTypesByVenue = (venueId: number) => {
    const eventTypeService = useEventTypeService();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEventTypesByVenue = useCallback(async () => {
        if (!venueId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await eventTypeService.getEventTypesByVenue(venueId);
            setEventTypes(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, [venueId]);

    useEffect(() => {
        fetchEventTypesByVenue();
    }, [fetchEventTypesByVenue]);

    return { eventTypes, loading, error, refetch: fetchEventTypesByVenue };
};