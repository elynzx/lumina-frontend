import { Button } from "@/components/atomic/Button";
import checkIcon from "@/assets/icons/check_circle.svg";
import { MapPin, Calendar, Clock, Users, Mail, CreditCard, AlertCircle, Clock3, CircleCheckBig } from "lucide-react";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  details: string;
}

interface ConfirmationStepProps {
  approvalCode: string;
  paymentMethod: PaymentMethod | null;
  reservationDetails: {
    venueName: string;
    eventType: string;
    district: string;
    address: string;
    date: string;
    initTime: string;
    endTime: string;
    totalHours: string;
    fullName: string;
    email: string;
    totalAmount: number;
  };
}

export const ConfirmationStep = ({
  approvalCode,
  paymentMethod,
  reservationDetails
}: ConfirmationStepProps) => {

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";

    if (dateStr.includes("/")) {
      return dateStr;
    }

    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (isNaN(date.getTime())) {
      return dateStr;
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    return date.toLocaleDateString('es-ES', options);
  };

  const isDeferredPayment = paymentMethod?.id === 2 || paymentMethod?.id === 3;

  return (
    <div className="flex flex-col items-center gap-4 py-8 w-full max-w-2xl mx-auto">

      <div className="flex flex-col items-center text-center">
        <CircleCheckBig size={48} className="text-yellow2 mb-3" />
        <h2 className="text-xl font-bold mb-2">
          {paymentMethod?.id === 1
            ? "¡Pago confirmado!"
            : "¡Reserva registrada!"}
        </h2>
        <p className="text-gray-600 text-sm">
          {paymentMethod?.id === 1
            ? "Tu pago ha sido procesado y tu reserva está confirmada"
            : paymentMethod?.id === 2
              ? "Tu reserva está registrada. Completaré la confirmación después de verificar tu transferencia bancaria"
              : "Tu reserva está registrada. Se confirmará automáticamente cuando realices el pago con tu código CIP"}
        </p>
      </div>

      <div className="w-full bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-center mb-3">Detalle de reserva</h3>

        <div className="flex gap-4">
          <div className="space-y-1 border-r border-gray-200 flex-1">

            <div>
              <h4 className="font-bold">{reservationDetails.venueName}</h4>
              <p className="text-sm text-gray-600 mb-4">{reservationDetails.eventType}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-yellow2 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm">
                  {reservationDetails.district}, {reservationDetails.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-yellow2 shrink-0" />
              <p className="text-sm">{formatDate(reservationDetails.date)}</p>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-yellow2 shrink-0" />
              <p className="text-sm">
                {reservationDetails.initTime} - {reservationDetails.endTime}
                <span className="text-gray-500 ml-2">({reservationDetails.totalHours} horas)</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} className="text-yellow2 shrink-0" />
              <p className="text-sm">{reservationDetails.fullName}</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-yellow2 shrink-0" />
              <p className="text-sm">{reservationDetails.email}</p>
            </div>

          </div>

          <div className="flex flex-col bg-gray-50 rounded-lg p-12 text-center gap-4 justify-center">
            <span className="text-sm font-semibold text-gray-700">
              {paymentMethod?.id === 1 ? "Monto pagado" : "Monto a pagar"}
            </span>
            <span className="text-2xl font-bold text-blue">
              S/ {reservationDetails.totalAmount.toFixed(2)}
            </span>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard size={16} className="shrink-0" />
              <span>Medio de pago: {paymentMethod?.name}</span>
            </div>
          </div>

        </div>
        <p className="text-xs text-gray-500 text-center mt-6">
          Detalle de reserva enviado a: <strong>{reservationDetails.email}</strong>
        </p>
      </div>

      {!isDeferredPayment && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-amber-900">Código de Aprobación:</span>
            <span className="font-bold text-lg text-amber-900 font-mono">{approvalCode}</span>
          </div>
          <p className="text-xs text-amber-800 mt-2">
            <strong>Importante:</strong> Guarda este código. Lo necesitarás para presentar en el evento.
          </p>
        </div>
      )}

      {paymentMethod?.id === 2 && (
        <div className="w-full bg-blue-50 border-l-4 border-blue rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock3 size={20} className="text-blue mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-blue mb-2">Tiempo de confirmación: 24 horas</h4>
              <p className="text-sm text-gray-700">
                Verificaremos tu comprobante de transferencia bancaria. Recibirás confirmación en tu correo.
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod?.id === 3 && (
        <div className="w-full bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Tu código CIP vence en 24 horas</h4>
              <p className="text-sm text-gray-700 mb-2">Código: <span className="font-mono font-bold">{approvalCode}</span></p>
              <p className="text-sm text-gray-700">
                Paga en cualquier agencia autorizada. La confirmación es automática cuando realizes el pago.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex gap-4">
        <Button
          text="Descargar constancia"
          onClick={() => window.print()}
          fullWidth
        />
        <Button
          text="Realizar otra reserva"
          variant="tertiary"
          onClick={() => window.location.href = '/'}
          fullWidth
        />
      </div>
    </div>
  );
};