import { useForm, Controller } from "react-hook-form";
import { IconSelect } from "@/components/atomic/IconSelect";
import { Input } from "@/components/atomic/Input";
import { TimeInput } from "@/components/atomic/TimeInput";
import { data } from "@/constants/data";

interface FormData {
    eventType: string;
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
}

export const SummaryForm = () => {

    const formatDateForForm = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        watch 
    } = useForm<FormData>({
        defaultValues: {
            eventType: "",
            date: formatDateForForm(new Date()),
            quantity: "",
            initTime: "",
            endTime: ""
        }
    });

    const eventTypeOptions = data.tiposEvento.map(tipo => ({
        value: tipo.nombreTipo,
        label: tipo.nombreTipo
    }));

    const onSubmit = (data: FormData) => {
        console.log('Form data:', data);
    };

    const validateDate = (value: string) => {
        const parts = value.split('/');
        if (parts.length !== 3) {
            return "Formato de fecha inválido";
        }
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const selectedDate = new Date(year, month, day);
        
        if (isNaN(selectedDate.getTime())) {
            return "Fecha inválida";
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return "No se pueden seleccionar fechas anteriores a hoy";
        }
        return true;
    };

    const validateQuantity = (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num <= 0) {
            return "Debe ingresar un número válido";
        }
        if (num > 120) {
            return "El máximo es 120 personas";
        }
        return true;
    };

    const validateTime = (value: string) => {
        if (!value) {
            return "Debe seleccionar una hora";
        }
        return true;
    };

    const validateEndTime = (endTime: string) => {
        if (!endTime) {
            return "Debe seleccionar una hora";
        }
        
        const initTime = watch('initTime');
        if (initTime && endTime) {
            const [initHour] = initTime.split(':').map(Number);
            const [endHour] = endTime.split(':').map(Number);
            
            if (endHour <= initHour) {
                return "La hora de fin debe ser posterior a la hora de inicio";
            }
        }
        return true;
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Controller
                name="eventType"
                control={control}
                rules={{ required: "Debe seleccionar un tipo de evento" }}
                render={({ field }) => (
                    <IconSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={eventTypeOptions}
                        placeholder="Tipo de Evento"
                    />
                )}
            />
            <div className="flex gap-4">
                <Controller
                    name="date"
                    control={control}
                    rules={{ 
                        required: "La fecha es requerida",
                        validate: validateDate
                    }}
                    render={({ field }) => (
                        <Input
                            name="date"
                            placeholder="DD/MM/AA"
                            value={field.value}
                            onChange={field.onChange}
                            label="Fecha"
                            type="date"
                            error={errors.date?.message}
                        />
                    )}
                />
                <Controller
                    name="quantity"
                    control={control}
                    rules={{ 
                        required: "El número de personas es requerido",
                        validate: validateQuantity
                    }}
                    render={({ field }) => (
                        <Input
                            name="quantity"
                            value={field.value}
                            onChange={field.onChange}
                            label="Personas (max 120)"
                            type="number"
                            placeholder="Ej: 50"
                            error={errors.quantity?.message}
                        />
                    )}
                />
            </div>
            <div className="flex gap-4">
                <Controller
                    name="initTime"
                    control={control}
                    rules={{ 
                        required: "La hora de inicio es requerida",
                        validate: validateTime
                    }}
                    render={({ field }) => (
                        <TimeInput
                            name="initTime"
                            value={field.value}
                            onChange={field.onChange}
                            label="Hora de inicio"
                            error={errors.initTime?.message}
                            placeholder="Seleccionar hora"
                        />
                    )}
                />
                <Controller
                    name="endTime"
                    control={control}
                    rules={{ 
                        required: "La hora de fin es requerida",
                        validate: validateEndTime
                    }}
                    render={({ field }) => (
                        <TimeInput
                            name="endTime"
                            value={field.value}
                            onChange={field.onChange}
                            label="Hora fin"
                            error={errors.endTime?.message}
                            placeholder="Seleccionar hora"
                        />
                    )}
                />
            </div>
        </form>
    )
};