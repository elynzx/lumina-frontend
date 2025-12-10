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
        today.setDate(today.getDate() + 2);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMinDate = (): string => {
        return getDefaultDate();
    };

    const getDisabledDatesWithRestriction = (): { restricted: string[], reserved: string[] } => {
        const restrictedDates: string[] = [];
        const today = new Date();
        
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        restrictedDates.push(todayString);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        restrictedDates.push(tomorrowString);
        
        return {
            restricted: restrictedDates,
            reserved: unavailableDates
        };
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
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

    const calculateMinEndTime = (startTime: string) => {
        if (!startTime) return "";
        
        const [hour, min] = startTime.split(':').map(Number);
        const startMinutes = hour * 60 + (min || 0);
        const minEndMinutes = startMinutes + (8 * 60);
        
        let endHour = Math.floor(minEndMinutes / 60);
        const endMin = minEndMinutes % 60;

        if (endHour >= 24) {
            endHour = endHour - 24;
        }
        
        return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    };

    useEffect(() => {
        onFormChange?.(formValues);
    }, [formValues.eventType, formValues.date, formValues.quantity, formValues.initTime, formValues.endTime, onFormChange]);

    useEffect(() => {
        if (formValues.initTime && !formValues.endTime) {
            const minEndTime = calculateMinEndTime(formValues.initTime);
            setValue('endTime', minEndTime);
        }
    }, [formValues.initTime, formValues.endTime, setValue]);

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

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);
        minDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < minDate) {
            return "Día no disponible para reservas";
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

    const validateInitTime = (value: string) => {
        if (!value) {
            return "Debe seleccionar una hora de inicio";
        }

        const [hour, min] = value.split(':').map(Number);
        const totalMinutes = hour * 60 + (min || 0);
        const minStartTime = 10 * 60;
        const maxStartTime = 18 * 60;

        if (totalMinutes < minStartTime) {
            return "La hora de inicio debe ser a partir de las 10:00 AM";
        }

        if (totalMinutes > maxStartTime) {
            return "La hora de inicio debe ser máximo hasta las 6:00 PM";
        }

        return true;
    };

    const validateEndTime = (endTime: string) => {
        if (!endTime) {
            return "Debe seleccionar una hora de fin";
        }

        const initTime = watch('initTime');
        if (initTime && endTime) {
            const [initHour, initMin] = initTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            const initTotalMinutes = initHour * 60 + (initMin || 0);
            let endTotalMinutes = endHour * 60 + (endMin || 0);

            if (endTotalMinutes <= initTotalMinutes) {
                endTotalMinutes += 24 * 60;
            }

            const duration = endTotalMinutes - initTotalMinutes;
            const minDuration = 8 * 60;

            if (duration < minDuration) {
                return "La reserva debe ser de mínimo 8 horas";
            }

            if (endHour > 2 && endHour < 10) {
                return "La hora máxima de cierre es 2:00 AM";
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                                min={getMinDate()}
                                // `disabledDates` should be the backend unavailable dates (reserved)
                                disabledDates={getDisabledDatesWithRestriction().reserved}
                                // `restrictedDates` are the 48-hour restriction (today + tomorrow)
                                restrictedDates={getDisabledDatesWithRestriction().restricted}
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
                                Personas (Máx {maxCapacity})</label>
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                
                <Controller
                    name="initTime"
                    control={control}
                    rules={{
                        required: "La hora de inicio es requerida",
                        validate: validateInitTime
                    }}
                    render={({ field }) => (
                        <div className="flex-1">
                            <label className="text-xs text-bgray block mb-1">Hora de inicio</label>
                            <TimeInput
                                name="initTime"
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);

                                    if (value) {
                                        const minEndTime = calculateMinEndTime(value);
                                        setValue('endTime', minEndTime);
                                    }
                                }}
                                error={errors.initTime?.message}
                                IconComponent={Clock}
                                min="10:00"
                                max="18:00"
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
                            <label className="text-xs text-bgray block mb-1">Hora de fin (Máx 2:00 AM)</label>
                            <TimeInput
                                name="endTime"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.endTime?.message}
                                IconComponent={Clock}
                                min={formValues.initTime ? calculateMinEndTime(formValues.initTime) : "18:00"}
                                max="02:00"
                            />
                        </div>
                    )}
                />
            </div>
            <div className="text-xs text-bgray">*Reserva mínima 8 horas</div>
        </form>
    )
};