import logomark from "@/assets/logo/logomark.svg"
import logotype from "@/assets/logo/logopayment.svg"
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentStepsProps {
    currentStep: number;
}

const steps = [
    { id: 1, title: "Mis Datos" },
    { id: 2, title: "Mobiliarios" },
    { id: 3, title: "Pago" },
    { id: 4, title: "Confirmación" },
];

export const PaymentSteps = ({ currentStep }: PaymentStepsProps) => {
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleLogoClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmExit = () => {
        setShowConfirmDialog(false);
        navigate("/");
    };

    return (
        <>
            <div className="flex gap-6 flex-col mb-2">
                <img
                    src={logotype}
                    className="h-10"
                    alt="logo"
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer" }}
                />

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-2xl relative">

                        <div className="absolute top-4 left-8 right-12 h-1 bg-bgray rounded-full"></div>

                        <div className="flex justify-between relative z-10 px-4">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center">

                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${currentStep >= step.id
                                        ? 'bg-blue text-white'
                                        : 'bg-bgray text-white'
                                        }`}>
                                        {currentStep > step.id ? '✓' : step.id}
                                    </div>

                                    <h3 className={`text-xs text-center mt-3 whitespace-nowrap ${currentStep >= step.id ? 'text-blue' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmExit}
                title="¿Salir del proceso de pago?"
                message="Si sales ahora, perderás todo el progreso de tu reserva. Esta acción no se puede deshacer."
                confirmText="Sí, salir"
                cancelText="Continuar pago"
            />
        </>
    );
};