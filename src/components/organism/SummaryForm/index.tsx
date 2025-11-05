import { useForm, Controller } from "react-hook-form";
import { IconChooser } from "@/components/atomic/IconChooser";
import { Input } from "@/components/atomic/Input";
import { TimeInput } from "@/components/atomic/TimeInput";
import { data } from "@/constants/data";
import calendarIcon from "@/assets/icons/calendar_gray.svg";
import peopleIcon from "@/assets/icons/capacity_gray.svg";
import clockIcon from "@/assets/icons/clock_gray.svg";
import eventIcon from "@/assets/icons/event_tag_gray.svg";


interface FormData {
    eventType: string;
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
}

interface SummaryFormProps {
    localId?: number;
}

export const SummaryForm = ({ localId = 1 }: SummaryFormProps) => {

    const localData = data.locales.find(l => l.idLocal === localId);
    const maxCapacity = localData?.aforoMaximo || 120;

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
        if (num > maxCapacity) {
            return `El máximo es ${maxCapacity} personas`;
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
                    <div>
                        <label className="text-xs text-bgray block mb-1">Tipo de Evento</label>
                        <IconChooser
                            value={field.value}
                            onChange={field.onChange}
                            options={eventTypeOptions}
                            placeholder="Tipo de Evento"
                            icon={eventIcon}
                        />
                        {errors.eventType && (<p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>)}
                    </div>
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
                        <div>
                            <label className="text-xs text-bgray block mb-1">Fecha</label>
                            <Input
                                name="date"
                                placeholder="DD/MM/AA"
                                value={field.value}
                                onChange={field.onChange}
                                type="date"
                                error={errors.date?.message}
                                icon={calendarIcon}
                            />
                        </div>
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
                        <div>
                            <label className="text-xs text-bgray block mb-1">Personas (max {maxCapacity})</label>
                            <Input
                                name="quantity"
                                value={field.value}
                                onChange={field.onChange}
                                type="number"
                                placeholder="Ej: 50"
                                error={errors.quantity?.message}
                                icon={peopleIcon}
                            />
                        </div>
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
                        <div className="flex-1">
                            <label className="text-xs text-bgray block mb-1">Hora de inicio</label>
                            <TimeInput
                                name="initTime"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.initTime?.message}
                                icon={clockIcon}
                            />
                        </div>
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
                        <div className="flex-1">
                            <label className="text-xs text-bgray block mb-1">Hora de fin</label>
                            <TimeInput
                                name="endTime"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.endTime?.message}
                                icon={clockIcon}
                            />
                        </div>
                    )}
                />
            </div>
        </form>
    )
};