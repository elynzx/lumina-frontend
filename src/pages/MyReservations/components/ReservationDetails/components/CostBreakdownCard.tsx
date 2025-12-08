import type { FurnitureItemDetail } from "@/api/interfaces/reservation";

interface CostBreakdownCardProps {
  costBreakdown: {
    venueHourlyRate: number;
    totalHours: number;
    venueCost: number;
    totalCost: number;
  };
  furnitureItems?: FurnitureItemDetail[];
}

export const CostBreakdownCard = ({ costBreakdown, furnitureItems }: CostBreakdownCardProps) => {
  const tablesAndChairs = furnitureItems?.filter(item =>
    item.furnitureName.toLowerCase().includes('mesa') ||
    item.furnitureName.toLowerCase().includes('silla')
  ) || [];
  
  const additionalServices = furnitureItems?.filter(item =>
    !item.furnitureName.toLowerCase().includes('mesa') &&
    !item.furnitureName.toLowerCase().includes('silla') &&
    !item.furnitureName.toLowerCase().includes('obligatorio')
  ) || [];
  
  const mandatoryServices = furnitureItems?.filter(item =>
    item.furnitureName.toLowerCase().includes('obligatorio')
  ) || [];

  const tablesTotal = tablesAndChairs.reduce((sum, item) => sum + item.subtotal, 0);
  const additionalTotal = additionalServices.reduce((sum, item) => sum + item.subtotal, 0);
  const mandatoryTotal = mandatoryServices.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">Desglose de Costos</h3>
      <div className="space-y-3">
        {/* Venue Cost */}
        <div className="pb-3 border-b border-gray-200">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Tarifa por hora</span>
            <span className="font-semibold">S/ {costBreakdown.venueHourlyRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Local ({costBreakdown.totalHours}h)</span>
            <span className="font-semibold">S/ {costBreakdown.venueCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Furniture by Category */}
        {tablesTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Mobiliarios</span>
            <span className="font-semibold">S/ {tablesTotal.toFixed(2)}</span>
          </div>
        )}
        {additionalTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Servicios Adicionales</span>
            <span className="font-semibold">S/ {additionalTotal.toFixed(2)}</span>
          </div>
        )}
        {mandatoryTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Servicios Obligatorios</span>
            <span className="font-semibold">S/ {mandatoryTotal.toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal (sin IGV) */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal (sin IGV)</span>
            <span className="font-semibold">S/ {(costBreakdown.totalCost / 1.18).toFixed(2)}</span>
          </div>
        </div>

        {/* IGV */}
        <div className="flex justify-between">
          <span className="text-gray-600">IGV (18%)</span>
          <span className="font-semibold">
            S/ {(costBreakdown.totalCost - (costBreakdown.totalCost / 1.18)).toFixed(2)}
          </span>
        </div>

        {/* Total */}
        <div className="pt-3 border-t-2 border-blue">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue text-md">S/ {costBreakdown.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
