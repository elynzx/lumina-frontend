import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atomic/Button";

export const LoginRequired = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white h-full gap-8 flex flex-col items-center justify-center p-8">
            <div className="text-center ">
                <h3 className="text-xl font-semibold mb-3 text-black">Inicia sesión para continuar</h3>
                <p className="text-xs text-black">Por favor, inicia sesión con tu correo electrónico.</p>
            </div>
            <div className="flex flex-col gap-4">
                <Button
                    text="Iniciar Sesión"
                    onClick={() => navigate('/login')}
                    variant="secondary"

                />
                <Button
                    text="Registrarse"
                    onClick={() => navigate('/registro')}
                />
            </div>
        </div>
    );
};