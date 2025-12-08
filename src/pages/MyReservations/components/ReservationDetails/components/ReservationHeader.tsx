interface ReservationHeaderProps {
  venueName: string;
  eventTypeName: string;
  status: string;
}

export const ReservationHeader = ({ venueName, eventTypeName, status }: ReservationHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
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

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">{venueName}</h1>
          <p className="text-gray-600 mt-2">{eventTypeName}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(status)}`}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
};
