import locationIcon from "@/assets/icons/location_blue.svg"
import tiktokIcon from "@/assets/icons/tiktok.svg"
import instagramIcon from "@/assets/icons/instagram.svg"
import youtubeIcon from "@/assets/icons/youtube.svg"
import whatsappIcon from "@/assets/icons/whatsapp.svg"
import emailIcon from "@/assets/icons/email.svg"

interface ListItem {
  title: string;
  url?: string;
  icon?: string;
}

const contactList: ListItem[] = [
  { title: "Av. Principal 123, Lima, Perú", icon: locationIcon },
  { title: "+51 999 888 777", icon: whatsappIcon },
  { title: "contacto@luminaeventos.com", icon: emailIcon }
];

const informationList: ListItem[] = [
  { title: "Preguntas Frecuentes", url: "/faq" },
  { title: "Sobre nosotros", url: "/about" },
  { title: "Términos y condiciones", url: "/terms" },
  { title: "Políticas de privacidad", url: "/privacy" }
];

const socialMediaLinks: ListItem[] = [
  { title: "Instagram", url: "https://instagram.com", icon: instagramIcon },
  { title: "Youtube", url: "https://youtube.com", icon: youtubeIcon },
  { title: "Tik Tok", url: "https://tiktok.com", icon: tiktokIcon },
];

export const Footer = () => (
  <div className="bg-gradient-lineal w-full h-[320px] grid grid-cols-3 px-[150px] py-12 justify-items-center">
    <div className="flex flex-col items-start">
      <h4 className="font-bold mb-4">Contáctanos</h4>
      <ul className="space-y-2">
        {contactList.map((item, index) => (
          <li key={index} className="text-sm">
            <img src={item.icon} alt={item.title} className="w-7 inline-block mr-2" />
            {item.title}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col items-start">
      <h4 className="font-bold mb-4">Información</h4>
      <ul className="space-y-2">
        {informationList.map((item, index) => (
          <li key={index}>
            {item.url ? (
              <a href={item.url} className="text-sm hover:underline">
                {item.title}
              </a>
            ) : (
              <span className="text-sm">{item.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col items-start">
      <h4 className="font-bold mb-4">Síguenos</h4>
      <ul className="space-y-2 mb-4 flex gap-2">
        {socialMediaLinks.map((item, index) => (
          <li key={index}>
            <img src={item.icon} alt={item.title} className="w-10 inline-block mr-2" />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);