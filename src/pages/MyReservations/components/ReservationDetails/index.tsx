import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReservationDetails } from "@/hooks/api";
import { Button } from "@/components/atomic/Button";
import { generateReservationPdf } from "@/utils/pdf/generateReservationPdf";
import { ReservationHeader } from "./components/ReservationHeader";
import { EventDetailsCard } from "./components/EventDetailsCard";
import { FurnitureSection } from "./components/FurnitureSection";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { CostBreakdownCard } from "./components/CostBreakdownCard";

/**
 * Detailed view of a single reservation
 * Shows complete information including venue, costs, furniture, and customer data
 */
export const ReservationDetails = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { reservation, loading, error, refetch } = useReservationDetails(
    parseInt(reservationId || "0")
  );

  useEffect(() => {
    if (reservationId) {
      refetch();
    }
  }, [reservationId, refetch]);

  const handleDownloadPdf = async () => {
    if (!reservation) return;

    try {
      // Transform reservation data to match the format expected by generateReservationPdf
      const reservationDetails = {
        fullName: reservation.customerName,
        email: reservation.customerEmail,
        venueName: reservation.venueName,
        eventType: reservation.eventTypeName,
        district: reservation.venueDistrict,
        address: reservation.venueAddress,
        date: new Date(reservation.eventDate).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        initTime: reservation.startTime,
        endTime: reservation.endTime,
        totalHours: reservation.costBreakdown.totalHours,
        guestCount: reservation.guestCount,
        venueSubtotal: reservation.costBreakdown.venueCost,
        totalAmount: reservation.costBreakdown.totalCost,
      };

      // Transform furniture items to selectedFurniture format (id: quantity)
      const selectedFurniture: Record<string, number> = {};
      const furnitureList: any[] = [];
      
      reservation.furnitureItems?.forEach((item, index) => {
        const fakeId = index + 1000; // Generate unique IDs
        selectedFurniture[fakeId] = item.quantity;
        furnitureList.push({
          furnitureId: fakeId,
          furnitureName: item.furnitureName,
          unitPrice: item.unitPrice,
        });
      });

      // Get payment info if available
      const paymentMethod = reservation.paymentInfo?.payments?.[0] 
        ? { name: reservation.paymentInfo.payments[0].paymentMethod }
        : undefined;
      
      const approvalCode = reservation.paymentInfo?.payments?.[0]?.confirmationCode || reservation.confirmationCode;

      await generateReservationPdf({
        reservationDetails,
        paymentMethod,
        selectedFurniture,
        furnitureList,
        approvalCode,
        includePaymentDetails: false,
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("No fue posible generar el PDF. Intenta nuevamente.");
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
            onClick={() => navigate("/reservas")}
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
    <div className="min-h-screen px-8 py-8 sm:py-12 sm:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/reservas")}
          className="flex mt-4 sm:mt-0 items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm mb-8 sm:mb-6"
        >
          <span>←</span>
          <span>Volver a Mis Reservas</span>
        </button>

        {/* Header */}
        <ReservationHeader
          venueName={reservation.venueName}
          eventTypeName={reservation.eventTypeName}
          status={reservation.status}
        />

        {/* Confirmation Code */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600">Código de Confirmación</p>
          <p className="text-2xl font-bold text-blue">{reservation.confirmationCode}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-8">
              <EventDetailsCard
                eventDate={reservation.eventDate}
                startTime={reservation.startTime}
                endTime={reservation.endTime}
                duration={reservation.duration}
                guestCount={reservation.guestCount}
                venueDistrict={reservation.venueDistrict}
                venueAddress={reservation.venueAddress}
              />
              {reservation.furnitureItems && reservation.furnitureItems.length > 0 && (
                <FurnitureSection furnitureItems={reservation.furnitureItems} />
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-7">
            <CustomerInfoCard
              customerName={reservation.customerName}
              customerPhone={reservation.customerPhone}
              customerEmail={reservation.customerEmail}
            />
            <CostBreakdownCard
              costBreakdown={reservation.costBreakdown}
              furnitureItems={reservation.furnitureItems}
            />
            <Button
              text="Descargar Comprobante"
              onClick={handleDownloadPdf}
              variant="primary"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};
