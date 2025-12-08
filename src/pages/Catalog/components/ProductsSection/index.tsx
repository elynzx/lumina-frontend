import { useNavigate } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { useVenues } from "@/hooks/api";
import { memo, useCallback } from "react";

interface Venue {
  venueId: number;
  venueName: string;
  address: string;
  districtName: string;
  maxCapacity: number;
  pricePerHour: number;
  mainPhotoUrl: string;
}

interface ProductsSectionProps {
  venues: Venue[];
}

export const ProductsSection = memo(({ venues }: ProductsSectionProps) => {
  const navigate = useNavigate();

  const handleReserveClick = useCallback((venueId: number) => {
    navigate(`/producto/${venueId}`);
  }, [navigate]);

  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay locales disponibles según tu búsqueda
          </h3>
          <p className="text-gray-500">
            Prueba ajustando los filtros para encontrar más opciones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-grid">
      {venues?.map((venue) => (
        <ProductCard
          key={venue.venueId}
          imgUrl={venue.mainPhotoUrl}
          title={venue.venueName}
          district={venue.districtName}
          address={venue.address}
          capacity={venue.maxCapacity}
          pricePerHour={venue.pricePerHour}
          buttonText="Reservar"
          onClick={() => handleReserveClick(venue.venueId)}
          onClickAction={() => handleReserveClick(venue.venueId)}
        />
      ))}
    </div>
  );
});