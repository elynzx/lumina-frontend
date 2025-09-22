import { clsx } from "clsx";

interface Props {
    text: string
    onClick: () => void
    inverse?: boolean    
}

export const Button = ({
    text,
    onClick,
    inverse = false
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
                "font-body h-[38px] py-4 px-9 flex items-center justify-center text-xs rounded-lg cursor-pointer",
                inverse ? "bg-white text-black border border-black" : "bg-bg text-white"
            )}
        >
            {text}
        </button>
    )
};