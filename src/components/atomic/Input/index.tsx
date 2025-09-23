interface Props {
    placeholder?: string;
}

export const Input = ({ placeholder }: Props) => {
    return (
        <input
            className="text-gray text-sm py-[8px] px-[16px] border-zinc-400 border-[1px] rounded-lg w-full"
            placeholder={placeholder}
        />
    )
};
