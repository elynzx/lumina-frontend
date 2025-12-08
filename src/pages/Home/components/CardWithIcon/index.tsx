interface Props {
    title: string
    description: string
    icon: string
    alt: string
}

export const CardWithIcon = ({ title, description, icon, alt }: Props) => {
    return (
        <div className="flex flex-col gap-3 relative bg-white rounded-lg py-8 px-4 w-[250px] items-center text-center">
            <div className="absolute top-28 right-4 bg-yellow p-3 rounded-full">
                <img src={icon} alt={alt} className="w-7" />
            </div>
            <h3 className="text-md font-bold">{title}</h3>
            <p className="text-xs mb-2">{description}</p>
        </div>
    );
};