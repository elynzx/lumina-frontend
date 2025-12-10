import { useNavigate } from "react-router-dom";
import logotype from "@/assets/logo/logotype.svg";

interface Props {
    children: React.ReactNode;
}

export const Modal = ({ children }: Props) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-radial px-4">

            <div className="absolute top-4 sm:top-6 left-4 sm:left-18">
                <img
                    src={logotype}
                    alt="Logo"
                    className="h-8 sm:h-10 md:h-12 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleLogoClick}
                    title="Volver al inicio"
                />

            </div>

            <div className="bg-white py-8 sm:py-12 md:py-16 px-6 sm:px-8 md:px-12 w-full sm:min-w-[484px] max-w-[588px] rounded-2xl shadow-lg">
                {children}
            </div>
        </div>
    )
};
