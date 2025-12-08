import { useEffect, memo, useState, useCallback } from "react";
import { SummaryForm } from "@/components/organism/SummaryForm";
import { usePaymentStore } from "@/store/usePaymentStore";
import type { Furniture } from "@/api/interfaces/furniture";
import locationIcon from "@/assets/icons/location_blue.svg";

interface PaymentFormProps {
    venueId: number;
    venueName: string;
    districtName: string;
    address: string;
    pricePerHour: number;
    maxCapacity: number;
    firstPhoto: string;
    furnitureList?: Furniture[];
    eventType: string;
    eventTypeName: string;
    availableEventTypes: string[];
    unavailableDates?: string[];
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
    eventHours: string;
    subtotalFromUrl: string;
    onFormDataChange?: (data: any) => void;
    onFormSubmit?: () => void;
}

const calculateDurationInHours = (initTime: string, endTime: string): number => {
    if (!initTime || !endTime) return 0;

    const [initHour, initMin] = initTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const initialTimeInMinutes = initHour * 60 + initMin;
    let endTimeInMinutes = endHour * 60 + endMin;
    if (endTimeInMinutes <= initialTimeInMinutes) {
        endTimeInMinutes += 24 * 60;
    }

    const timeDifference = endTimeInMinutes - initialTimeInMinutes;
    return Math.max(0, Math.ceil(timeDifference / 60));
};

