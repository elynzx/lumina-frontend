import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/atomic/Button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center">
                    <div className="rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-amber-600" size={26} />
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                        onClick={onClose}
                        text={cancelText}
                        variant="secondary"
                        fullWidth
                    />
                    <Button 
                        onClick={onConfirm}
                        text={confirmText}
                        variant="primary"
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
};