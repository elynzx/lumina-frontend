import { UserModal } from "@/components/organism/UserModal";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    const handleClickAction = () => {
        navigate("/registro");
    };

    const handleClickLogin = () => {
        console.log("Iniciando sesión...");
    };

    return (
        <UserModal
            title="Iniciar sesión"
            onClickAction={handleClickLogin}
            isLogin={true}
            buttonText="Iniciar sesión"
            callBackPassword={() => { console.log("Olvide mi contraseña") }}
            footerText="¿No tienes una cuenta?"
            footerLinkText="Regístrate"
            callBackFooter={handleClickAction}
        />
    )
};
