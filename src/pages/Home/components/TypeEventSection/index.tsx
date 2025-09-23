import { CategoryCard } from '../CategoryCard'
import { data } from '@/constants/data';

const images = [
  "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg",
  "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg",
  "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg",
  "https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg",
]

export const TypeEventSection = () => {
  return (
    <div className="section-container">
      <h2 className="text-title">Tipos de Eventos</h2>
      <div className="section-grid">
        {data.tiposEvento.map((item, index) => (
          <CategoryCard key={item.idTipoEvento} title={item.nombreTipo} description={item.descripcion} imgUrl={images[index]} />
        ))}
      </div>
    </div>
  )
};