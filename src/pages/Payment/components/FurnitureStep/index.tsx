import { useState, useEffect, useRef } from "react";
import { data } from "@/constants/data";

interface SelectedFurniture {
  [key: number]: number;
}

interface EditingFurniture {
  [key: number]: boolean;
}

interface FurnitureStepProps {
  onFurnitureSelectionChange?: (selected: SelectedFurniture) => void;
  selectedFurnitureItems?: SelectedFurniture;
}

export const FurnitureStep = ({ onFurnitureSelectionChange, selectedFurnitureItems = {} }: FurnitureStepProps) => {
  const [selectedFurniture, setSelectedFurniture] = useState<SelectedFurniture>(selectedFurnitureItems);
  const [editingFurniture, setEditingFurniture] = useState<EditingFurniture>({});
  
  useEffect(() => {
    setSelectedFurniture(selectedFurnitureItems);
  }, [selectedFurnitureItems]);

  useEffect(() => {
    onFurnitureSelectionChange?.(selectedFurniture);
  }, [selectedFurniture, onFurnitureSelectionChange]);

  const handleQuantityChange = (furnitureId: number, quantity: number) => {
    if (quantity < 0) return;

    if (quantity === 0) {
      const newSelected = { ...selectedFurniture };
      delete newSelected[furnitureId];
      setSelectedFurniture(newSelected);
    } else {
      setSelectedFurniture(prev => ({
        ...prev,
        [furnitureId]: quantity
      }));
    }
  };

  const handleEditClick = (furnitureId: number) => {
    setEditingFurniture(prev => ({
      ...prev,
      [furnitureId]: true
    }));
  };

  const handleInputChange = (furnitureId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    handleQuantityChange(furnitureId, Math.max(0, numValue));
  };

  const handleBlur = (furnitureId: number) => {
    setEditingFurniture(prev => ({
      ...prev,
      [furnitureId]: false
    }));
  };

  const totalSelectedItems = Object.values(selectedFurniture).reduce((a, b) => a + b, 0);
  const furnitureList = data.mobiliario;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Mobiliarios</h2>
        <p className="text-xs text-gray-600">Servicio adicional de mobiliarios.</p>
      </div>

      <div className="overflow-y-auto max-h-64 pr-4">
        <div className="flex flex-col gap-2">
          {furnitureList.map((furniture) => (
            <div
              key={furniture.idMobiliario}
              className="flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <img
                src={furniture.urlFoto}
                alt={furniture.nombre}
                className="w-18 h-18 object-cover rounded-lg shrink-0 bg-gray-100"
              />

              <div className="flex-1 min-w-0 ml-4">
                <h3 className="text-sm font-bold truncate">
                  {furniture.nombre}
                </h3>
                <p className="text-xs mt-1">
                  S/ {furniture.precioUnitario.toFixed(2)} por unidad
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {furniture.descripcion}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 mr-2">
                <button
                  onClick={() => handleQuantityChange(
                    furniture.idMobiliario,
                    (selectedFurniture[furniture.idMobiliario] || 0) - 1
                  )}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white bg-blue font-bold hover:bg-blue/80"
                >
                  -
                </button>

                {editingFurniture[furniture.idMobiliario] ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={selectedFurniture[furniture.idMobiliario] || 0}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        handleInputChange(furniture.idMobiliario, value);
                      }
                    }}
                    onBlur={() => handleBlur(furniture.idMobiliario)}
                    autoFocus
                    className="w-12 text-center text-md border rounded-lg py-1 focus:outline-none focus:border-bgray"
                  />
                ) : (
                  <span
                    onClick={() => handleEditClick(furniture.idMobiliario)}
                    className="w-12 text-center text-md font-semibold cursor-pointer hover:bg-gray-100 rounded px-1 py-1"
                  >
                    {selectedFurniture[furniture.idMobiliario] || 0}
                  </span>
                )}

                <button
                  onClick={() => handleQuantityChange(
                    furniture.idMobiliario,
                    (selectedFurniture[furniture.idMobiliario] || 0) + 1
                  )}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white bg-blue font-bold hover:bg-blue/80"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs">
          Items seleccionados: <span className="font-bold">
            {totalSelectedItems}
          </span>
        </p>
      </div>
    </div>
  );
};