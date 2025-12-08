import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atomic/Button";
import { SummaryForm } from "@/components/organism/SummaryForm";
import Cookies from 'js-cookie';
import { showAlert } from '@/utils/alert';

interface FormData {
  eventType: string;
  date: string;
  quantity: string;
  initTime: string;
  endTime: string;
}

interface BudgetFormProps {
  venueId: number;
  pricePerHour: number;
  maxCapacity: number;
  availableEventTypes?: string[];
  unavailableDates?: string[];
}

export const BudgetForm = ({ venueId, pricePerHour, maxCapacity, availableEventTypes = [], unavailableDates = [] }: BudgetFormProps) => {
  const navigate = useNavigate();
  const price = Number(pricePerHour);

  const [formData, setFormData] = useState<FormData>({
    eventType: "",
    date: "",
    quantity: "",
    initTime: "",
    endTime: ""
  });

  useEffect(() => {
    setFormData({
      eventType: "",
      date: "",
      quantity: "",
      initTime: "",
      endTime: ""
    });
  }, [venueId]);

  const handleFormChange = useCallback((updatedData: FormData) => {
    setFormData(updatedData);
  }, []);

  const calculateDurationInHours = (): number => {
    if (!formData.initTime || !formData.endTime) return 0;

    const [initHour, initMin] = formData.initTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);

    const initialTimeInMinutes = initHour * 60 + initMin;
    let endTimeInMinutes = endHour * 60 + endMin;

    if (endTimeInMinutes <= initialTimeInMinutes) {
      endTimeInMinutes += 24 * 60;
    }

    const timeDifference = endTimeInMinutes - initialTimeInMinutes;
    return Math.max(0, Math.ceil(timeDifference / 60));
  };

  const totalHours = calculateDurationInHours();
  const subtotal = price * totalHours;

  const handleFormSubmit = async (data: FormData) => {
    // Verificar si el usuario está autenticado
    const authToken = Cookies.get('auth_token');

    if (!authToken) {
      const confirmed = await showAlert({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para continuar con tu reserva',
        icon: 'warning',
        confirmButtonText: 'Ir a login',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      });

      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    const queryParams = new URLSearchParams({
      horas: totalHours.toString(),
      subtotal: subtotal.toFixed(2),
      eventType: data.eventType,
      date: data.date,
      quantity: data.quantity,
      initTime: data.initTime,
      endTime: data.endTime
    });

    navigate(`/pago/${venueId}?${queryParams.toString()}`);
  };

  return (
    <div className="w-full p-8 rounded-lg border border-blue">
      <div className="py-4 flex flex-col items-center">
        <h2 className="text-3xl text-center font-semibold">
          s/ {price.toFixed(2)} <span className="text-sm font-semibold">por hora</span>
        </h2>
        <p className="mt-2 text-xs text-center text-gray-500">*Precio no incluye IGV, ni servicios obligatorios</p>
      </div>


      <SummaryForm
        venueId={venueId}
        maxCapacity={maxCapacity}
        availableEventTypes={availableEventTypes}
        unavailableDates={unavailableDates}
        onFormChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <div className="my-6 space-y-4">
        <p className="font-semibold text-sm">Detalles</p>
        <div className="flex justify-between">
          <p className="font-normal text-sm">s/{price.toFixed(2)} x {totalHours} {totalHours === 1 ? 'hora' : 'horas'}</p>
          <p className="font-normal text-sm">s/{subtotal.toFixed(2)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p className="font-semibold text-lg">Total estimado</p>
          <p className="font-semibold text-lg">s/{subtotal.toFixed(2)}</p>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        text="Continuar reserva"
        form="summary-form"
      />
      <div className="flex flex-col gap-2 mt-4 text-xs text-center text-gray-500">
        <p>*Las reservas deben realizarse con 48 horas de anticipación.</p>
        <p>**Los eventos pueden realizarse dentro del horario disponible:</p>
        <p>10:00 AM hasta las 2:00 AM del día siguiente.</p>
      </div>
    </div>
  );
};
