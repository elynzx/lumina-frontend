import { UserModal } from "@/components/organism/UserModal";

export const Login = () => {
    return (
        <UserModal
            title="Iniciar sesión"
            onClickAction={() => { console.log("Iniciar sesión") }}
            isLogin={true}
            buttonText="Iniciar sesión"
            callBackPassword={() => { console.log("Olvide mi contraseña") }}
            footerText="¿No tienes una cuenta?"
            footerLinkText="Regístrate"
            callBackFooter={() => { console.log("Regístrate") }}
        />
    )
};
