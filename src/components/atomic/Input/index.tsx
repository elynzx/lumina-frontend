interface Props {
    placeholder?: string;
}

export const Input = ({ placeholder }: Props) => {
    return (
        <input
            className="py-[8px] px-[16px] border-litle-gray border-[1px] rounded-lg w-full"
            placeholder={placeholder}
        />
    )
};
