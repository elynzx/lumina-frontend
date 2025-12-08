import { Button } from "@/components/atomic/Button";
import { Calendar, Users, Clock } from "lucide-react";
import { DetailItem } from "./DetailItem";

interface ReservationCardProps {
  reservation: {
    reservationId: number;
    venueName: string;
    eventTypeName: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    totalCost: number;
    status: string;
  };
  onViewDetails: (reservationId: number) => void;
}

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

export const ReservationCard = ({ reservation, onViewDetails }: ReservationCardProps) => {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-lg shadow-sm px-6 py-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">

          <div className="mb-4">
            <h3 className="text-xl font-bold">
              {reservation.venueName}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {reservation.eventTypeName}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">

            <DetailItem
              label="Fecha"
              value={new Date(reservation.reservationDate).toLocaleDateString(
                "es-PE",
                { year: "numeric", month: "long", day: "numeric" }
              )}
              IconComponent={Calendar}
            />

            <DetailItem
              label="Hora"
              value={`${reservation.startTime} - ${reservation.endTime}`}
              IconComponent={Clock}
            />

            <DetailItem
              label="Personas"
              value={reservation.guestCount}
              IconComponent={Users}
            />

            <DetailItem
              label="Total"
              value={`S/ ${reservation.totalCost.toFixed(2)}`}
              isBold={true}
            />

            
          </div>
        </div>

        {/* Status and Action */}
        <div className="flex flex-col items-end gap-5 ml-4 mt-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              reservation.status
            )}`}
          >
            {getStatusLabel(reservation.status)}
          </span>
          <Button
            text="Ver Detalles"
            onClick={() => onViewDetails(reservation.reservationId)}
            variant="tertiary"
          />
        </div>
      </div>
    </div>
  );
};
