import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyReservations } from "@/hooks/api";
import { Button } from "@/components/atomic/Button";
import { ReservationCard } from "./components/ReservationCard";

/**
 * Customer reservations list view
 * Displays all user's reservations with status and details
 */
export const MyReservations = () => {
  const navigate = useNavigate();
  const { reservations, loading, error, refetch } = useMyReservations();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleViewDetails = (reservationId: number) => {
    navigate(`/reservations/${reservationId}`);
  };

  return (
    <div className="min-h-screen py-12 px-24">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-title">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">Visualiza y gestiona todas tus reservas</p>
        </div>

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
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
