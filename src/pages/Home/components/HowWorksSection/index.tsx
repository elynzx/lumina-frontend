import { CardWithIcon } from "../CardWithIcon";
import searchIcon from "@/assets/icons/search.svg"
import selectIcon from "@/assets/icons/select.svg"
import calendarIcon from "@/assets/icons/calendar.svg"
import plusIcon from "@/assets/icons/plus.svg"

const cards = [
    {
        title: "Busca",
        description: "Encuentra el espacio ideal filtrando por tipo de evento o zona.",
        icon: searchIcon,
        alt: "search icon"
    },
    {
        title: "Selecciona",
        description: "Elige la fecha y rango de horario que necesitas.",
        icon: selectIcon,
        alt: "select icon"
    },
    {
        title: "Equipa",
        description: "Selecciona el equipamiento como sillas, mesas y más.",
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
            <div className="section-container bg-gradient-radial">
                <h2 className="text-title text-white">Descubre cómo funciona</h2>
                <p className="text-center text-sm text-white w-[510px]">Busca, reserva y disfruta. Nuestro proceso es rápido, seguro y pensado para que vivas una experiencia sin complicaciones.
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
