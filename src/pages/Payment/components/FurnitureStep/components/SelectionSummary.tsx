interface SelectionSummaryProps {
  totalSelectedItems: number;
  guestCount: number;
  selectedModels: { selectedTableId: number | null; selectedChairId: number | null };
  selectedFurniture: { [key: number]: number };
}

export const SelectionSummary = ({
  guestCount,
  selectedModels,
  selectedFurniture
}: SelectionSummaryProps) => {
  const hasSelectedTable = selectedModels.selectedTableId && selectedFurniture[selectedModels.selectedTableId] > 0;
  const hasSelectedChair = selectedModels.selectedChairId && selectedFurniture[selectedModels.selectedChairId] > 0;

  return (
    <div className="pt-4 px-6">
      <p className="text-xs font-semibold">
        Items obligatorios:
      </p>
      {guestCount > 0 && (
        <div className="mt-2 text-xs">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1 ${hasSelectedTable ? 'text-green-600' : 'text-red-500'}`}>
              <span>{hasSelectedTable ? '✓' : '✗'}</span>
              <span>Mesas seleccionadas</span>
            </div>
            <div className={`flex items-center gap-1 ${hasSelectedChair ? 'text-green-600' : 'text-red-500'}`}>
              <span>{hasSelectedChair ? '✓' : '✗'}</span>
              <span>Sillas seleccionadas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};