import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface EventDetailsCardProps {
  eventDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  guestCount: number;
  venueDistrict: string;
  venueAddress: string;
}

export const EventDetailsCard = ({
  eventDate,
  startTime,
  endTime,
  duration,
  guestCount,
  venueDistrict,
  venueAddress,
}: EventDetailsCardProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Detalles de Reserva</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar size={20} className="text-blue mt-1" />
          <div>
            <p className="text-gray-600">Fecha</p>
            <p className="font-semibold">
              {new Date(eventDate).toLocaleDateString("es-PE", {
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
            <p className="text-gray-600">Hora</p>
            <p className="font-semibold">
              {startTime} - {endTime}
            </p>
            <p className="text-gray-500 mt-1">{duration}</p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-start gap-3">
          <Users size={20} className="text-blue mt-1" />
          <div>
            <p className="text-gray-600">Personas</p>
            <p className="font-semibold">{guestCount} personas</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-blue mt-1" />
          <div>
            <p className="text-gray-600">Ubicación</p>
            <p className="font-semibold">{venueDistrict}</p>
            <p className="text-xs text-gray-500 mt-1">{venueAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
