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
  <div className="bg-gradient-lineal w-full min-h-[320px] h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 md:px-20 lg:px-[150px] py-8 md:py-12 justify-items-start md:justify-items-center">
    <div className="flex flex-col items-start w-full">
      <h4 className="font-bold mb-4 text-base md:text-lg">Contáctanos</h4>
      <ul className="space-y-2 w-full">
        {contactList.map((item, index) => (
          <li key={index} className="text-xs sm:text-sm flex items-start gap-2">
            <img src={item.icon} alt={item.title} className="w-5 sm:w-7 flex-shrink-0 mt-0.5" />
            <span className="break-words">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col items-start w-full">
      <h4 className="font-bold mb-4 text-base md:text-lg">Información</h4>
      <ul className="space-y-2 w-full">
        {informationList.map((item, index) => (
          <li key={index}>
            {item.url ? (
              <a href={item.url} className="text-xs sm:text-sm hover:underline">
                {item.title}
              </a>
            ) : (
              <span className="text-xs sm:text-sm">{item.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col items-start w-full md:col-span-2 lg:col-span-1">
      <h4 className="font-bold mb-4 text-base md:text-lg">Síguenos</h4>
      <ul className="flex gap-3 sm:gap-4 mb-4">
        {socialMediaLinks.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title={item.title}
            >
              <img src={item.icon} alt={item.title} className="w-8 sm:w-10" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);