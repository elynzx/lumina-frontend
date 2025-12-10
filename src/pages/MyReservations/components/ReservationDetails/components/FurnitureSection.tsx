import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FurnitureItemDetail } from "@/api/interfaces/reservation";

interface FurnitureSectionProps {
  furnitureItems: FurnitureItemDetail[];
}

const mandatoryServices = {
  limpieza: { name: "Limpieza", price: 300.00, description: "Antes y después del alquiler" },
  seguridad: { name: "Seguridad", price: 200.00, description: "Durante el evento y en estacionamiento" },
  serviciosBaño: { name: "Servicios de baño", price: 150.00, description: "Limpieza y reposición de papel, jabón, etc." },
  garantia: { name: "Garantía", price: 1000.00, description: "Reembolso si no hay daños" }
};

export const FurnitureSection = ({ furnitureItems }: FurnitureSectionProps) => {
  const [expandedSections, setExpandedSections] = useState<{
    tables: boolean;
    additional: boolean;
    mandatory: boolean;
  }>({
    tables: true,
    additional: true,
    mandatory: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tablesAndChairs = furnitureItems.filter(item =>
    item.furnitureName.toLowerCase().includes('mesa') ||
    item.furnitureName.toLowerCase().includes('silla')
  );

  const additionalServices = furnitureItems.filter(item =>
    !item.furnitureName.toLowerCase().includes('mesa') &&
    !item.furnitureName.toLowerCase().includes('silla') &&
    !item.furnitureName.toLowerCase().includes('obligatorio')
  );

  const mandatoryItems = furnitureItems.filter(item =>
    item.furnitureName.toLowerCase().includes('obligatorio')
  );

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-4">Detalle de lo Contratado</h2>
      <div className="space-y-3">
        {/* Mesas y Sillas */}
        {tablesAndChairs.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('tables')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-base font-bold text-gray-900">Mobiliarios</h3>
              {expandedSections.tables ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.tables && (
              <div className="sm:p-4 bg-white space-y-3">
                {tablesAndChairs.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {item.photoUrl && (
                        <img
                          src={item.photoUrl}
                          alt={item.furnitureName}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="font-bold text-sm text-gray-900">{item.furnitureName}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.quantity} unidad(es) × S/ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold sm:text-base text-blue">S/ {item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Servicios Adicionales */}
        {additionalServices.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('additional')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-base font-bold text-gray-900">Servicios Adicionales</h3>
              {expandedSections.additional ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.additional && (
              <div className="sm:p-4 bg-white space-y-3">
                {additionalServices.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{item.furnitureName}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.quantity} servicio(s) × S/ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold sm:text-base text-blue">S/ {item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Servicios Obligatorios */}
        {mandatoryItems.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('mandatory')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-base font-bold text-gray-900">Servicios Obligatorios</h3>
              {expandedSections.mandatory ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.mandatory && (
              <div className="py-4 sm:p-4 bg-white space-y-6 sm:space-y-3">
                {Object.entries(mandatoryServices).map(([key, service]) => (
                  <div key={key} className="px-4 sm:p-3 sm:bg-blue-50 sm:border sm:border-blue-100 sm:rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <span className="sm:text-base font-bold text-blue ml-3">
                        S/ {service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
