import { FurnitureCard } from "./FurnitureCard";

interface FurnitureData {
  furnitureId: number;
  furnitureName: string;
  description: string;
  unitPrice: number;
  photoUrl?: string;
  totalStock?: number;
}

interface TablesSectionProps {
  tableItems: FurnitureData[];
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
  getRecommendationText: () => string;
}

export const TablesSection = ({
  tableItems,
  selectedFurniture,
  selectedModels,
  editingFurniture,
  recommendedTables,
  onModelSelection,
  onQuantityChange,
  onEditClick,
  onBlur,
  getMinQuantity,
}: TablesSectionProps) => {
  if (tableItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay mesas disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mt-2 mb-4">
        <div className="flex flex-col gap-2">
          {tableItems.map((item) => (
            <FurnitureCard
              key={item.furnitureId}
              item={item}
              selectedFurniture={selectedFurniture}
              selectedModels={selectedModels}
              editingFurniture={editingFurniture}
              isSelected={selectedModels.selectedTableId === item.furnitureId}
              isTable={true}
              onModelSelection={() => onModelSelection(item.furnitureId, true)}
              onQuantityChange={onQuantityChange}
              onEditClick={onEditClick}
              onBlur={onBlur}
              getMinQuantity={getMinQuantity}
              recommendedQuantity={recommendedTables}
              capacityText="Capacidad para 10 personas"
            />
          ))}
        </div>
      </div>
    </div>
  );
};