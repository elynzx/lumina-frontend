import { useLocation, useNavigate } from "react-router-dom";
import logotype from "@/assets/logo/logotype.svg";

interface Props {
    children: React.ReactNode;
}

export const Modal = ({ children }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoClick = () => {
        navigate("/");
    };
    const showLogo = location.pathname === "/login" || location.pathname === "/registro";

    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-y-auto min-h-screen flex flex-col items-center justify-center sm:items-center sm:justify-center bg-gradient-radial px-4">
            {showLogo && (
                <div className="flex items-center mb-6 sm:mb-0 sm:absolute sm:top-6 sm:left-18 sm:block">
                    <img
                        src={logotype}
                        alt="Logo"
                        className="h-8 sm:h-10 md:h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleLogoClick}
                        title="Volver al inicio"
                    />
                </div>
            )}
            <div className="bg-white py-8 sm:py-12 md:py-16 px-6 sm:px-8 md:px-12 w-full sm:min-w-[484px] max-w-[588px] rounded-2xl shadow-lg sm:mt-0 mt-40 mb-12 sm:mb-0">
                {children}
            </div>
        </div>
    )
};
