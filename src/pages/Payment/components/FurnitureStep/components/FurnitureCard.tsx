interface FurnitureData {
  furnitureId: number;
  furnitureName: string;
  description: string;
  unitPrice: number;
  photoUrl?: string;
  totalStock?: number;
}

interface FurnitureCardProps {
  item: FurnitureData;
  selectedFurniture: { [key: number]: number };
  selectedModels: { selectedTableId: number | null; selectedChairId: number | null };
  editingFurniture: { [key: number]: boolean };
  isSelected: boolean;
  isTable: boolean;
  onModelSelection: () => void;
  onQuantityChange: (furnitureId: number, quantity: number) => void;
  onEditClick: (furnitureId: number) => void;
  onBlur: (furnitureId: number) => void;
  getMinQuantity: (furnitureId: number) => number;
  recommendedQuantity: number;
  capacityText: string;
  isService?: boolean;
  guestCount?: number;
}

export const FurnitureCard = ({
  item,
  selectedFurniture,
  editingFurniture,
  isSelected,
  isTable,
  onModelSelection,
  onQuantityChange,
  onEditClick,
  onBlur,
  getMinQuantity,
  recommendedQuantity,
  capacityText,
  isService = false,
  guestCount = 0
}: FurnitureCardProps) => {

  const isCatering = isService && item.furnitureName.toLowerCase().includes('catering');

  const getServiceQuantity = () => {
    if (!isService) return selectedFurniture[item.furnitureId] || 0;
    return isCatering ? guestCount : 1;
  };

  const handleQuantityIncrease = () => {
    if (isService) {
      if (!isSelected) {
        const quantity = getServiceQuantity();
        onQuantityChange(item.furnitureId, quantity);
      }
    } else {
      if (!isSelected) {
        onModelSelection();
      } else {
        onQuantityChange(item.furnitureId, (selectedFurniture[item.furnitureId] || 0) + 1);
      }
    }
  };

  const handleQuantityDecrease = () => {
    if (isService) {
      onQuantityChange(item.furnitureId, 0);
    } else {
      const minQty = getMinQuantity(item.furnitureId);
      const currentQty = selectedFurniture[item.furnitureId] || 0;
      const newQty = Math.max(minQty, currentQty - 1);
      onQuantityChange(item.furnitureId, newQty);
    }
  };

  const handleInputChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value) || 0;
      const minQty = getMinQuantity(item.furnitureId);
      onQuantityChange(item.furnitureId, Math.max(minQty, numValue));
    }
  };

  return (
    <div className={`flex items-center gap-4 px-4 py-3 border-b border-bgray hover:shadow-sm transition-shadow`}>

      {isService ? (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            if (isSelected) {
              onQuantityChange(item.furnitureId, 0);
            } else {
              const quantity = getServiceQuantity();
              onQuantityChange(item.furnitureId, quantity);
            }
          }}
          className="w-5 h-5 ml-4 mr-4 text-blue bg-gray-100 border-gray-300 focus:ring-blue cursor-pointer"
        />
      ) : (
        <input
          type="radio"
          name={isTable ? "selectedTable" : "selectedChair"}
          checked={isSelected}
          onChange={onModelSelection}
          className=" w-5 h-5 ml-4 mr-4 text-blue bg-gray-100 border-gray-300 focus:ring-blue cursor-pointer"
        />
      )}
      
      <img
        src={item.photoUrl}
        alt={item.furnitureName}
        className="w-22 h-22 object-cover rounded-lg shrink-0 bg-gray-100"
      />

      <div className="flex-1 min-w-0 ml-4">
        <h3 className="text-sm font-bold truncate">
          {item.furnitureName}
        </h3>
        <p className="text-xs mt-1">
          S/ {item.unitPrice.toFixed(2)} {
            isService 
              ? (isCatering ? 'por persona' : 'por servicio')
              : 'por unidad'
          }
        </p>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {capacityText}
        </p>
      </div>

      {isService ? (
        <div className="flex items-center gap-2 shrink-0 mr-4">
          <span className="w-12 text-center text-xs font-semibold">
            {isSelected ? (isCatering ? `${guestCount} personas` : '') : ''}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0 mr-2">
          <button
            onClick={handleQuantityDecrease}
            disabled={!isSelected || (selectedFurniture[item.furnitureId] || 0) <= getMinQuantity(item.furnitureId)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white bg-blue font-bold hover:bg-blue/80 disabled:bg-gray-300"
          >
            -
          </button>

          {editingFurniture[item.furnitureId] ? (
            <input
              type="text"
              inputMode="numeric"
              value={selectedFurniture[item.furnitureId] || 0}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={() => onBlur(item.furnitureId)}
              autoFocus
              className="w-12 text-center text-md border rounded-lg py-1 focus:outline-none focus:border-bgray"
            />
          ) : (
            <span
              onClick={() => isSelected && onEditClick(item.furnitureId)}
              className={`w-12 text-center text-md font-semibold rounded px-1 py-1 ${
                isSelected 
                  ? 'cursor-pointer hover:bg-gray-100' 
                  : 'cursor-not-allowed text-gray-400'
              }`}
            >
              {selectedFurniture[item.furnitureId] || 0}
            </span>
          )}

          <button
            onClick={handleQuantityIncrease}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white bg-blue font-bold hover:bg-blue/80"
            title={!isSelected ? `Seleccionar y agregar ${recommendedQuantity} ${isTable ? 'mesas' : 'sillas'}` : `Agregar ${isTable ? 'mesa' : 'silla'}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};