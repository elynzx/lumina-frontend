import { PhotosLayout } from "./components/PhotosLayout";
import starIcon from "@/assets/icons/Star_gold.svg";
import locationIcon from "@/assets/icons/location.svg";
import sshhIcon from "@/assets/icons/sshh.svg";
import capacityIcon from "@/assets/icons/capacity_blue.svg";
import wifiIcon from "@/assets/icons/wifi.svg";
import { BudgetForm } from "./components/BudgetForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCustomerService } from "@/api/services/customerService";
import type { VenueDetail } from "@/api/interfaces/venue";

export const ProductDetail = () => {

    const { id } = useParams<{ id: string }>();
    const venueId = parseInt(id || "1");
    const customerService = useCustomerService();
    const [venueData, setVenueData] = useState<VenueDetail | null>(null);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                setLoading(true);
                const venue = await customerService.getVenueById(venueId);
                setVenueData(venue);
            } catch (err) {
                console.error('Error al cargar el local:', err);
                setError('No se pudo cargar la información del local');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [venueId]);

    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const dates = await customerService.getUnavailableDates(venueId);
                console.log('Fechas no disponibles cargadas:', dates);
                setUnavailableDates(dates);
            } catch (err) {
                console.error('Error al cargar fechas no disponibles:', err);
                // No mostrar error, solo dejar vacío
                setUnavailableDates([]);
            }
        };

        fetchUnavailableDates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [venueId]);

    if (loading) {
        return <div className="p-8 text-center">Cargando información del local...</div>;
    }

    if (error || !venueData) {
        return <div className="p-8 text-center text-red-600">{error || 'Local no encontrado.'}</div>;
    }

    const venuePhotos = venueData.photos || [];

    return (
        <div className="flex flex-col px-16 py-6 gap-8 justify-center items-center">

            <PhotosLayout imgUrls={venuePhotos} description="Local para eventos" />

            <div className="w-full max-w-6xl flex gap-10">

                <div className="flex-1 flex flex-col gap-6">

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">{venueData.venueName}</h1>
                            <div className="flex items-center gap-2">
                                <img src={locationIcon} alt="ubicación" className="w-5 h-5" />
                                <span>{venueData.districtName},</span> {venueData.address}
                            </div>
                            <div className="flex items-center gap-1">
                                <img src={starIcon} alt="star" className="w-5 h-5" />
                                <p>4.8<span className="text-gray-600 text-sm"> (128 reseñas)</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center flex-col p-3">
                                <img src={capacityIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">Máx. {venueData.maxCapacity}</span>
                                <span className="text-xs">personas</span>
                            </div>
                            <div className="flex items-center flex-col p-3">
                                <img src={sshhIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">Baños</span>
                            </div>
                            <div className="flex items-center flex-col p-3">
                                <img src={wifiIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">WiFi</span>
                            </div>
                        </div>
                    </div>
                    <p className="leading-relaxed text-sm">{venueData.fullDescription}</p>
                    
                    {/* Mapa de ubicación - Se muestra si existe googleMapsUrl o coordenadas */}
                    {(venueData.googleMapsUrl || (venueData.latitude && venueData.longitude)) && (
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-3">📍 Ubicación</h3>
                            <iframe
                                className="w-full h-96 rounded-lg border border-gray-200"
                                src={venueData.googleMapsUrl || `https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=${venueData.latitude},${venueData.longitude}`}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación del local"
                            ></iframe>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-[38%] flex flex-col gap-6 sticky top-20">
                    <BudgetForm 
                        venueId={venueId} 
                        pricePerHour={venueData.pricePerHour} 
                        maxCapacity={venueData.maxCapacity}
                        availableEventTypes={venueData.availableEventTypes}
                        unavailableDates={unavailableDates}
                    />
                </div>

            </div>
        </div>
    )
};