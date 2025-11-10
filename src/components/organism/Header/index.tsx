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
  
  // Obtenemos los valores actuales llamando a las funciones del store
  const currentUser = user();
  const userIsAuthenticated = isAuthenticated();

  const handleRegisterClick = () => {
    navigate("/registro");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleCatalogClick = () => {
    navigate("/catalogo");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header
      className={`w-full grid grid-cols-[1fr_auto_1fr] items-center px-[180px] py-6 ${
        isHome ? 'bg-header-home absolute top-0 left-0 z-50' : 'bg-gradient-radial'
      }`}
    >
      <nav className="flex gap-6 items-center justify-start">
        <button onClick={handleHomeClick} className="text-white hover:underline">Inicio</button>
        <button onClick={handleCatalogClick} className="text-white hover:underline">Locales</button>
      </nav>

      <div className="flex justify-center items-center">
        <button onClick={handleHomeClick}>
          <img src={isHome
            ? logotype
            : logomark}
            alt="Logo" className="h-10" />
        </button>
      </div>

      <div className="flex gap-10 items-center justify-end">
        {userIsAuthenticated ? (
          <>
            <span className="text-white font-medium">
              Hola {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <Button text="Cerrar Sesión" onClick={handleLogout} variant="secondary" />
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className="text-white hover:underline">
              Iniciar Sesión
            </button>
            <Button text="Registrarse" onClick={handleRegisterClick} variant="secondary" />
          </>
        )}
      </div>
    </header>
  );
};