import { CardWithIcon } from "../CardWithIcon";
import searchIcon from "@/assets/icons/search.svg"
import SendIcon from "@/assets/icons/send.svg"
import calendarIcon from "@/assets/icons/calendar.svg"
import plusIcon from "@/assets/icons/plus.svg"

const cards = [
    {
        title: "Busca",
        description: "Encuentra el espacio filtrando por tipo de evento o zona.",
        icon: searchIcon,
        alt: "search icon"
    },
    {
        title: "Selecciona",
        description: "Elige la fecha y rango de horario que necesitas.",
        icon: SendIcon,
        alt: "send icon"
    },
    {
        title: "Equipa",
        description: "Agrega equipamiento como sillas, mesas y más.",
        icon: plusIcon,
        alt: "plus icon"
    },
    {
        title: "Reserva",
        description: "Realiza el pago de forma segura y confirma tu reserva.",
        icon: calendarIcon,
        alt: "calendar icon"
    }
];

export const HowWorksSection = () => {
    return (
        <div>
            <div style={{ background: "var(--color-gradient-radial)" }} className="section-container">
                <h2 className="text-title text-white">Descubre cómo funciona</h2>
                <p className="text-center text-sm text-white px-[300px]">Busca, reserva y disfruta. Nuestro proceso es rápido, seguro y pensado para que vivas una experiencia sin complicaciones.
                </p>
                <div className="section-grid">
                    {cards.map((card, index) => (
                        <CardWithIcon key={index} title={card.title} description={card.description} icon={card.icon} alt={card.alt} />
                    ))}
                </div>
            </div>
        </div>
    );
};
