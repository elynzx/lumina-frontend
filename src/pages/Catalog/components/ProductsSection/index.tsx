import { useNavigate } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { data, type Local } from "@/constants/data";

const getLocalImage = (venueId: number) => {
  const venuePhotosList = data.fotosLocales.filter(_ => _.idLocal === venueId);
  return venuePhotosList[0]?.urlFoto || '';
}

const getDistrict = (districtId: number) => {
  return data.distritos.find(_ => _.idDistrito === districtId)?.nombreDistrito || '';
}

interface ProductsSectionProps {
  locales: Local[];
}

export const ProductsSection = ({ locales }: ProductsSectionProps) => {
  const navigate = useNavigate();

    const handleReserveClick = (localeId: number) => {
    navigate(`/producto/${localeId}`);
  };

  if (locales.length === 0) {
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
      {locales.map((item) => (
        <ProductCard
          key={item.idLocal}
          imgUrl={getLocalImage(item.idLocal)}
          title={item.nombreLocal}
          district={getDistrict(item.idDistrito)}
          address={item.direccion}
          capacity={item.aforoMaximo}
          pricePerHour={item.precioHora}
          buttonText="Reservar"
          onClickAction={() => handleReserveClick(item.idLocal)}  
        />
      ))}
    </div>
  );
};