import { CategoryCard } from '../CategoryCard'

export const DistrictSection = () => {
  return (
    <div className="section-container">
      <h2 className="text-title">Distritos</h2>
      <div className="section-grid">
        <CategoryCard title="Título" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
        <CategoryCard title="Título" description="Descripción" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
        <CategoryCard title="Título" description="Descripción" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
        <CategoryCard title="Título" description="Descripción" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
      </div>
    </div>
  )
};