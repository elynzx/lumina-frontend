import { Button } from "@/components/atomic/Button";
import logomark from "@/assets/logo/logomark.svg"
import logotype from "@/assets/logo/logotype.svg"

interface Props {
  onClickAction: () => void;
  buttonText: string;
  isHome?: boolean;
}

export const Header = ({
  onClickAction,
  buttonText,
  isHome = true,
}: Props) => (
  <header
    style={{
      background: isHome
        ? "rgba(255,255,255,0.15)"
        : "var(--color-gradient-radial)",
      backdropFilter: isHome ? "blur(8px)" : undefined,
    }}
    className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-[180px] py-6"
  >
    <nav className="flex gap-6 items-center justify-start">
      <a href="/" className="text-white hover:underline">Inicio</a>
      <a href="/locales" className="text-white hover:underline">Locales</a>
    </nav>

    <div className="flex justify-center items-center">
      <a href="/">
        <img src={isHome
          ? logotype
          : logomark}
          alt="Logo" className="h-10" />
      </a>
    </div>

    <div className="flex gap-10 items-center justify-end">
      <a href="/login" className="text-white hover:underline">
        Iniciar Sesión
      </a>
      <Button text={buttonText} onClick={onClickAction} inverse />
    </div>
  </header>
);