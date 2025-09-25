import { clsx } from "clsx";

type ButtonVariants = "primary" | "secondary" | "tertiary";

interface Props {
    text: string
    onClick: () => void
    fullWidth?: boolean
    variant?: ButtonVariants
}

export const Button = ({
    text,
    onClick,
    fullWidth,
    variant = "primary"
}: Props) => {

    const handleClick = () => {
        if (onClick) {
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
            onClick={handleClick}
            className={clsx(
                "h-[44px] py-4 px-9 flex items-center justify-center rounded-lg cursor-pointer text-sm",
                getButtonClasses(),
                fullWidth && "w-full"
            )}
        >
            {text}
        </button>
    )
};