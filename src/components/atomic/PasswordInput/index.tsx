import { useState, forwardRef } from "react";

interface Props {
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(({
    name,
    placeholder,
    value = "",
    onChange,
    label,
    error,
    disabled = false,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col w-full">
            {label && <label htmlFor={name} className="mb-2 text-sm text-gray-600">{label}</label>}
            <div className={`w-full h-[48px] px-4 flex items-center gap-2 border-[1px] rounded-lg focus-within:outline-none focus-within:ring-2 ${
                error 
                    ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' 
                    : 'border-zinc-400 focus-within:ring-blue focus-within:border-blue'
            }`}>
                <input
                    ref={ref}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    className="text-gray py-3 text-sm h-full w-full outline-none focus:outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';