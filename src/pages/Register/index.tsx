import { UserModal } from "@/components/organism/UserModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { showAlert } from "@/utils/alert";

interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    firstName: string;
    lastName: string;
    documentNumber: string;
    phone: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}

const isRegisterFormData = (data: LoginFormData | RegisterFormData): data is RegisterFormData => {
    return 'firstName' in data;
};

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleClickAction = () => {
        navigate("/login");
    };

    const handleClickRegister = async (data: LoginFormData | RegisterFormData) => {
        try {
            // Verificar que es RegisterFormData usando el type guard
            if (isRegisterFormData(data)) {
                await register({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dni: data.documentNumber,
                    phone: data.phone,
                    email: data.email,
                    password: data.newPassword
                });
               
                // Mostrar alerta de éxito
                await showAlert({
                    title: '¡Registro Exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                    icon: 'success',
                    confirmButtonText: 'Iniciar Sesión'
                });

                // Redirigir al login después de cerrar la alerta
                navigate("/login");
            }
        } catch (err) {
            console.error("Error en registro:", err);
            // Mostrar alerta de error
            await showAlert({
                title: 'Error en el Registro',
                text: 'Hubo un problema al crear tu cuenta. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
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
