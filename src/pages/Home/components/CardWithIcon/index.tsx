interface Props {
    title: string
    description: string
    icon: string
    alt: string
}

export const CardWithIcon = ({ title, description, icon, alt }: Props) => {
    return (
        <div className="flex flex-col relative bg-white rounded-lg py-4 px-4">
            <img src={icon} alt={alt} />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};