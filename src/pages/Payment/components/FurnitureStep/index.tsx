import { useState, useCallback, useEffect } from "react";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useFurniture } from "@/hooks/api";
import { TabNavigation } from './components/TabNavigation';
import { TablesSection } from './components/TablesSection';
import { ChairsSection } from './components/ChairsSection';
import { ServicesSection } from './components/ServicesSection';
import { SelectionSummary } from './components/SelectionSummary';

interface FurnitureStepProps {
  guestCount?: number;
}

const PEOPLE_PER_TABLE = 10;

export const FurnitureStep = ({ guestCount = 0 }: FurnitureStepProps) => {
  const { furniture, loading, error } = useFurniture();
  const {
    selectedFurniture,
    selectedModels,
    setSelectedFurniture,
    setSelectedModels
  } = usePaymentStore();

  const [editingFurniture, setEditingFurniture] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'tables' | 'chairs' | 'services'>('tables');

  const tableItems = furniture.filter(item =>
    item.furnitureName.toLowerCase().includes('mesa')
  );

  const chairItems = furniture.filter(item =>
    item.furnitureName.toLowerCase().includes('silla')
  );

  const serviceItems = furniture.filter(item =>
    !item.furnitureName.toLowerCase().includes('mesa') &&
    !item.furnitureName.toLowerCase().includes('silla') &&
    !item.furnitureName.toLowerCase().includes('servicios obligatorios')
  );

  const recommendedTables = Math.ceil(guestCount / PEOPLE_PER_TABLE);
  const totalSelectedItems = Object.values(selectedFurniture).reduce((a, b) => a + b, 0);

  const getRecommendationText = useCallback(() => {
    if (guestCount === 0) return "";
    const tables = recommendedTables;
    return `Recomendación: ${tables} ${tables === 1 ? 'mesa' : 'mesas'} para ${guestCount} personas (${PEOPLE_PER_TABLE} personas por mesa)`;
  }, [guestCount, recommendedTables]);

  const getMinQuantity = useCallback((furnitureId: number) => {
    const isTableItem = tableItems.some(item => item.furnitureId === furnitureId);
    const isChairItem = chairItems.some(item => item.furnitureId === furnitureId);

    if (isTableItem && recommendedTables > 0) {
      return recommendedTables;
    } else if (isChairItem && recommendedTables > 0) {
      return recommendedTables * 10;
    }
    return 0;
  }, [tableItems, chairItems, recommendedTables]);

  const handleModelSelection = (furnitureId: number, isTable: boolean) => {
    let newSelectedFurniture = { ...selectedFurniture };

    if (isTable) {
      if (selectedModels.selectedTableId && selectedModels.selectedTableId !== furnitureId) {
        delete newSelectedFurniture[selectedModels.selectedTableId];
      }

      if (recommendedTables > 0) {
        newSelectedFurniture[furnitureId] = recommendedTables;
      }

      setSelectedFurniture(newSelectedFurniture);
      setSelectedModels({ ...selectedModels, selectedTableId: furnitureId });
    } else {
      if (selectedModels.selectedChairId && selectedModels.selectedChairId !== furnitureId) {
        delete newSelectedFurniture[selectedModels.selectedChairId];
      }

      const recommendedChairs = recommendedTables * 10;
      if (recommendedChairs > 0) {
        newSelectedFurniture[furnitureId] = recommendedChairs;
      }

      setSelectedFurniture(newSelectedFurniture);
      setSelectedModels({ ...selectedModels, selectedChairId: furnitureId });
    }
  };

  const handleQuantityChange = (furnitureId: number, quantity: number) => {
    const isTableItem = tableItems.some(item => item.furnitureId === furnitureId);
    const isChairItem = chairItems.some(item => item.furnitureId === furnitureId);

    let minQuantity = 0;
    if (isTableItem && recommendedTables > 0) {
      minQuantity = recommendedTables;
    } else if (isChairItem && recommendedTables > 0) {
      minQuantity = recommendedTables * 10;
    }

    if (quantity < minQuantity) {
      quantity = minQuantity;
    }

    if (quantity === 0) {
      const newSelected = { ...selectedFurniture };
      delete newSelected[furnitureId];
      setSelectedFurniture(newSelected);

      if (selectedModels.selectedTableId === furnitureId) {
        setSelectedModels({ ...selectedModels, selectedTableId: null });
      }
      if (selectedModels.selectedChairId === furnitureId) {
        setSelectedModels({ ...selectedModels, selectedChairId: null });
      }
    } else {
      setSelectedFurniture({
        ...selectedFurniture,
        [furnitureId]: quantity
      });
    }
  };

  const handleEditClick = (furnitureId: number) => {
    setEditingFurniture(prev => ({
      ...prev,
      [furnitureId]: true
    }));
  };

  const handleBlur = useCallback((furnitureId: number) => {
    setEditingFurniture(prev => ({
      ...prev,
      [furnitureId]: false
    }));
  }, []);

  useEffect(() => {
    if (!furniture || furniture.length === 0) return;
    const mandatory = furniture.find(f => f.furnitureName.toLowerCase().includes('servicios obligatorios'));
    if (mandatory && !selectedFurniture[mandatory.furnitureId]) {
      setSelectedFurniture({ ...selectedFurniture, [mandatory.furnitureId]: 1 });
    }
  }, [furniture]);

  useEffect(() => {
    if (guestCount === 0) return;
    const newRecommendedTables = Math.ceil(guestCount / PEOPLE_PER_TABLE);
    const newRecommendedChairs = newRecommendedTables * 10;
    let newSelectedFurniture = { ...selectedFurniture };
    let hasChanges = false;
    if (selectedModels.selectedTableId && newSelectedFurniture[selectedModels.selectedTableId]) {
      newSelectedFurniture[selectedModels.selectedTableId] = newRecommendedTables;
      hasChanges = true;
    }
    if (selectedModels.selectedChairId && newSelectedFurniture[selectedModels.selectedChairId]) {
      newSelectedFurniture[selectedModels.selectedChairId] = newRecommendedChairs;
      hasChanges = true;
    }
    if (hasChanges) {
      setSelectedFurniture(newSelectedFurniture);
    }
  }, [guestCount, selectedModels.selectedTableId, selectedModels.selectedChairId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tables':
        return (
          <TablesSection
            tableItems={tableItems}
            selectedFurniture={selectedFurniture}
            selectedModels={selectedModels}
            editingFurniture={editingFurniture}
            recommendedTables={recommendedTables}
            guestCount={guestCount}
            onModelSelection={handleModelSelection}
            onQuantityChange={handleQuantityChange}
            onEditClick={handleEditClick}
            onBlur={handleBlur}
            getMinQuantity={getMinQuantity}
            getRecommendationText={getRecommendationText}
          />
        );
      case 'chairs':
        return (
          <ChairsSection
            chairItems={chairItems}
            selectedFurniture={selectedFurniture}
            selectedModels={selectedModels}
            editingFurniture={editingFurniture}
            recommendedTables={recommendedTables}
            guestCount={guestCount}
            onModelSelection={handleModelSelection}
            onQuantityChange={handleQuantityChange}
            onEditClick={handleEditClick}
            onBlur={handleBlur}
            getMinQuantity={getMinQuantity}
          />
        );
      case 'services':
        return (
          <ServicesSection
            serviceItems={serviceItems}
            selectedFurniture={selectedFurniture}
            selectedModels={selectedModels}
            editingFurniture={editingFurniture}
            guestCount={guestCount}
            onModelSelection={handleModelSelection}
            onQuantityChange={handleQuantityChange}
            onEditClick={handleEditClick}
            onBlur={handleBlur}
            getMinQuantity={getMinQuantity}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Mobiliarios</h2>
          <p className="text-xs text-gray-600">Cargando mobiliarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Mobiliarios</h2>
          <p className="text-xs text-red-600">Error al cargar mobiliarios: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-130 sm:h-100">
      <div>
        <h2 className="text-xl font-bold mb-2">Mobiliarios y Servicios</h2>
        <p className="text-xs text-gray-600">Selecciona el modelo de mesas y sillas para continuar. Puedes añadir servicios adicionales si lo deseas.</p>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableCount={tableItems.length}
        chairCount={chairItems.length}
        serviceCount={serviceItems.length}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <div className="sm:flex-1 overflow-hidden sm:min-h-65">
          {renderTabContent()}
        </div>

        <div className="sm:mt-auto">
          <SelectionSummary
            totalSelectedItems={totalSelectedItems}
            guestCount={guestCount}
            selectedModels={selectedModels}
            selectedFurniture={selectedFurniture}
          />
        </div>
      </div>
    </div>
  );
};