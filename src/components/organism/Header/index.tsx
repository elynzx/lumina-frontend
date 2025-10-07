import { Button } from "@/components/atomic/Button";
import logomark from "@/assets/logo/logomark.svg"
import logotype from "@/assets/logo/logotype.svg"
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleClick = () => {
    navigate("/registro");
  };

  return (
    <header
      className={`w-full grid grid-cols-[1fr_auto_1fr] items-center px-[180px] py-6 ${
        isHome ? 'bg-header-home absolute top-0 left-0 z-50' : 'bg-gradient-radial'
      }`}
    >
      <nav className="flex gap-6 items-center justify-start">
        <a href="/" className="text-white hover:underline">Inicio</a>
        <a href="/catalogo" className="text-white hover:underline">Locales</a>
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
        <Button text="Registrarse" onClick={handleClick} variant="secondary" />
      </div>
    </header>
  );
};