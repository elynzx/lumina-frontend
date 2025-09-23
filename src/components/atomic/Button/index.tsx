import { clsx } from "clsx";

interface Props {
    text: string
    onClick: () => void
    inverse?: boolean  
    fullWidth?: boolean  
}

export const Button = ({
    text,
    onClick,
    inverse = false,
    fullWidth
}: Props) => {

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    }
    return (
        <button
            onClick={handleClick}
            className={clsx(
                "h-[44px] py-4 px-9 flex items-center justify-center rounded-lg cursor-pointer text-sm",
                inverse ? "bg-white text-blue border border-blue" : "bg-blue text-white",
                fullWidth && "w-full"
            )}
        >
            {text}
        </button>
    )
};