import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerService } from "@/api/services/customerService";
import { Button } from "@/components/atomic/Button";
import { Calendar, Users, Clock } from "lucide-react";

interface Reservation {
  reservationId: number;
  venueName: string;
  eventTypeName: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  totalCost: number;
  status: string;
}

export const Reservations = () => {
  const navigate = useNavigate();
  const customerService = useCustomerService();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await customerService.getMyReservations();
        setReservations(data as unknown as Reservation[]);
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        setError("No se pudieron cargar las reservas");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleViewDetails = (reservationId: number) => {
    navigate(`/reservations/${reservationId}`);
  };

  return (
    <div className="min-h-screen bg-light-bgray py-12 px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm mb-4"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">Visualiza y gestiona todas tus reservas</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando reservas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">No tienes reservas aún</p>
            <Button
              text="Explorar Locales"
              onClick={() => navigate("/catalogo")}
              variant="tertiary"
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.reservationId}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Venue and Event Type */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {reservation.venueName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {reservation.eventTypeName}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-blue" />
                        <div>
                          <p className="text-xs text-gray-500">Fecha</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(reservation.reservationDate).toLocaleDateString(
                              "es-PE",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-blue" />
                        <div>
                          <p className="text-xs text-gray-500">Hora</p>
                          <p className="text-sm font-medium text-gray-900">
                            {reservation.startTime} - {reservation.endTime}
                          </p>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue" />
                        <div>
                          <p className="text-xs text-gray-500">Personas</p>
                          <p className="text-sm font-medium text-gray-900">
                            {reservation.guestCount}
                          </p>
                        </div>
                      </div>

                      {/* Cost */}
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-bold text-blue">
                          S/ {reservation.totalCost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusLabel(reservation.status)}
                    </span>
                    <Button
                      text="Ver Detalles"
                      onClick={() => handleViewDetails(reservation.reservationId)}
                      variant="tertiary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
