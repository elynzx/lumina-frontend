import { useState } from "react";
import { Button } from "@/components/atomic/Button";
import { Dropdown } from "@/components/atomic/Dropdown";
import logomark from "@/assets/logo/logomark.svg"
import logotype from "@/assets/logo/logotype.svg"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/api/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Calendar, LogOut, Menu, X, Home, Building2 } from "lucide-react";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  }

  const handleHomeClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleCatalogClick = () => {
    navigate("/catalogo");
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const hideLogo = location.pathname === "/login" || location.pathname === "/registro";

  return (
    <>
      {/* Mobile Header */}
      <header
        className={`w-full md:hidden flex items-center justify-between px-4 py-4 ${isHome ? 'bg-header-home absolute top-0 left-0 z-50' : 'bg-gradient-radial'
          }`}
      >
        <button onClick={handleHomeClick} className="z-50">
          <img src={isHome ? logotype : logomark} alt="Logo" className="h-8 ml-7" />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="z-50 text-white p-2 mr-5"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop/Tablet Header */}
      <header
        className={`w-full hidden md:grid grid-cols-[1fr_auto_1fr] items-center px-8 md:px-16 lg:px-24 xl:px-[180px] py-6 ${isHome ? 'bg-header-home absolute top-0 left-0 z-50' : 'bg-gradient-radial'
          }`}
      >
        {/* Left Navigation */}
        <nav className="flex gap-6 items-center justify-start">
          <button onClick={handleHomeClick} className="text-white hover:underline text-base">Inicio</button>
          <button onClick={handleCatalogClick} className="text-white hover:underline text-base">Locales</button>
        </nav>

        {/* Center Logo */}
        {!hideLogo && (
          <button onClick={handleHomeClick} className="flex justify-center">
            <img src={isHome ? logotype : logomark} alt="Logo" className="h-10" />
          </button>
        )}

        {/* Right Auth */}
        <div className="flex gap-6 lg:gap-10 items-center justify-end">
          {userIsAuthenticated ? (
            <Dropdown
              trigger={
                <span className="text-white font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              }
              items={[
                {
                  label: "Mis Reservas",
                  onClick: () => navigate("/reservas"),
                  icon: <Calendar size={16} />,
                },
                {
                  label: "Mi Perfil",
                  onClick: () => navigate("/perfil"),
                  icon: <User size={16} />,
                },
                {
                  divider: true,
                },
                {
                  label: "Cerrar Sesión",
                  onClick: handleLogout,
                  icon: <LogOut size={16} />,
                },
              ]}
              align="right"
            />
          ) : (
            <>
              <button onClick={handleLoginClick} className="text-white hover:underline text-base">
                Iniciar Sesión
              </button>
              <Button text="Registrarse" onClick={handleRegisterClick} variant="secondary" />
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gradient-radial pt-20">
          <nav className="flex flex-col items-center gap-6 p-8">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 text-white text-lg font-medium hover:text-gray-200 transition-colors"
            >
              <Home size={20} />
              Inicio
            </button>
            <button
              onClick={handleCatalogClick}
              className="flex items-center gap-3 text-white text-lg font-medium hover:text-gray-200 transition-colors"
            >
              <Building2 size={20} />
              Locales
            </button>

            <div className="w-full h-px bg-white/20 my-4"></div>

            {userIsAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/reservas");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-white text-lg font-medium hover:text-gray-200 transition-colors"
                >
                  <Calendar size={20} />
                  Mis Reservas
                </button>
                <button
                  onClick={() => {
                    navigate("/perfil");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-white text-lg font-medium hover:text-gray-200 transition-colors"
                >
                  <User size={20} />
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-white text-lg font-medium hover:text-gray-200 transition-colors"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="text-white text-lg font-medium hover:text-gray-200 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <Button text="Registrarse" onClick={handleRegisterClick} variant="secondary" />
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};