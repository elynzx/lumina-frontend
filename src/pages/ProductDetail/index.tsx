import { PhotosLayout } from "./components/PhotosLayout";
import starIcon from "@/assets/icons/Star_gold.svg";
import locationIcon from "@/assets/icons/location.svg";
import sshhIcon from "@/assets/icons/sshh.svg";
import capacityIcon from "@/assets/icons/capacity_blue.svg";
import wifiIcon from "@/assets/icons/wifi.svg";
import { BudgetForm } from "./components/BudgetForm";
import { useParams } from "react-router-dom";
import { useVenueDetail, useUnavailableDates } from "@/hooks/api";

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const venueId = parseInt(id || "1");

    // Usar hooks personalizados para obtener datos
    const { venue, loading: venueLoading, error: venueError } = useVenueDetail(venueId);
    const { unavailableDates, loading: datesLoading, error: datesError } = useUnavailableDates(venueId);

    if (venueLoading || datesLoading) {
        return <div className="p-8 text-center">Cargando información del local...</div>;
    }

    if (venueError || datesError || !venue) {
        return <div className="p-8 text-center text-red-600">{venueError || datesError || "Local no encontrado."}</div>;
    }

    const venuePhotos = venue.photos || [];

    return (
        <div className="flex flex-col px-16 py-6 gap-8 justify-center items-center">
            <PhotosLayout imgUrls={venuePhotos} description="Local para eventos" />

            <div className="w-full max-w-6xl flex gap-10">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">{venue.venueName}</h1>
                            <div className="flex items-center gap-2">
                                <img src={locationIcon} alt="ubicación" className="w-5 h-5" />
                                {venue.address}
                            </div>
                            <div className="flex items-center gap-1">
                                <img src={starIcon} alt="star" className="w-5 h-5" />
                                <p>4.8<span className="text-gray-600 text-sm"> (128 reseñas)</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center flex-col p-3">
                                <img src={capacityIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">Máx. {venue.maxCapacity}</span>
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
                    <p className="leading-relaxed text-sm">{venue.fullDescription}</p>

                    {/* Mapa de ubicación - Se muestra si existe googleMapsUrl o coordenadas */}
                    {(venue.googleMapsUrl || (venue.latitude && venue.longitude)) && (
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-3">📍 Ubicación</h3>
                            <iframe
                                className="w-full h-96 rounded-lg border border-gray-200"
                                src={venue.googleMapsUrl || `https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=${venue.latitude},${venue.longitude}`}
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
                        pricePerHour={venue.pricePerHour}
                        maxCapacity={venue.maxCapacity}
                        availableEventTypes={venue.availableEventTypes}
                        unavailableDates={unavailableDates}
                    />
                </div>
            </div>
        </div>
    );
};