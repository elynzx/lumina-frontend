import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/style.css";

interface Props {
    name: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    icon?: string;
    label?: string;
    type?: string;
}

export const Input = ({
    name,
    placeholder,
    value,
    onChange,
    icon,
    label,
    type
}: Props) => {

    const [viewCalendar, setViewCalendar] = useState(false);
    const [dateSelected, setDateSelected] = useState<Date>();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    const handleChangeCalendar = (date: Date | undefined) => {
        setDateSelected(date);
        if (date) {
            const formattedDate = date.toLocaleDateString();
            onChange(formattedDate);
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
            <div className="w-full h-[48px] px-4 flex items-center gap-2 border-zinc-400 border-[1px] rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue focus-within:border-blue">
                {icon && (
                    <img
                        src={icon}
                        className="w-5 h-5"
                    />
                )}
                <input
                    name={name}
                    className="text-gray py-3 text-sm h-full w-full outline-none focus:outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    readOnly={type === 'date'}
                />
            </div>
            {viewCalendar && type === "date" && (
                <div className="absolute top-full left-0 mt-2 z-10 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
                    <DayPicker
                        mode="single"
                        selected={dateSelected}
                        onSelect={handleChangeCalendar}
                    />
                </div>
            )}
        </div>
    )
};
