import { SummaryForm } from "@/components/organism/SummaryForm";
import type { Local } from "@/constants/data";
import { data } from "@/constants/data";
import locationIcon from "@/assets/icons/location_blue.svg";
import { useEffect } from "react";

interface PaymentFormProps {
    venueData: Local;
    firstPhoto: string;
    selectedFurniture?: { [key: number]: number };
    onRemoveFurniture?: (furnitureId: number) => void;
    eventType: string;
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
    eventHours: string;
    onTotalAmountChange?: (amount: number) => void;
    onFormSubmit?: () => void;
}

export const PaymentForm = ({
    venueData,
    firstPhoto,
    selectedFurniture = {},
    onRemoveFurniture,
    eventType,
    date,
    quantity,
    initTime,
    endTime,
    eventHours,
    onTotalAmountChange,
    onFormSubmit
}: PaymentFormProps) => {

    const district = data.distritos.find(d => d.idDistrito === venueData.idDistrito)?.nombreDistrito || '';
    const venueHourPrice = parseFloat(venueData.precioHora.toString());
    const eventHoursNumber = parseInt(eventHours);
    const venueSubtotal = venueHourPrice * eventHoursNumber;

    const eventTypeId = data.tiposEvento.find(te => te.nombreTipo === eventType)?.idTipoEvento.toString() || "";

    const furnitureSubtotal = Object.entries(selectedFurniture).reduce((total, [furnitureId, qty]) => {
        const furniture = data.mobiliario.find(m => m.idMobiliario === parseInt(furnitureId));
        return total + (furniture ? furniture.precioUnitario * qty : 0);
    }, 0);

    const totalEstimate = venueSubtotal + furnitureSubtotal;

    useEffect(() => {
        onTotalAmountChange?.(totalEstimate);
    }, [totalEstimate, onTotalAmountChange]);

    const handleFormSubmit = () => {
        onFormSubmit?.();
    };

    const hasFurniture = Object.keys(selectedFurniture).length > 0;
    const furnitureItems = Object.entries(selectedFurniture).map(([furnitureId, qty]) => {
        const furniture = data.mobiliario.find(m => m.idMobiliario === parseInt(furnitureId));
        return {
            furnitureId: parseInt(furnitureId),
            furniture,
            qty,
            itemSubtotal: furniture ? furniture.precioUnitario * qty : 0
        };
    }).filter(item => item.furniture);

    return (
        <div className="flex flex-col p-12">
            <h3 className="text-lg font-semibold mb-6">Detalles de tu reserva</h3>

            <div className="mb-5">
                <img
                    src={firstPhoto}
                    alt={venueData.nombreLocal}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <div className="flex flex-col">
                    <h4 className="text-lg font-bold">{venueData.nombreLocal}</h4>
                    <div className="flex items-center gap-1">
                        <img src={locationIcon} alt="Ubicación" className="h-5" />
                        <p className="text-xs">{district}, {venueData.direccion}</p>
                    </div>
                </div>
            </div>

            <SummaryForm
                venueId={venueData.idLocal}
                initialValues={{
                    eventType: eventTypeId,
                    date,
                    quantity,
                    initTime,
                    endTime
                }}
                onSubmit={handleFormSubmit}
            />

            <div className="pt-4 space-y-3 mt-6">
                <div className="flex justify-between mb-5">
                    <span className="text-sm">S/ {venueHourPrice.toFixed(2)} x <span className="font-semibold">{eventHours} horas</span></span>
                    <span className="font-semibold">S/ {venueSubtotal.toFixed(2)}</span>
                </div>

                {hasFurniture && (
                    <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-bold mb-2">Servicios adicionales</h4>
                        <div className="space-y-2 mb-3">
                            {furnitureItems.map(({ furnitureId, furniture, qty, itemSubtotal }) => (
                                <div key={furnitureId} className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">{furniture!.nombre} x {qty}</p>
                                    </div>
                                    <span className="text-xs font-semibold shrink-0">S/ {itemSubtotal.toFixed(2)}</span>
                                    <button
                                        onClick={() => onRemoveFurniture?.(furnitureId)}
                                        className="ml-2 text-sm hover:text-red-700 font-bold shrink-0"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t border-blue pt-3 flex justify-between items-center font-bold text-md">
                    <span>Total estimado</span>
                    <span>S/ {totalEstimate.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};