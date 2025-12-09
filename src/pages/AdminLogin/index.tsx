import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "@/api/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/atomic/Input";
import { PasswordInput } from "@/components/atomic/PasswordInput";
import logomark from "@/assets/logo/logomark.svg";


export const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin } = useAuthService();
    const { refresh } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await adminLogin({
                email,
                password
            });
           
            // Actualizar el store para reflejar el cambio
            refresh();

            // Redirigir al panel de administrador
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Error en login de administrador:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-2">
            {/* Lado Izquierdo - Logo */}
            <div className="bg-gradient-to-br from-purple-600 via-blue to-indigo-700 flex items-center justify-center">
                <div className="text-center">
                    <img 
                        src={logomark} 
                        alt="Logo" 
                        className="w-64 h-64 mx-auto mb-4"
                    />
                </div>
            </div>

            {/* Lado Derecho - Formulario */}
            <div className="bg-white flex items-center justify-center px-12">
                <div className="w-full max-w-md">
                    {/* Título */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
                    <p className="text-gray-600 mb-8">Por favor, ingresa tus credenciales de Administrador</p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(value) => setEmail(value)}
                            />
                        </div>

                        <div>
                            <PasswordInput
                                name="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(value) => setPassword(value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => console.log("Recuperar contraseña")}
                                className="text-sm text-gray-900 underline hover:text-gray-700"
                            >
                                Olvidé mi contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};
