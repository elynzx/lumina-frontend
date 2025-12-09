import type { Reservation } from '@/api/interfaces/admin';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
};

interface ReservationDetailModalProps {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (reservationId: number, newStatus: ReservationStatus) => void;
  onViewReceipt: (receiptUrl: string) => void;
}

export const ReservationDetailModal = ({
  reservation,
  onClose,
  onStatusChange,
  onViewReceipt
}: ReservationDetailModalProps) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const formatCurrency = (amount: number) => {
    return `S/ ${amount.toFixed(2)}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-12 max-w-4xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Detalle de Reserva #{reservation.reservationId}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Creada el {formatDate(reservation.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusConfig[reservation.status as ReservationStatus].color}`}>
              {statusConfig[reservation.status as ReservationStatus].label}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            {/* Columna Izquierda: Detalles de la Reserva */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                Detalles de la Reserva
              </h3>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Local</h4>
                <p className="text-base font-semibold text-gray-900">{reservation.venueName}</p>
                <p className="text-sm text-gray-600">{reservation.venueAddress}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Evento</h4>
                <p className="text-base text-gray-900">{reservation.eventTypeName}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Fecha del Evento</h4>
                <p className="text-base text-gray-900">{formatDate(reservation.reservationDate)}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Horario</h4>
                <p className="text-base text-gray-900">
                  {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Cantidad de Invitados</h4>
                <p className="text-base text-gray-900">{reservation.guestCount} personas</p>
              </div>
                            {/* Información del Cliente */}
              <div>
                <h3 className="text-lg mt-8 font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                  Información del Cliente
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</h4>
                    <p className="text-base font-semibold text-gray-900">{reservation.customerName}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</h4>
                    <p className="text-sm text-gray-900">{reservation.customerEmail}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono</h4>
                    <p className="text-sm text-gray-900">{reservation.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>

            </div>
          </div>

          {/* Columna Derecha: Cliente, Costos y Estado */}
          <div className="space-y-4">

            {/* Monto Total */}
            <div className="bg-admin-primary text-white rounded-lg px-5 py-8">
              <h3 className="text-sm font-semibold uppercase mb-6">Detalle de Pago</h3>

              {/* Desglose */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-blue-100">Costo del Local:</span>
                  <span className="font-semibold">{formatCurrency(reservation.venueCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Mobiliario/Servicios:</span>
                  <span className="font-semibold">{formatCurrency(reservation.furnitureCost)}</span>
                </div>
              </div>

              {/* Subtotal sin IGV */}
              <div className="pt-3 border-t border-blue-400">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-100">Subtotal (sin IGV):</span>
                  <span className="font-semibold">{formatCurrency(reservation.venueCost + reservation.furnitureCost)}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-blue-100">IGV (18%):</span>
                  <span className="font-semibold">{formatCurrency((reservation.venueCost + reservation.furnitureCost) * 0.18)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-5 border-t-2 border-blue-300">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Total a Pagar:</span>
                  <span className="text-2xl font-bold">{formatCurrency(reservation.totalCost)}</span>
                </div>
              </div>
            </div>
            {/* Método de Pago, Comprobante y Estado */}
            {reservation.paymentMethodName && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                  Pago y Estado
                </h3>
                <div className="space-y-4">
                  {/* Método de Pago */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Método de Pago</h4>
                    <p className="text-base font-semibold text-gray-900">{reservation.paymentMethodName}</p>
                  </div>

                  {/* Comprobante */}
                  {reservation.paymentReceiptUrl && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Comprobante</h4>
                      <button
                        onClick={() => onViewReceipt(reservation.paymentReceiptUrl!)}
                        className="flex items-center gap-2 px-4 py-3 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition font-medium text-sm w-full justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Ver Comprobante
                      </button>
                    </div>
                  )}

                  {/* Estado */}
                  {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Estado de Reserva</h4>
                      <select
                        value={reservation.status}
                        onChange={(e) => onStatusChange(reservation.reservationId, e.target.value as ReservationStatus)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-admin-primary bg-white text-sm font-semibold"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONFIRMED">Confirmada</option>
                        <option value="CANCELLED">Cancelada</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Mobiliario y Servicios */}
        {reservation.furnitureItems && reservation.furnitureItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Mobiliario y Servicios</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-2">Artículo</th>
                    <th className="pb-2 text-center">Cantidad</th>
                    <th className="pb-2 text-right">Precio Unit.</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {reservation.furnitureItems.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{item.furnitureName}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Botón de Cierre */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-12 py-3 border bg-admin-primary text-white border-gray-300 rounded-lg hover:bg-admin-primary-dark transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
