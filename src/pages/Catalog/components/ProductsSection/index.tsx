import { FilterBar } from "../FilterBar";
import { ProductCard } from "../ProductCard";
import { data } from "@/constants/data";

const getLocalImage = (localId: number) => {
  const fotosLocal = data.fotosLocales.filter(_ => _.idLocal === localId);
  return fotosLocal[0]?.urlFoto || '';
}

const getDistrict = (idDistrito: number) => {
  return data.distritos.find(_ => _.idDistrito === idDistrito)?.nombreDistrito || '';
}

export const ProductsSection = () => {
  return (
    <div className="section-container">
      <h2 className="text-title">Los mejores locales</h2>
      <FilterBar />
      <div className="section-grid">
        {data.locales.map((item) => (
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
    </div>
  )
};