export const PaymentForm = memo(({
    venueId,
    venueName,
    districtName: _districtName,
    address,
    pricePerHour,
    maxCapacity,
    firstPhoto,
    furnitureList = [],
    eventType,
    eventTypeName: _eventTypeName,
    availableEventTypes,
    date,
    quantity,
    initTime,
    endTime,
    eventHours: _eventHours,
    subtotalFromUrl: _subtotalFromUrl,
    onFormDataChange,
    onFormSubmit,
    unavailableDates = []
}: PaymentFormProps) => {

    const { selectedFurniture, setTotalAmount, removeFurniture, setSelectedFurniture } = usePaymentStore();
    const [totalHours, setTotalHours] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [formValues, setFormValues] = useState({ initTime, endTime });
    const [showMandatoryServices, setShowMandatoryServices] = useState(false);

    const mandatoryFurniture = furnitureList.find(f => 
        f.furnitureName.toLowerCase().includes('servicios obligatorios')
    );
    const mandatoryQty = mandatoryFurniture ? (selectedFurniture[mandatoryFurniture.furnitureId] || 0) : 0;
    const mandatoryServicesTotal = mandatoryFurniture ? (mandatoryFurniture.unitPrice * mandatoryQty) : 0;
    
    const furnitureItems = Object.entries(selectedFurniture)
        .map(([furnitureId, qty]) => {
            const furniture = furnitureList.find(f => f.furnitureId === parseInt(furnitureId));
            return {
                furnitureId: parseInt(furnitureId),
                furniture,
                qty,
                itemSubtotal: furniture ? furniture.unitPrice * qty : 0
            };
        })
        .filter(item => 
            item.furniture && 
            !(mandatoryFurniture && item.furnitureId === mandatoryFurniture.furnitureId)
        );

    const furnitureSubtotal = furnitureItems.reduce((total, item) => total + item.itemSubtotal, 0);
    const hasFurniture = furnitureItems.length > 0;

    const baseTotal = subtotal + furnitureSubtotal + mandatoryServicesTotal;
    const igv = baseTotal * 0.18;
    const finalTotal = baseTotal + igv;

    const handleFormChange = useCallback((updatedValues: any) => {
        setFormValues((prev) => {
            const newValues = {
                ...prev,
                initTime: updatedValues.initTime || prev.initTime,
                endTime: updatedValues.endTime || prev.endTime
            };
            
            if (newValues.initTime !== prev.initTime || newValues.endTime !== prev.endTime) {
                return newValues;
            }
            return prev;
        });
        
        onFormDataChange?.(updatedValues);
    }, [onFormDataChange]);

    const handleFormSubmit = useCallback(() => {
        onFormSubmit?.();
    }, [onFormSubmit]);

    useEffect(() => {
        if (!mandatoryFurniture) return;
        const id = mandatoryFurniture.furnitureId;
        
        if (!selectedFurniture[id] || selectedFurniture[id] === 0) {
            setSelectedFurniture({ ...selectedFurniture, [id]: 1 });
        }
    }, [mandatoryFurniture]);

    useEffect(() => {
        const hours = calculateDurationInHours(formValues.initTime, formValues.endTime);
        setTotalHours(hours);
        setSubtotal(hours * pricePerHour);
    }, [formValues.initTime, formValues.endTime, pricePerHour]);

    useEffect(() => {
        setTotalAmount(finalTotal);
    }, [finalTotal, setTotalAmount]);

    const mandatoryBreakdown = {
        limpieza: { name: "Limpieza", price: 300.00, description: "Antes y después del alquiler" },
        seguridad: { name: "Seguridad", price: 200.00, description: "Durante el evento y en estacionamiento" },
        serviciosBaño: { name: "Servicios de baño", price: 150.00, description: "Limpieza y reposición de papel, jabón, etc." },
        garantia: { name: "Garantía", price: 1000.00, description: "Reembolso si no hay daños" }
    };

    return (
        <div className="flex flex-col px-3 py-2">
            <h3 className="text-lg font-semibold mb-6">Detalles de tu reserva</h3>

            <div className="mb-5">
                {firstPhoto ? (
                    <img
                        src={firstPhoto}
                        alt={venueName}
                        className="w-full h-56 object-cover rounded-lg mb-4"
                    />
                ) : (
                    <div className="w-full h-56 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                    </div>
                )}
                <div className="flex flex-col">
                    <h4 className="text-lg font-bold">{venueName}</h4>
                    <div className="flex items-center gap-1">
                        <img src={locationIcon} alt="Ubicación" className="h-5" />
                        <p className="text-xs">{address}</p>
                    </div>
                </div>
            </div>

            <SummaryForm
                venueId={venueId}
                maxCapacity={maxCapacity}
                availableEventTypes={availableEventTypes}
                initialValues={{
                    eventType: eventType,
                    date: date,
                    quantity: quantity,
                    initTime: formValues.initTime,
                    endTime: formValues.endTime
                }}
                onFormChange={handleFormChange}
                onSubmit={handleFormSubmit}
                unavailableDates={unavailableDates}
            />

            <div className="pt-4 space-y-3 mt-2">
                <div className="flex justify-between mb-5">
                    <span className="text-sm">S/ {pricePerHour.toFixed(2)} x <span className="font-semibold">{totalHours} horas</span></span>
                    <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>

                {hasFurniture && (
                    <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-bold mb-2">Servicios adicionales</h4>
                        <div className="space-y-2 mb-3">
                            {furnitureItems.map(({ furnitureId, furniture, qty, itemSubtotal }) => {
                                const isMandatory = mandatoryFurniture && furnitureId === mandatoryFurniture.furnitureId;
                                return (
                                <div key={furnitureId} className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">{furniture!.furnitureName} x {qty}</p>
                                    </div>
                                    <span className="text-xs font-semibold shrink-0">S/ {itemSubtotal.toFixed(2)}</span>
                                    <button
                                        onClick={() => !isMandatory && removeFurniture(furnitureId)}
                                        className={`ml-2 text-sm ${isMandatory ? 'text-gray-400 cursor-not-allowed' : 'hover:text-red-700'} font-bold shrink-0`}
                                        disabled={isMandatory}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )})}
                        </div>
                    </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold">Servicios obligatorios</h4>
                        <button
                            onClick={() => setShowMandatoryServices(!showMandatoryServices)}
                            className="text-xs font-medium hover:underline"
                        >
                            {showMandatoryServices ? '▼ Ocultar' : '▶ Ver detalles'}
                        </button>
                    </div>
                    
                    {showMandatoryServices && (
                        <div className="space-y-2 mb-3">
                            {Object.entries(mandatoryBreakdown).map(([key, service]) => (
                                <div key={key} className="bg-gray-50 p-2 rounded">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium">{service.name}</p>
                                            <p className="text-xs text-gray-600">{service.description}</p>
                                        </div>
                                        <span className="text-xs font-semibold shrink-0">S/ {service.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                        <span className="text-xs">Total servicios obligatorios</span>
                        <span className="text-xs font-semibold">S/ {mandatoryServicesTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-6 border-t-2 border-blue space-y-3">
                    <div className="flex justify-between items-center font-bold text-xs">
                        <span>IGV (18%)</span>
                        <span>S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-md">
                        <span>Total estimado</span>
                        <span>S/ {finalTotal.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
});