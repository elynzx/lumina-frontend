import { useState, useRef, useEffect, forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    icon?: string;
    IconComponent?: LucideIcon;
    min?: string;
    max?: string;
}

export const TimeInput = forwardRef<HTMLInputElement, Props>(({
    name,
    value = "",
    onChange,
    icon,
    IconComponent,
    label,
    error,
    disabled = false,
    placeholder = "Seleccionar",
    min,
    max,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);


    const timeOptions = (() => {

        const baseOptions = Array.from({ length: 24 }, (_, index) => {
            const hour = index.toString().padStart(2, '0');
            return {
                value: `${hour}:00`,
                label: `${hour}:00`,
                hour: index
            };
        });

        const filteredOptions = baseOptions.filter(option => {
            const optionHour = option.hour;
            
            if (min) {
                const [minHour] = min.split(':').map(Number);
                
                if (max) {
                    const [maxHour] = max.split(':').map(Number);
                    if (maxHour < minHour) {
                        if (optionHour < minHour && optionHour > maxHour) {
                            return false;
                        }
                    } else {
                        if (optionHour < minHour) return false;
                    }
                } else {
                    if (optionHour < minHour) return false;
                }
            }
            
            if (max) {
                const [maxHour] = max.split(':').map(Number);
                
                if (min) {
                    const [minHour] = min.split(':').map(Number);
                    if (maxHour < minHour) {
                        return true;
                    } else {
                        if (optionHour > maxHour) return false;
                    }
                } else {
                    if (optionHour > maxHour) return false;
                }
            }
            
            return true;
        });

        if (min && max) {
            const [minHour] = min.split(':').map(Number);
            const [maxHour] = max.split(':').map(Number);
            
            if (maxHour < minHour) {
                const afternoonEvening = filteredOptions.filter(opt => opt.hour >= minHour);
                const earlyMorning = filteredOptions.filter(opt => opt.hour <= maxHour);
                
                const afternoonEveningFormatted = afternoonEvening.map(({ value, label }) => ({ value, label }));
                const earlyMorningFormatted = earlyMorning.map(({ value, label }) => ({ 
                    value, 
                    label: `${label}` 
                }));
                
                return [...afternoonEveningFormatted, ...earlyMorningFormatted];
            }
        }
        return filteredOptions.map(({ value, label }) => ({ value, label }));
    })();

    const handleTimeSelect = (timeValue: string) => {
        onChange?.(timeValue);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col w-full relative">
            {label && <label htmlFor={name} className="mb-1 text-xs">{label}</label>}
            <div
                className={`w-full h-10 px-4 flex items-center gap-2 border rounded-lg cursor-pointer transition-all ${error
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-blue hover:ring-2 hover:ring-blue'
                    } ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
                onClick={handleToggle}
            >
                {IconComponent && (
                    <IconComponent
                        size={20}
                        className="shrink-0 text-bgray"
                    />
                )}
                {!IconComponent && icon && (
                    <img
                        src={icon}
                        alt={placeholder}
                        className="w-5 h-5"
                    />
                )}
                <span className={`text-sm flex-1 min-w-0 overflow-hidden ${value ? 'text-blue' : 'text-bgray'}`}>
                    {value || placeholder}
                </span>
                <svg
                    className={`w-5 h-5 shrink text-bgray transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <input
                ref={ref}
                name={name}
                type="hidden"
                value={value}
                onChange={() => { }}
                disabled={disabled}
                {...props}
            />

            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}

            {isOpen && (
                <div className="absolute w-full top-full left-0 mt-2 z-20 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {timeOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-bgray hover:text-white ${value === option.value ? 'bg-blue text-white' : 'text-gray-700'
                                }`}
                            onClick={() => handleTimeSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

TimeInput.displayName = 'TimeInput';