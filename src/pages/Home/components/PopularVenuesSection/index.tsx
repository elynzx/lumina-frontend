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
    <div className="relative w-full h-auto sm:h-[500px] lg:h-[550px] overflow-hidden">
      {/* Mobile: Stack layout */}
      <div className="sm:hidden flex flex-col">
        {/* Imagen arriba en mobile */}
        <div
          className="w-full h-[250px] transition-all duration-700"
          style={{
            backgroundImage: `url(${venues[currentSlide]?.mainPhoto})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Contenido abajo en mobile */}
        <div className="bg-gradient-radial py-8 px-6">
          <h2 className="text-lg font-bold text-white mb-4 text-center">
            {title}
          </h2>
          <p className="text-white text-xs leading-relaxed text-center mb-6">
            {paragraph}
          </p>
          {venues[currentSlide]?.venueName && (
            <h3 className="font-semibold text-white mb-6 text-center">
              {venues[currentSlide].venueName}
            </h3>
          )}
          <div className="flex justify-center">
            <SlideNavigation
              onPrev={prevSlide}
              onNext={nextSlide}
              currentSlide={currentSlide}
              totalSlides={venues.length}
            />
          </div>
        </div>
      </div>

      {/* Desktop: Overlay layout */}
      <div className="hidden sm:block relative w-full h-full">
        {/* Imagen izquierda - ancho fijo */}
        <div
          className="absolute top-0 left-0 w-[65%] h-full transition-all duration-700"
          style={{
            backgroundImage: `url(${venues[currentSlide]?.mainPhoto})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Imagen derecha duplicada - 35% */}
        <div
          className="absolute top-0 right-0 w-[35%] h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url(${venues[currentSlide]?.mainPhoto})`,
            backgroundPosition: 'right bottom',
            backgroundSize: '100% 680px',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)'
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
    </div>
  );
};