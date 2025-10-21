import { Button } from "@/components/atomic/Button";
import logomark from "@/assets/logo/logomark.svg"
import logotype from "@/assets/logo/logotype.svg"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

export const Header = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, isAuthenticated } = useAuthStore();
  const isHome = location.pathname === "/";

  const handleRegisterClick = () => {
    navigate("/registro");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  }

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
        {isAuthenticated ? (
          <>
            <span className="text-white">
              Hola, {user?.nombreCompleto || user?.email}
            </span>
            <Button text="Cerrar Sesión" onClick={handleLogout} variant="secondary" />
          </>
        ) : (
          <>
            <a href="/login" className="text-white hover:underline">
              Iniciar Sesión
            </a>
            <Button text="Registrarse" onClick={handleRegisterClick} variant="secondary" />
          </>
        )}
      </div>
    </header>
  );
};