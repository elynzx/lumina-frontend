import { useState, useRef, useEffect, forwardRef } from "react";

interface Props {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
}

export const TimeInput = forwardRef<HTMLInputElement, Props>(({
    name,
    value = "",
    onChange,
    label,
    error,
    disabled = false,
    placeholder = "Seleccionar hora",
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generar opciones de hora (solo horas completas)
    const timeOptions = Array.from({ length: 24 }, (_, index) => {
        const hour = index.toString().padStart(2, '0');
        return {
            value: `${hour}:00`,
            label: `${hour}:00`
        };
    });

    const handleTimeSelect = (timeValue: string) => {
        onChange?.(timeValue);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Cerrar al hacer click fuera
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
            {label && <label htmlFor={name} className="mb-2 text-sm text-gray-600">{label}</label>}
            <div 
                className={`w-full h-[48px] px-4 flex items-center justify-between border-[1px] rounded-lg cursor-pointer focus-within:outline-none focus-within:ring-2 ${
                    error 
                        ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' 
                        : 'border-zinc-400 focus-within:ring-blue focus-within:border-blue'
                } ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
                onClick={handleToggle}
            >
                <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            {/* Input oculto para react-hook-form */}
            <input
                ref={ref}
                name={name}
                type="hidden"
                value={value}
                onChange={() => {}} // Manejado por handleTimeSelect
                disabled={disabled}
                {...props}
            />
            
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-20 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto w-full">
                    {timeOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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