import { clsx } from "clsx";

type ButtonVariants = "primary" | "secondary" | "tertiary";

interface Props {
    text: string
    onClick?: () => void
    fullWidth?: boolean
    variant?: ButtonVariants
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

export const Button = ({
    text,
    onClick,
    fullWidth,
    variant = "primary",
    type = "button",
    disabled = false
}: Props) => {

    const handleClick = () => {
        if (onClick && !disabled) {
            onClick();
        }
    }

    const getButtonClasses = () => {
        switch (variant) {
            case "primary":
                return "bg-blue text-white";
            case "secondary":
                return "bg-white text-blue border border-blue";
            case "tertiary":
                return "bg-yellow text-white";
            default:
                return "bg-blue text-white";
        }
    };
    
    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={clsx(
                "h-[44px] py-4 px-9 flex items-center justify-center rounded-lg text-sm transition-colors",
                getButtonClasses(),
                fullWidth && "w-full",
                disabled 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer hover:opacity-90"
            )}
        >
            {text}
        </button>
    )
};