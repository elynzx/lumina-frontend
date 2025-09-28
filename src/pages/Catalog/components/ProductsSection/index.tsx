import { ProductCard } from "../ProductCard";
import { data } from "@/constants/data";

const getLocalImage = (localId: number) => {
  const fotosLocal = data.fotosLocales.filter(_ => _.idLocal === localId);
  return fotosLocal[0]?.urlFoto || '';
}

const getDistrict = (idDistrito: number) => {
  return data.distritos.find(_ => _.idDistrito === idDistrito)?.nombreDistrito || '';
}

interface Props {
  locales: any[];
}

export const ProductsSection = ({ locales }: Props) => {
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
            onClickAction={() => alert('Reservar')}
          />
        ))}
      </div>
  );
};