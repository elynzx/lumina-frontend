import { UserModal } from "@/components/organism/UserModal";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();

    const handleClickAction = () => {
        navigate("/login");
    };

    const handleClickRegister = () => {
        console.log("Registrando usuario...");
    };

    return (
        <UserModal
            title="Regístrate"
            subtitle="Crea tu cuenta y alquila el salón perfecto para tu evento"
            onClickAction={handleClickRegister}
            buttonText="Registrar"
            footerText="¿Ya tienes una cuenta?"
            footerLinkText="Inicia Sesión"
            callBackFooter={handleClickAction}
        />
    )
};
