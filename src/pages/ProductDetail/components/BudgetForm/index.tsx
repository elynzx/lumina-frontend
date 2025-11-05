import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/atomic/Button";
import { SummaryForm } from "@/components/organism/SummaryForm";
import { data } from "@/constants/data";

interface FormData {
  eventType: string;
  date: string;
  quantity: string;
  initTime: string;
  endTime: string;
}

export const BudgetLayout = () => {
  const { id } = useParams<{ id: string }>();
  const idLocal = parseInt(id || "1");
  
  const local = data.locales.find(l => l.idLocal === idLocal);
  const precioHora = local?.precioHora || 0;

  const [formData, setFormData] = useState<FormData>({
    eventType: "",
    date: "",
    quantity: "",
    initTime: "",
    endTime: ""
  });


  const calcularHoras = (): number => {
    if (!formData.initTime || !formData.endTime) return 0;
    
    const [initHour, initMin] = formData.initTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    
    const initEnMinutos = initHour * 60 + initMin;
    const endEnMinutos = endHour * 60 + endMin;
    
    const diferencia = endEnMinutos - initEnMinutos;
    return Math.max(0, Math.ceil(diferencia / 60));
  };

  const horas = calcularHoras();
  const subtotal = precioHora * horas;

  return (
    <div className="w-full p-8 rounded-lg border border-blue">
      <h2 className="text-3xl text-center font-semibold mb-8 py-2">
        s/ {precioHora.toFixed(2)} <span className="text-sm font-normal">por hora</span>
      </h2>

      <SummaryForm />

      <div className="my-6 space-y-4">
        <p className="font-semibold text-sm">Detalles</p>
        <div className="flex justify-between">
          <p className="font-normal text-sm">s/{precioHora.toFixed(2)} x {horas} {horas === 1 ? 'hora' : 'horas'}</p>
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
        onClick={() => {
          console.log('Datos de la reserva:', {
            ...formData,
            horas,
            precioHora,
            subtotal,
            idLocal
          });
        }}
      />
    </div>
  );
};
