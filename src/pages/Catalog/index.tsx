import { useState, useEffect, useMemo, useCallback } from "react";
import { FilterBar } from "./components/FilterBar";
import { ProductsSection } from "./components/ProductsSection";
import { useVenues, useSearchVenues, useEventTypes } from "@/hooks/api";
import { useFilterStore } from "@/store/useFilterStore"

export const Catalog = () => {
    const districtId = useFilterStore((state) => state.districtId);
    const eventTypeId = useFilterStore((state) => state.eventTypeId);
    const priceRange = useFilterStore((state) => state.priceRange);
    const minCapacity = useFilterStore((state) => state.minCapacity); // Agregado
    const maxCapacity = useFilterStore((state) => state.maxCapacity); // Agregado para incluir maxCapacity

    const { venues: allVenues, loading: loadingAll, error: errorAll } = useVenues();
    const { venues: filteredVenues, loading: loadingFiltered, error: errorFiltered, searchVenues } = useSearchVenues();
    const { eventTypes } = useEventTypes();
    const [displayedVenues, setDisplayedVenues] = useState<any[]>([]);
    const memoizedEventTypes = useMemo(() => eventTypes ?? [], [eventTypes]);

    const hasActiveFilters = useMemo(() => {
        return !!(districtId || eventTypeId || minCapacity || priceRange);
    }, [districtId, eventTypeId, minCapacity, priceRange]);

    const validFilters = useMemo(() => {
        const filters = {
            districtId: districtId ?? undefined,
            eventTypeId: eventTypeId ?? undefined,
            minCapacity: minCapacity ?? undefined, // Usar minCapacity directamente
            maxCapacity: maxCapacity ?? undefined, // Agregado para incluir maxCapacity
            minPrice: priceRange?.min ?? undefined,
            maxPrice: priceRange?.max === Infinity ? undefined : priceRange?.max ?? undefined,
        };
        console.log("🛠 Generando filtros válidos:", filters);
        return Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== undefined && value !== null && !Number.isNaN(value)
            )
        );
    }, [districtId, eventTypeId, minCapacity, maxCapacity, priceRange]);

    useEffect(() => {
        if (hasActiveFilters && Object.keys(validFilters).length > 0) {
            console.log('🔍 Enviando filtros al backend:', validFilters);
            searchVenues(validFilters);
        }
    }, [validFilters, hasActiveFilters, searchVenues]);

    useEffect(() => {
        if (hasActiveFilters) {
            setDisplayedVenues(filteredVenues ?? []);
        } else {
            setDisplayedVenues(allVenues ?? []);
        }
    }, [filteredVenues, allVenues, hasActiveFilters]);

    if (loadingAll && !allVenues.length) {
        return <div className="section-container">Cargando locales...</div>;
    }
    if (errorAll) {
        return <div className="section-container text-red-500">Error al cargar todos los locales. Por favor, intenta nuevamente más tarde.</div>;
    }

    if (errorFiltered) {
        return <div className="section-container text-red-500">Error al buscar locales con los filtros aplicados. Por favor, ajusta los filtros o intenta nuevamente.</div>;
    }

    return (
        <div className="section-container">
            <h2 className="text-title">Los mejores locales</h2>
            <FilterBar eventTypes={memoizedEventTypes} />
            {loadingFiltered ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <ProductsSection venues={displayedVenues} />
            )}
        </div>
    );
};
