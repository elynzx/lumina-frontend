import { useState } from "react";
import { data } from "@/constants/data";

import { PopularVenueOverlay } from "./PopularVenueOverlay";
import { SlideNavigation } from "@/pages/Home/components/PopularVenuesSection/SlideNavigation";


const title = "Los salones más reservados";
const paragraph = "Descubre los espacios favoritos de nuestros usuarios. Estos locales destacan por su calidad, ubicación y servicios excepcionales que garantizan el éxito de tu evento.";

const getPopularVenues = () => {
  return data.locales.slice(0, 5).map(local => {
    const foto = data.fotosLocales.find(foto => foto.idLocal === local.idLocal);
    return {
      id: local.idLocal,
      name: local.nombreLocal,
      imageUrl: foto?.urlFoto || ''
    };
  });
};

export const PopularVenuesSection = () => {
  const venues = getPopularVenues();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % venues.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + venues.length) % venues.length);
  };

  return (
    <div className="relative w-full h-[620px] overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${venues[currentSlide]?.imageUrl})`
        }}
      />

      {/* Overlay con contenido */}
      <PopularVenueOverlay
        title={title}
        description={paragraph}
        currentItemTitle={venues[currentSlide]?.name}
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