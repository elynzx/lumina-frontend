import { useState, useRef, useEffect, forwardRef } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/style.css";

interface Props {
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    icon?: string;
    label?: string;
    type?: string;
    error?: string;
    disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(({
    name,
    placeholder,
    value = "",
    onChange,
    icon,
    label,
    type = "text",
    error,
    disabled = false,
    ...props
}, ref) => {

    const [viewCalendar, setViewCalendar] = useState(false);
    const [dateSelected, setDateSelected] = useState<Date>();
    const [displayValue, setDisplayValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Función para formatear fecha en formato DD/MM/YYYY
    const formatDateForDisplay = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Función para convertir string DD/MM/YYYY a Date
    const parseDisplayDate = (dateString: string): Date | null => {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0-11
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        return null;
    };

    // Inicializar y sincronizar fechas
    useEffect(() => {
        if (type === 'date') {
            if (value) {
                // Si hay un valor, intentar parsearlo
                const parsedDate = parseDisplayDate(value);
                if (parsedDate) {
                    setDateSelected(parsedDate);
                    setDisplayValue(value);
                } else {
                    // Si el valor no es válido, usar hoy
                    const today = new Date();
                    setDateSelected(today);
                    const formattedDate = formatDateForDisplay(today);
                    setDisplayValue(formattedDate);
                    onChange?.(formattedDate);
                }
            } else {
                // Si no hay valor, usar hoy
                const today = new Date();
                setDateSelected(today);
                const formattedDate = formatDateForDisplay(today);
                setDisplayValue(formattedDate);
                onChange?.(formattedDate);
            }
        } else {
            setDisplayValue(value);
        }
    }, [value, type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    }

    const handleChangeCalendar = (date: Date | undefined) => {
        setDateSelected(date);
        if (date) {
            const formattedDate = formatDateForDisplay(date);
            setDisplayValue(formattedDate);
            onChange?.(formattedDate);
            setViewCalendar(false);
        }
    };

    const handleFocus = () => {
        if (type === 'date') {
            setViewCalendar(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
                setViewCalendar(false);
            }
        }, 100);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setViewCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col w-full relative">
            {label && <label htmlFor={name} className="mb-2 text-sm text-gray-600">{label}</label>}
            <div className={`w-full h-[48px] px-4 flex items-center gap-2 border-[1px] rounded-lg focus-within:outline-none focus-within:ring-2 ${
                error 
                    ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' 
                    : 'border-zinc-400 focus-within:ring-blue focus-within:border-blue'
            }`}>
                {icon && (
                    <img
                        src={icon}
                        className="w-5 h-5"
                    />
                )}
                <input
                    ref={ref}
                    name={name}
                    type={type === 'date' ? 'text' : type}
                    className="text-gray py-3 text-sm h-full w-full outline-none focus:outline-none"
                    placeholder={placeholder}
                    value={type === 'date' ? displayValue : value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    readOnly={type === 'date'}
                    disabled={disabled}
                />
            </div>
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            {viewCalendar && type === "date" && (
                <div className="absolute top-full left-0 mt-2 z-10 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
                    <DayPicker
                        mode="single"
                        selected={dateSelected}
                        onSelect={handleChangeCalendar}
                        disabled={{ before: new Date() }}
                        defaultMonth={dateSelected || new Date()}
                    />
                </div>
            )}
        </div>
    )
});

Input.displayName = 'Input';
