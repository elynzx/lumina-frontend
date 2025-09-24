import { FilterBar } from "../FilterBar";
import { ProductCard } from "../ProductCard";


export const ProductsSection = () => {
  return (
    <div className="section-container">
      <h2 className="text-title">Los mejores locales</h2>
      <FilterBar />
      <div className="section-grid">
        <ProductCard imgUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          title="Local en Miraflores"
          district="Miraflores"
          address="Av. Larco 123, Miraflores"
          capacity={10}
          pricePerHour={100}
          buttonText="Reservar"
          onClickAction={() => alert('Reservar')}
        />

      </div>
    </div>
  )
};