import { useNavigate } from "react-router-dom";
import logomark from "@/assets/logo/logotype.svg";

interface Props {
    children: React.ReactNode;
}

export const Modal = ({ children }: Props) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-radial">

            <div className="absolute top-6 left-18">
                <img
                    src={logomark}
                    alt="Logo"
                    className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleLogoClick}
                    title="Volver al inicio"
                />

            </div>

            <div className="bg-white py-16 px-12 min-w-[484px] max-w-[588px] rounded-2xl shadow-lg">
                {children}
            </div>
        </div>
    )
};
