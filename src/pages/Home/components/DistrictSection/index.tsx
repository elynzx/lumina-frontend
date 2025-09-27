import { ScrollableSection } from '@/components/molecules/ScrollableSection';
import { CategoryCard } from '../CategoryCard'
import { data } from '@/constants/data';

const getDistrictImage = (id: number) => {
  const local = data.locales.find(_ => _.idDistrito === id);
  const fotosLocal = data.fotosLocales.filter(_ => _.idLocal === local?.idLocal);
  return fotosLocal[0]?.urlFoto || '';
};

export const DistrictSection = () => {
  return (
    <div className="section-container">
      <h2 className="text-title">Descubre las zonas</h2>
      <ScrollableSection>
        {data.distritos.map((item) => (
          <div key={item.idDistrito} className="flex-shrink-0">
            <CategoryCard
              title={item.nombreDistrito}
              imgUrl={getDistrictImage(item.idDistrito)}
            />
          </div>
        ))}
      </ScrollableSection>
      {/*       <div className="section-grid">
        {data.distritos.map((item) => (
          <CategoryCard key={item.idDistrito} title={item.nombreDistrito} imgUrl={getDistrictImage(item.idDistrito)} />
        ))}
      </div> */}
    </div>
  )
};