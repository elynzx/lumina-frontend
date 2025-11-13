import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FilterBar } from "./components/FilterBar";
import { ProductsSection } from "./components/ProductsSection";
import { useVenues, useSearchVenues, useEventTypes } from "@/hooks/api";

export const Catalog = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { venues: allVenues, loading: loadingAll, error: errorAll } = useVenues();
    const { venues: filteredVenues, loading: loadingFiltered, error: errorFiltered, searchVenues } = useSearchVenues();
    const { eventTypes } = useEventTypes();
    const [displayedVenues, setDisplayedVenues] = useState<any[]>([]);

    useEffect(() => {
        const hasFilters = searchParams.toString().length > 0;
        if (hasFilters) {
            const districtId = searchParams.get("districtId");
            const eventTypeId = searchParams.get("eventTypeId");
            const minCapacity = searchParams.get("minCapacity");
            const minPrice = searchParams.get("minPrice");
            const maxPrice = searchParams.get("maxPrice");

            searchVenues({
                districtId: districtId ? parseInt(districtId) : undefined,
                eventTypeId: eventTypeId ? parseInt(eventTypeId) : undefined,
                minCapacity: minCapacity ? parseInt(minCapacity) : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            });
        }
        console.log("Parámetros recibidos:", {
            districtId: searchParams.get("districtId"),
            eventTypeId: searchParams.get("eventTypeId"),
            minCapacity: searchParams.get("minCapacity")
        });
    }, [searchParams]);

    useEffect(() => {
        const hasFilters = searchParams.toString().length > 0;
        if (hasFilters) {
            setDisplayedVenues(filteredVenues ?? []);
        } else {
            setDisplayedVenues(allVenues ?? []);
        }
    }, [filteredVenues, allVenues, searchParams]);

    /* const handleFilterChange = (params: Record<string, any>) => {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== null) urlParams.set(key, value.toString());
        });
        //navigate(`/catalogo?${urlParams.toString()}`);
    }; */

    if (loadingAll || loadingFiltered) {
        return <div className="section-container">Cargando locales...</div>;
    }
    if (errorAll || errorFiltered) {
        return <div className="section-container text-red-500">Error al cargar locales</div>;
    }

    return (
        <div className="section-container">
            <h2 className="text-title">Los mejores locales</h2>
            <FilterBar eventTypes={eventTypes ?? []} />
            <ProductsSection venues={displayedVenues} />
        </div>
    )
};
