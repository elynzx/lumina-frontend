import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerService } from "@/api/services/customerService";
import { Button } from "@/components/atomic/Button";
import { Calendar, Clock, Users, MapPin, DollarSign } from "lucide-react";

interface ReservationDetail {
  reservationId: number;
  confirmationCode: string;
  status: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  guestCount: number;
  eventTypeName: string;
  venueName: string;
  venueAddress: string;
  venueDistrict: string;
  venuePhotos: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  costBreakdown: {
    totalHours: number;
    venueHourlyRate: number;
    venueCost: number;
    furnitureCost: number;
    subtotal: number;
    taxes: number;
    totalCost: number;
  };
  furnitureItems: Array<{
    furnitureName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    photoUrl: string;
  }>;
}

export const ReservationDetails = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const customerService = useCustomerService();
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        setLoading(true);
        const data = await customerService.getReservationDetails(
          parseInt(reservationId || "0")
        );
        setReservation(data as unknown as ReservationDetail);
      } catch (err) {
        console.error("Error al cargar detalles de reserva:", err);
        setError("No se pudieron cargar los detalles de la reserva");
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservationDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-lineal py-12 px-24 flex items-center justify-center">
        <p className="text-gray-600">Cargando detalles de la reserva...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen  py-12 px-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/reservations")}
            className="flex items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm mb-4"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error || "Reserva no encontrada"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bgray py-12 px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/reservations")}
            className="flex items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm mb-4"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {reservation.venueName}
              </h1>
              <p className="text-gray-600 mt-2">{reservation.eventTypeName}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                reservation.status
              )}`}
            >
              {getStatusLabel(reservation.status)}
            </span>
          </div>
        </div>

        {/* Confirmation Code */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600">Código de Confirmación</p>
          <p className="text-2xl font-bold text-blue">{reservation.confirmationCode}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Left Column - Event Details */}
          <div className="col-span-2 space-y-6">
            {/* Venue Photo */}
            {reservation.venuePhotos && reservation.venuePhotos.length > 0 && (
              <div className="rounded-lg overflow-hidden shadow-sm">
                <img
                  src={reservation.venuePhotos[0]}
                  alt={reservation.venueName}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Evento</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(reservation.eventDate).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Hora</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reservation.startTime} - {reservation.endTime}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{reservation.duration}</p>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-blue mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Personas</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reservation.guestCount} personas
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reservation.venueDistrict}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{reservation.venueAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Furniture Items */}
            {reservation.furnitureItems && reservation.furnitureItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mobiliario</h2>
                <div className="space-y-4">
                  {reservation.furnitureItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex items-center gap-4 flex-1">
                        {item.photoUrl && (
                          <img
                            src={item.photoUrl}
                            alt={item.furnitureName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.furnitureName}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity} x S/ {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">S/ {item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Datos del Cliente</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Nombre</p>
                  <p className="font-semibold text-gray-900">{reservation.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{reservation.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Teléfono</p>
                  <p className="font-semibold text-gray-900">{reservation.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Desglose de Costos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Local ({reservation.costBreakdown.totalHours}h)</span>
                  <span className="font-semibold">S/ {reservation.costBreakdown.venueCost.toFixed(2)}</span>
                </div>
                {reservation.costBreakdown.furnitureCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mobiliario</span>
                    <span className="font-semibold">S/ {reservation.costBreakdown.furnitureCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-blue">S/ {reservation.costBreakdown.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button
              text="Descargar Comprobante"
              onClick={() => window.print()}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
