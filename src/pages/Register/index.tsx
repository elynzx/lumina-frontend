import { UserModal } from "@/components/organism/UserModal";

export const Register = () => {
    return (
        <UserModal
            title="Regístrate"
            subtitle="Alquila el salón perfecto para tu evento"
            onClickAction={() => { console.log("Registrar") }}
            buttonText="Registrar"
            footerText="¿Ya tienes una cuenta?"
            footerLinkText="Inicia Sesión"
            callBackFooter={() => { console.log("Inicia Sesión") }}
        />
    )
};
