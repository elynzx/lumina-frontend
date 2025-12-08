import { ScrollableSection } from '@/components/molecules/ScrollableSection';
import { CategoryCard } from '../CategoryCard'
import { useEventTypes } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '@/store/useFilterStore';

// Imágenes por defecto hasta que se agregue photoUrl al backend
const DEFAULT_IMAGES: Record<string, string> = {
  'Boda': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'Cumpleaños': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
  'Corporativo': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  'Quinceañera': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
  'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
};


const getEventImage = (photoUrl: string | undefined, eventTypeName: string): string => {
  return photoUrl && photoUrl.trim() !== '' ? photoUrl : DEFAULT_IMAGES[eventTypeName] || DEFAULT_IMAGES.default;
}

export const TypeEventSection = () => {
  const navigate = useNavigate();
  const { setFilters, clearFilters } = useFilterStore();
  const { eventTypes, loading, error } = useEventTypes();

  const handleEventTypeClick = (eventTypeId: number) => {
    // Limpiar filtros previos
    clearFilters();
    
    // Establecer filtro por tipo de evento
    setFilters({
      eventTypeId: eventTypeId,
      districtId: null,
      minCapacity: null,
      maxCapacity: null,
      priceRange: null,
    });

    // Navegar al catálogo
    navigate("/catalogo");
  };

  if (loading) {
    return (
      <div className="section-container">
        <h2 className="text-title">Tipos de Eventos</h2>
        <p className="text-center text-gray-500 py-8">Cargando tipos de evento...</p>
      </div>
    );
  }

  if (error || eventTypes.length === 0) {
    return null; // No mostramos la sección si hay error
  }

  return (
    <div className="section-container slide-in-bottom">
      <h2 className="text-title fade-in-up">Tipos de Eventos</h2>
      <ScrollableSection>
        {eventTypes.map((eventType, index) => (
          <div key={eventType.eventTypeId} className={`flex-shrink-0 fade-in-right stagger-${Math.min(index + 1, 5)}`}>
            <CategoryCard
              title={eventType.eventTypeName}
              description={eventType.description}
              imgUrl={getEventImage(eventType.photoUrl, eventType.eventTypeName)}
              onClick={() => handleEventTypeClick(eventType.eventTypeId)}
            />
          </div>
        ))}
      </ScrollableSection>
    </div>
  );
};