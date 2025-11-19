import { useEffect, memo, useState } from "react";
import { SummaryForm } from "@/components/organism/SummaryForm";
import type { Furniture } from "@/api/interfaces/furniture";
import locationIcon from "@/assets/icons/location_blue.svg";

interface PaymentFormProps {
    venueId: number;
    venueName: string;
    address: string;
    pricePerHour: number;
    firstPhoto: string;
    selectedFurniture?: { [key: number]: number };
    furnitureList?: Furniture[];
    onRemoveFurniture?: (furnitureId: number) => void;
    eventType: string; // eventTypeId como string
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
    eventHours: string;
    subtotalFromUrl: string;
    onTotalAmountChange?: (amount: number) => void;
    onFormSubmit?: () => void;
}

const calculateDurationInHours = (initTime: string, endTime: string): number => {
    if (!initTime || !endTime) return 0;

    const [initHour, initMin] = initTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const initialTimeInMinutes = initHour * 60 + initMin;
    const endTimeInMinutes = endHour * 60 + endMin;

    const timeDifference = endTimeInMinutes - initialTimeInMinutes;
    return Math.max(0, Math.ceil(timeDifference / 60));
};

export const PaymentForm = memo(({
    venueId,
    venueName,
    address,
    pricePerHour,
    firstPhoto,
    selectedFurniture = {},
    furnitureList = [],
    onRemoveFurniture,
    eventType,
    date,
    quantity,
    initTime,
    endTime,
    eventHours,
    subtotalFromUrl,
    onTotalAmountChange,
    onFormSubmit
}: PaymentFormProps) => {
    const [totalHours, setTotalHours] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [formValues, setFormValues] = useState({ initTime, endTime });

    const handleFormChange = (updatedValues: Partial<PaymentFormProps>) => {
        setFormValues((prev) => {
            const newValues = { ...prev, ...updatedValues };
            if (
                newValues.initTime === prev.initTime &&
                newValues.endTime === prev.endTime
            ) {
                return prev; // Evitar actualizaciones innecesarias
            }
            return newValues;
        });
    };

    const venueSubtotal = parseFloat(subtotalFromUrl);
    const furnitureSubtotal = Object.entries(selectedFurniture).reduce((total, [furnitureId, qty]) => {
        const furniture = furnitureList.find(f => f.furnitureId === parseInt(furnitureId));
        return total + (furniture ? furniture.unitPrice * qty : 0);
    }, 0);

    const totalEstimate = venueSubtotal + furnitureSubtotal;

    useEffect(() => {
        const hours = calculateDurationInHours(formValues.initTime, formValues.endTime);
        setTotalHours(hours);
        setSubtotal(hours * pricePerHour);
    }, [formValues.initTime, formValues.endTime, pricePerHour]);

    useEffect(() => {
        onTotalAmountChange?.(subtotal);
    }, [subtotal, onTotalAmountChange]);

    useEffect(() => {
        onTotalAmountChange?.(totalEstimate);
    }, [totalEstimate, onTotalAmountChange]);

    useEffect(() => {
        const hours = parseInt(eventHours) || 0;
        const updatedVenueSubtotal = pricePerHour * hours;
        const updatedTotalEstimate = updatedVenueSubtotal + furnitureSubtotal;

        onTotalAmountChange?.(updatedTotalEstimate);
    }, [eventHours, pricePerHour, furnitureSubtotal, onTotalAmountChange]);

    const handleFormSubmit = () => {
        onFormSubmit?.();
    };

    const hasFurniture = Object.keys(selectedFurniture).length > 0;

    const furnitureItems = Object.entries(selectedFurniture).map(([furnitureId, qty]) => {
        const furniture = furnitureList.find(f => f.furnitureId === parseInt(furnitureId));
        return {
            furnitureId: parseInt(furnitureId),
            furniture,
            qty,
            itemSubtotal: furniture ? furniture.unitPrice * qty : 0
        };
    }).filter(item => item.furniture);

    console.log('PaymentForm renderizado');

    return (
        <div className="flex flex-col p-12">
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
                initialValues={{
                    eventType: eventType,
                    date: date,
                    quantity: quantity,
                    initTime: formValues.initTime,
                    endTime: formValues.endTime
                }}
                onFormChange={handleFormChange}
                onSubmit={handleFormSubmit}
            />

            <div className="pt-4 space-y-3 mt-6">
                <div className="flex justify-between mb-5">
                    <span className="text-sm">S/ {pricePerHour.toFixed(2)} x <span className="font-semibold">{totalHours} horas</span></span>
                    <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>

                {hasFurniture && (
                    <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-bold mb-2">Servicios adicionales</h4>
                        <div className="space-y-2 mb-3">
                            {furnitureItems.map(({ furnitureId, furniture, qty, itemSubtotal }) => (
                                <div key={furnitureId} className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">{furniture!.furnitureName} x {qty}</p>
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
});