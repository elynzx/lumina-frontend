import { useState } from "react";
import { useFeaturedVenues } from "@/hooks/api";
import { PopularVenueOverlay } from "./PopularVenueOverlay";
import { SlideNavigation } from "@/pages/Home/components/PopularVenuesSection/SlideNavigation";

const title = "Los salones más reservados";
const paragraph = "Descubre los espacios favoritos de nuestros usuarios. Estos locales destacan por su calidad, ubicación y servicios excepcionales que garantizan el éxito de tu evento.";

export const PopularVenuesSection = () => {
  const { venues, loading, error } = useFeaturedVenues();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % venues.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + venues.length) % venues.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[620px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Cargando locales destacados...</p>
      </div>
    );
  }

  if (error || venues.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[620px] overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${venues[currentSlide]?.mainPhoto})`
        }}
      />

      {/* Overlay con contenido */}
      <PopularVenueOverlay
        title={title}
        description={paragraph}
        currentItemTitle={venues[currentSlide]?.venueName}
      >
        <SlideNavigation
          onPrev={prevSlide}
          onNext={nextSlide}
          currentSlide={currentSlide}
          totalSlides={venues.length}
        />
      </PopularVenueOverlay>
    </div>
  );
};