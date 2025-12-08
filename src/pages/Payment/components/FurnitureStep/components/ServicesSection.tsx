import { FurnitureCard } from "./FurnitureCard";  

interface FurnitureData {
  furnitureId: number;
  furnitureName: string;
  description: string;
  unitPrice: number;
  photoUrl?: string;
  totalStock?: number;
}

interface ServicesSectionProps {
  serviceItems: FurnitureData[];
  selectedFurniture: { [key: number]: number };
  selectedModels: { selectedTableId: number | null; selectedChairId: number | null };
  editingFurniture: { [key: number]: boolean };
  guestCount: number;
  onModelSelection: (furnitureId: number, isTable: boolean) => void;
  onQuantityChange: (furnitureId: number, quantity: number) => void;
  onEditClick: (furnitureId: number) => void;
  onBlur: (furnitureId: number) => void;
  getMinQuantity: (furnitureId: number) => number;
}

export const ServicesSection = ({
  serviceItems,
  selectedFurniture,
  selectedModels,
  editingFurniture,
  guestCount,
  onModelSelection,
  onQuantityChange,
  onEditClick,
  onBlur,
  getMinQuantity
}: ServicesSectionProps) => {
  if (serviceItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay servicios disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mt-2 mb-4">
        <div className="flex flex-col gap-2">
          {serviceItems.map((item) => {
            const isSelected = selectedFurniture[item.furnitureId] > 0;
            
            return (
              <FurnitureCard
                key={item.furnitureId}
                item={item}
                selectedFurniture={selectedFurniture}
                selectedModels={selectedModels}
                editingFurniture={editingFurniture}
                isSelected={isSelected}
                isTable={false}
                onModelSelection={() => onModelSelection(item.furnitureId, false)}
                onQuantityChange={onQuantityChange}
                onEditClick={onEditClick}
                onBlur={onBlur}
                getMinQuantity={getMinQuantity}
                recommendedQuantity={0}
                capacityText={item.description}
                isService={true}
                guestCount={guestCount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};