import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterBar } from "./components/FilterBar";
import { ProductsSection } from "./components/ProductsSection";
import { data } from "@/constants/data";

export const Catalog = () => {
    const [searchParams] = useSearchParams();
    const [displayedLocales, setDisplayedLocales] = useState(data.locales);

    useEffect(() => {
        const venueIds = searchParams.get('locales')?.split(',').map(id => parseInt(id)) || [];

        if (venueIds.length > 0) {
            const filteredFromSearch = data.locales.filter(local => venueIds.includes(local.idLocal));
            setDisplayedLocales(filteredFromSearch);
        } else {
            setDisplayedLocales(data.locales);
        }
    }, [searchParams]);
    
    const handleFilterChange = (filteredLocales: any[]) => {
        setDisplayedLocales(filteredLocales);
    };

    return (
        <div className="section-container">
            <h2 className="text-title">Los mejores locales</h2>
            <FilterBar onFilterChange={handleFilterChange} />
            <ProductsSection locales={displayedLocales} />
        </div>
    )
};
