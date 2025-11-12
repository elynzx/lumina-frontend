import { VenuePreviewCard } from '../VenuePreviewCard'
import { Button } from "@/components/atomic/Button";
import { data } from "@/constants/data";
import { useNavigate } from 'react-router-dom';

const getLocalImage = (localId: number) => {
  const fotosLocal = data.fotosLocales.filter(_ => _.idLocal === localId);
  return fotosLocal[0]?.urlFoto || '';
}

const getDistrict = (idDistrito: number) => {
  return data.distritos.find(_ => _.idDistrito === idDistrito)?.nombreDistrito || '';
}

export const VenuePreviewSection = () => {

  const navigate = useNavigate();
  const handleViewAllVenues = () => {
    navigate('/catalogo');
  };
  return (
    <div className="section-container">
      <h2 className="text-title">Conoce nuestros locales</h2>
      <div className="section-grid mt-4 mb-6">
        {data.locales.map((local) => (
          <VenuePreviewCard
            key={local.idLocal}
            idLocal={local.idLocal}
            title={local.nombreLocal}
            district={getDistrict(local.idDistrito)}
            details={local.descripcion}
            imgUrl={getLocalImage(local.idLocal)}
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