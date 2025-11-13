import { VenuePreviewCard } from '../VenuePreviewCard'
import { Button } from "@/components/atomic/Button";
import { useVenues } from "@/hooks/api";
import { useNavigate } from 'react-router-dom';

export const VenuePreviewSection = () => {
  const navigate = useNavigate();
  const { venues, loading, error } = useVenues();

  const handleViewAllVenues = () => {
    navigate('/catalogo');
  };

  if (loading) {
    return (
      <div className="section-container">
        <h2 className="text-title">Conoce nuestros locales</h2>
        <p className="text-center text-gray-500 py-8">Cargando locales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <h2 className="text-title">Conoce nuestros locales</h2>
        <p className="text-center text-red-500 py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="section-container">
      <h2 className="text-title">Conoce nuestros locales</h2>
      <div className="section-grid mt-4 mb-6">
        {venues.slice(0, 4).map((venue) => (
          <VenuePreviewCard
            key={venue.venueId}
            idLocal={venue.venueId}
            title={venue.venueName}
            district={venue.districtName}
            details={venue.description}
            imgUrl={venue.mainPhotoUrl}
          />
        ))}
      </div>
      <Button text="Ver todos los locales" onClick={handleViewAllVenues} />
      <div className="flex flex-col gap-5 mt-4 text-center text-xs text-gray-500">
        <p>*Los precios y disponibilidad pueden variar. Consulta con el local para más detalles.</p>
        <p>**Imágenes referenciales. Los locales pueden diferir en apariencia y características.</p>
      </div>
    </div>
  )
};