import { useForm, Controller } from "react-hook-form";
import { IconChooser } from "@/components/atomic/IconChooser";
import { Input } from "@/components/atomic/Input";
import { useEventTypes } from "@/hooks/api";
import { TimeInput } from "@/components/atomic/TimeInput";
import { Calendar, Users, Clock, Tag } from "lucide-react";
import { useEffect, useMemo } from "react";

interface FormData {
    eventType: string;
    date: string;
    quantity: string;
    initTime: string;
    endTime: string;
}

interface SummaryFormProps {
    venueId?: number;
    maxCapacity?: number;
    availableEventTypes?: string[];
    unavailableDates?: string[];
    onFormChange?: (data: FormData) => void;
    initialValues?: Partial<FormData>;
    onSubmit?: (data: FormData) => void;
}

export const SummaryForm = ({
    venueId = 1,
    maxCapacity = 0,
    availableEventTypes = [],
    unavailableDates = [],
    onFormChange,
    initialValues,
    onSubmit
}: SummaryFormProps) => {

    const { eventTypes, loading: loadingEventTypes } = useEventTypes();

    const eventTypeOptions = useMemo(() => {
        if (availableEventTypes.length > 0) {

            return availableEventTypes.map((nombre) => {
                const eventType = eventTypes.find(et => et.eventTypeName === nombre);
                return {
                    value: eventType?.eventTypeId.toString() || "",
                    label: nombre
                };
            }).filter(opt => opt.value);
        }

        return eventTypes.map(tipo => ({
            value: tipo.eventTypeId.toString(),
            label: tipo.eventTypeName
        }));
    }, [availableEventTypes, eventTypes]);


    const getDefaultDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>({
        defaultValues: {
            eventType: initialValues?.eventType || "",
            date: initialValues?.date || getDefaultDate(),
            quantity: initialValues?.quantity || "",
            initTime: initialValues?.initTime || "",
            endTime: initialValues?.endTime || ""
        }
    });

    const formValues = watch();
    useEffect(() => {
        onFormChange?.(formValues);
    }, [formValues.eventType, formValues.date, formValues.quantity, formValues.initTime, formValues.endTime, onFormChange]);

    const handleFormSubmit = (data: FormData) => {
        onSubmit?.(data);
    };

    const validateDate = (value: string) => {
        if (!value) return "La fecha es requerida";

        let year, month, day;

        if (value.includes('-')) {
            [year, month, day] = value.split('-').map(Number);
        } else if (value.includes('/')) {
            [day, month, year] = value.split('/').map(Number);
        } else {
            return "Formato de fecha inválido";
        }

        if (!day || !month || !year) {
            return "Formato de fecha inválido";
        }

        const selectedDate = new Date(year, month - 1, day);

        if (isNaN(selectedDate.getTime())) {
            return "Fecha inválida";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return "No se pueden seleccionar fechas anteriores a hoy";
        }

        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (unavailableDates.includes(formattedDate)) {
            return "Esta fecha no está disponible";
        }

        return true;
    };

    const validateQuantity = (value: string) => {
        if (!value) {
            return "El número de personas es requerido";
        }

        const num = parseInt(value);
        if (isNaN(num) || num <= 0) {
            return "Debe ingresar un número válido mayor a 0";
        }
        if (maxCapacity > 0 && num > maxCapacity) {
            return `El máximo es ${maxCapacity} personas`;
        }
        return true;
    };

    const validateTime = (value: string) => {
        return value ? true : "Debe seleccionar una hora";
    };

    const validateEndTime = (endTime: string) => {
        if (!endTime) {
            return "Debe seleccionar una hora";
        }

        const initTime = watch('initTime');
        if (initTime && endTime) {
            const [initHour, initMin] = initTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            const initTotalMinutes = initHour * 60 + (initMin || 0);
            const endTotalMinutes = endHour * 60 + (endMin || 0);

            if (endTotalMinutes <= initTotalMinutes) {
                return "La hora de fin debe ser posterior a la hora de inicio";
            }
        }
        return true;
    };

    if (loadingEventTypes) {
        return (
            <div className="flex items-center justify-center p-4">
                <p className="text-sm text-gray-600">Cargando formulario...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3" id="summary-form" noValidate>
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
                            IconComponent={Tag}
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
                        <div className="flex-1">
                            <label className="text-xs text-bgray block mb-1">Fecha</label>
                            <Input
                                name="date"
                                placeholder="Selecciona una fecha"
                                value={field.value}
                                onChange={field.onChange}
                                type="date"
                                error={errors.date?.message}
                                IconComponent={Calendar}
                                min={getDefaultDate()}
                                disabledDates={unavailableDates}
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
                        <div className="flex-1">
                            <label className="text-xs text-bgray block mb-1">
                                Personas (max {maxCapacity})</label>
                            <Input
                                name="quantity"
                                value={field.value}
                                onChange={field.onChange}
                                type="number"
                                placeholder="Ej: 50"
                                error={errors.quantity?.message}
                                IconComponent={Users}
                                min="1"
                                max={maxCapacity > 0 ? maxCapacity : undefined}
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
                                IconComponent={Clock}
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
                                IconComponent={Clock}
                            />
                        </div>
                    )}
                />
            </div>
        </form>
    )
};