import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atomic/Button";
import { SummaryForm } from "@/components/organism/SummaryForm";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

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
    const endTimeInMinutes = endHour * 60 + endMin;

    const timeDifference = endTimeInMinutes - initialTimeInMinutes;
    return Math.max(0, Math.ceil(timeDifference / 60));
  };

  const totalHours = calculateDurationInHours();
  const subtotal = price * totalHours;

  const handleFormSubmit = (data: FormData) => {
    // Verificar si el usuario está autenticado
    const authToken = Cookies.get('auth_token');
    
    if (!authToken) {
      // Mostrar alerta de SweetAlert2
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para continuar con tu reserva',
        icon: 'warning',
        confirmButtonText: 'Ir a login',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
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
      <h2 className="text-3xl text-center font-semibold mb-8 py-2">
        s/ {price.toFixed(2)} <span className="text-sm font-normal">por hora</span>
      </h2>

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
    </div>
  );
};
