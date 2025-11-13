import { ScrollableSection } from '@/components/molecules/ScrollableSection';
import { CategoryCard } from '../CategoryCard'
import { useDistrictCards } from '@/hooks/api';

export const DistrictSection = () => {
  const { districtCards, loading, error } = useDistrictCards();

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
    <div className="section-container">
      <h2 className="text-title">Descubre las zonas</h2>
      <ScrollableSection>
        {districtCards.map((district) => (
          <div key={district.districtId} className="flex-shrink-0">
            <CategoryCard
              title={district.districtName}
              imgUrl={district.photoUrl}
            />
          </div>
        ))}
      </ScrollableSection>
    </div>
  )
};