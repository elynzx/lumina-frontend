import { useState, useRef, useEffect, forwardRef } from "react";
import { DayPicker } from "react-day-picker";
import type { LucideIcon } from 'lucide-react';

import "react-day-picker/style.css";
import "@/styles/calendar.css";

interface Props {
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    icon?: string;
    IconComponent?: LucideIcon;
    label?: string;
    type?: string;
    error?: string;
    disabled?: boolean;
    min?: string | number;
    max?: string | number;
    disabledDates?: string[];
    restrictedDates?: string[];
}

export const Input = forwardRef<HTMLInputElement, Props>(({
    name,
    placeholder,
    value = "",
    onChange,
    icon,
    IconComponent,
    label,
    type = "text",
    error,
    disabled = false,
    min,
    max,
    disabledDates = [],
    restrictedDates = [],
}, ref) => {

    const [viewCalendar, setViewCalendar] = useState(false);
    const [dateSelected, setDateSelected] = useState<Date>();
    const [displayValue, setDisplayValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const formatDateForDisplay = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDisplayDate = (dateString: string): Date | null => {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        return null;
    };


    useEffect(() => {
        if (type === 'date') {
            if (value) {
                const parsedDate = parseDisplayDate(value);
                if (parsedDate) {
                    setDateSelected(parsedDate);
                    setDisplayValue(value);
                } else {
                    const today = new Date();
                    setDateSelected(today);
                    const formattedDate = formatDateForDisplay(today);
                    setDisplayValue(formattedDate);
                    onChange?.(formattedDate);
                }
            } else {
                const today = new Date();
                setDateSelected(today);
                const formattedDate = formatDateForDisplay(today);
                setDisplayValue(formattedDate);
                onChange?.(formattedDate);
            }
        } else {
            setDisplayValue(value);
        }
    }, [value, type, onChange]);

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

    // Helpers to parse YYYY-MM-DD into a local Date (avoid timezone shifts)
    const parseISODateToLocal = (iso: string): Date => {
        const parts = iso.split('-').map(Number);
        if (parts.length !== 3) return new Date(iso);
        const [y, m, d] = parts;
        return new Date(y, m - 1, d);
    };

    // Prepare DayPicker modifiers and disabled array
    const reservedDates = disabledDates.map(d => parseISODateToLocal(d));
    const restrictedDatesParsed = restrictedDates.map(d => parseISODateToLocal(d));
    const minDateObj = new Date();
    minDateObj.setDate(minDateObj.getDate() + 2);
    minDateObj.setHours(0, 0, 0, 0);

    const disabledArray: Array<Date | { before: Date }> = [{ before: minDateObj }, ...reservedDates];

    return (
        <div ref={containerRef} className="flex flex-col w-full relative">
            {label && <label htmlFor={name} className="mb-2 text-sm text-gray-600">{label}</label>}
            <div className={`w-full h-10 px-4 flex items-center gap-2 border-[1px] rounded-lg focus-within:outline-none focus-within:ring-2 ${error
                ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
                : 'border-blue focus-within:ring-blue focus-within:border-blue'
                }`}>
                {IconComponent && (
                    <IconComponent
                        size={20}
                        className="shrink-0 text-bgray"
                    />
                )}
                {!IconComponent && icon && (
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
                    min={min}
                    max={max}
                />
            </div>
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            {viewCalendar && type === "date" && (
                <div className="absolute top-full left-0 mt-2 z-10 bg-white shadow-lg rounded-lg border border-gray-200 p-5">
                    
                    {/* Styles moved to `src/styles/calendar.css` and imported at the top of this file */}
                    <DayPicker
                        mode="single"
                        selected={dateSelected}
                        onSelect={handleChangeCalendar}
                        disabled={disabledArray}
                        modifiers={{ reserved: reservedDates, restricted: restrictedDatesParsed }}
                        modifiersClassNames={{ reserved: 'reserved', restricted: 'restricted' }}
                        defaultMonth={dateSelected || new Date()}
                    />
                    <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                        <div>
                            <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
                            Fechas en rojo = Ocupadas
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
});

Input.displayName = 'Input';
