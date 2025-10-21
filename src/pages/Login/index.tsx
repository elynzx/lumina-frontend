import { useState } from "react";
import { UserModal } from "@/components/organism/UserModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
    const { login } = useAuth();

    const handleClickAction = () => {
        navigate("/registro");
        
    }

    const handleClickLogin = async (data: LoginFormData | RegisterFormData) => {
        try {
            setError("");
            
            /* Verificar que es LoginFormData usando el type guard */
            if (isLoginFormData(data)) {
                await login({
                    email: data.email,
                    contrasena: data.password
                });
               
                navigate("/");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
            setError(errorMessage);
            console.error("Error en login:", err);
        }
    };

    return (
        <>
            {/* {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )} */}
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
        </>
    )
};
