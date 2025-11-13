import { useState } from "react";
import { UserModal } from "@/components/organism/UserModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/api/useAuth";

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

const isLoginFormData = (data: LoginFormData | RegisterFormData): data is LoginFormData => {
    return 'password' in data;
};

export const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleClickAction = () => {
        navigate("/registro");

    }

    const handleClickLogin = async (data: LoginFormData | RegisterFormData) => {
        try {
            setError("");
            setIsLoading(true);

            if (isLoginFormData(data)) {
                await login({
                    email: data.email,
                    password: data.password
                });

                navigate("/");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
            setError(errorMessage);
            console.error("Error en login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <UserModal
                title="Iniciar sesión"
                onClickAction={handleClickLogin}
                isLogin={true}
                buttonText={isLoading ? "Iniciando..." : "Iniciar sesión"}
                callBackPassword={() => { console.log("Olvide mi contraseña") }}
                footerText="¿No tienes una cuenta?"
                footerLinkText="Regístrate"
                callBackFooter={handleClickAction}
                error={error}
                disabled={isLoading}
            />
        </>
    )
};
