import { useState } from "react";
import { X, Copy, Download } from "lucide-react";

interface PagoEfectivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentGenerated: (cip: string, expiryDate: string) => void;
}

export const PagoEfectivoModal = ({
  isOpen,
  onClose,
  amount,
  onPaymentGenerated
}: PagoEfectivoModalProps) => {
  const [cip, setCip] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateCIP = () => {
    const length = Math.random() > 0.5 ? 9 : 8;
    const newCip = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');

    setCip(newCip);
    
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    setExpiryDate(expiry.toLocaleString("es-PE"));
  };

  const handleCopy = () => {
    if (cip) {
      navigator.clipboard.writeText(cip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = () => {
    if (cip) {
      onPaymentGenerated(cip, expiryDate || "");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">PagoEfectivo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-3 bg-blue/10 rounded-lg">
          <p className="text-sm text-gray-600">Monto a pagar:</p>
          <p className="text-2xl font-bold text-blue">S/ {amount.toFixed(2)}</p>
        </div>

        {!cip ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Genera un código (CIP) para pagar en efectivo en agentes autorizados, bodegas, bancos o apps.
            </p>
            <button
              onClick={generateCIP}
              className="w-full py-2 bg-blue text-white rounded-lg font-medium text-sm hover:bg-blue/90"
            >
              Generar Código CIP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-blue">
              <p className="text-xs text-gray-600 mb-2">Tu código CIP:</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-mono font-bold text-blue flex-1 break-all">{cip}</p>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Copiar"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-600 mt-2">✓ Copiado</p>}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-900 mb-1">Vence en:</p>
              <p className="text-sm text-amber-900">{expiryDate}</p>
            </div>

            <div className="bg-blue/10 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>Pasos:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Copia tu código CIP</li>
                  <li>Ve a una agencia autorizada</li>
                  <li>Ingresa el código y paga S/ {amount.toFixed(2)}</li>
                  <li>Tu reserva se confirmará automáticamente</li>
                </ol>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border rounded-lg font-medium text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2 bg-blue text-white rounded-lg font-medium text-sm hover:bg-blue/90 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoEfectivoModal;