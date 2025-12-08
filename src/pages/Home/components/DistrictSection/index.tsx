import { ScrollableSection } from '@/components/molecules/ScrollableSection';
import { CategoryCard } from '../CategoryCard'
import { useDistrictCards } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '@/store/useFilterStore';

export const DistrictSection = () => {
  const navigate = useNavigate();
  const { setFilters, clearFilters } = useFilterStore();
  const { districtCards, loading, error } = useDistrictCards();

  const handleDistrictClick = (districtId: number) => {
    clearFilters();
    
    setFilters({
      districtId: districtId,
      eventTypeId: null,
      minCapacity: null,
      maxCapacity: null,
      priceRange: null,
    });

    navigate("/catalogo");
  };

  if (loading) {
    return (
      <div className="section-container">
        <h2 className="text-title">Descubre las zonas</h2>
        <p className="text-center text-gray-500 py-8">Cargando distritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <h2 className="text-title">Descubre las zonas</h2>
        <p className="text-center text-red-500 py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="section-container slide-in-bottom">
      <h2 className="text-title fade-in-up">Descubre las zonas</h2>
      <ScrollableSection>
        {districtCards.map((district, index) => (
          <div key={district.districtId} className={`flex-shrink-0 fade-in-left stagger-${Math.min(index + 1, 5)}`}>
            <CategoryCard
              title={district.districtName}
              imgUrl={district.photoUrl}
              onClick={() => handleDistrictClick(district.districtId)}
            />
          </div>
        ))}
      </ScrollableSection>
    </div>
  );
};