import { FurnitureCard } from "./FurnitureCard";  

interface FurnitureData {
  furnitureId: number;
  furnitureName: string;
  description: string;
  unitPrice: number;
  photoUrl?: string;
  totalStock?: number;
}

interface ChairsSectionProps {
  chairItems: FurnitureData[];
  selectedFurniture: { [key: number]: number };
  selectedModels: { selectedTableId: number | null; selectedChairId: number | null };
  editingFurniture: { [key: number]: boolean };
  recommendedTables: number;
  guestCount: number;
  onModelSelection: (furnitureId: number, isTable: boolean) => void;
  onQuantityChange: (furnitureId: number, quantity: number) => void;
  onEditClick: (furnitureId: number) => void;
  onBlur: (furnitureId: number) => void;
  getMinQuantity: (furnitureId: number) => number;
}

export const ChairsSection = ({
  chairItems,
  selectedFurniture,
  selectedModels,
  editingFurniture,
  recommendedTables,
  onModelSelection,
  onQuantityChange,
  onEditClick,
  onBlur,
  getMinQuantity
}: ChairsSectionProps) => {
  if (chairItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay sillas disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mt-2 mb-4">
        <div className="flex flex-col gap-2">
          {chairItems.map((item) => (
            <FurnitureCard
              key={item.furnitureId}
              item={item}
              selectedFurniture={selectedFurniture}
              selectedModels={selectedModels}
              editingFurniture={editingFurniture}
              isSelected={selectedModels.selectedChairId === item.furnitureId}
              isTable={false}
              onModelSelection={() => onModelSelection(item.furnitureId, false)}
              onQuantityChange={onQuantityChange}
              onEditClick={onEditClick}
              onBlur={onBlur}
              getMinQuantity={getMinQuantity}
              recommendedQuantity={recommendedTables * 10}
              capacityText={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};