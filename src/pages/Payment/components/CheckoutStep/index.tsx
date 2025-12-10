import { useState } from "react";
import { data } from "@/constants/data";
import { CreditCard, Landmark } from "lucide-react";
import pagoEfectivoIcon from "@/assets/icons/pagoEfectivo.svg";
import CulqiPaymentModal from "./CulqiPaymentModal";
import { PagoEfectivoModal } from "./PagoEfectivoModal";
import { useCloudinary } from "@/hooks/useCloudinary";

interface PaymentMethodDetails {
  id: number;
  icon?: React.ReactNode | string;
  details: string;
}

interface CheckoutStepProps {
  onPaymentMethodSelect?: (method: { id: number; name: string }, approvalCode: string, receiptUrl?: string) => void;
  totalAmount?: number;
}

const paymentMethodDetails: { [key: number]: PaymentMethodDetails } = {
  1: {
    id: 1,
    icon: <CreditCard className="w-6 h-6" />,
    details: "Pago inmediato con tarjeta de crédito o débito. Procesamiento instantáneo."
  },
  2: {
    id: 2,
    icon: <Landmark className="w-6 h-6" />,
    details: "Realiza una transferencia bancaria y adjunta tu comprobante de pago."
  },
  3: {
    id: 3,
    icon: pagoEfectivoIcon,
    details: "Genera un código (CIP) y paga en efectivo en agentes, bodegas, bancos o apps."
  }
};

export const CheckoutStep = ({ onPaymentMethodSelect, totalAmount = 0 }: CheckoutStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [voucher, setVoucher] = useState<File | null>(null);
  const [showCulqiModal, setShowCulqiModal] = useState(false);
  const [showPagoEfectivoModal, setShowPagoEfectivoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { uploadImage, uploading, error: uploadError } = useCloudinary();

  const paymentMethods = data.metodosPago.filter(m =>
    m.idMetodoPago === 1 || m.idMetodoPago === 2 || m.idMetodoPago === 3
  );

  const generateApprovalCode = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `APR-${timestamp}-${random}`;
  };

  const handleConfirmPayment = async (methodId: number) => {
    if (methodId === 1) {
      setShowCulqiModal(true);
      return;
    }

    if (methodId === 3) {
      setShowPagoEfectivoModal(true);
      return;
    }

    if (methodId === 2 && !voucher) {
      alert("Por favor sube el comprobante bancario");
      return;
    }

    setIsProcessing(true);
    
    try {
      let receiptUrl = undefined;
      
      // Si es transferencia bancaria, subir el comprobante a Cloudinary
      if (methodId === 2 && voucher) {
        receiptUrl = await uploadImage(voucher);
        if (!receiptUrl) {
          alert(uploadError || "Error al subir el comprobante. Por favor, inténtalo de nuevo.");
          setIsProcessing(false);
          return;
        }
      }

      const generatedCode = generateApprovalCode();
      const selectedPaymentMethod = paymentMethods.find(m => m.idMetodoPago === methodId);
      onPaymentMethodSelect?.(
        { id: methodId, name: selectedPaymentMethod?.nombreMetodo || "" },
        generatedCode,
        receiptUrl
      );
    } catch (error) {
      console.error('Error en el pago:', error);
      alert("Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCulqiSuccess = (approvalCode: string) => {
    console.log("Culqi success:", approvalCode);
    const selectedPaymentMethod = paymentMethods.find(m => m.idMetodoPago === 1);
    onPaymentMethodSelect?.(
      { id: 1, name: selectedPaymentMethod?.nombreMetodo || "Tarjeta de Crédito" },
      approvalCode
    );
  };

  const handlePagoEfectivoGenerated = (cip: string, expiryDate: string) => {
    console.log("PagoEfectivo generated:", cip);
    const selectedPaymentMethod = paymentMethods.find(m => m.idMetodoPago === 3);
    onPaymentMethodSelect?.(
      { id: 3, name: selectedPaymentMethod?.nombreMetodo || "PagoEfectivo" },
      `CIP-${cip}`
    );
  };

  const renderIcon = (methodId: number) => {
    const details = paymentMethodDetails[methodId];

    if (typeof details.icon === "string") {
      return (
        <img
          src={details.icon}
          alt={paymentMethods.find(m => m.idMetodoPago === methodId)?.nombreMetodo}
          className="w-24 object-contain"
        />
      );
    }

    return (
      <div className="w-8 h-8 flex items-center justify-center text-blue">
        {details.icon}
      </div>
    );
  };

  const getButtonText = (methodId: number) => {
    if (isProcessing) return "Procesando...";
    if (methodId === 1) return "Pagar ahora";
    if (methodId === 3) return "Generar código de pago";
    return "Confirmar Pago";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Método de Pago</h2>
        <p className="text-xs text-gray-600">Selecciona tu método de pago preferido</p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const details = paymentMethodDetails[method.idMetodoPago];

          return (
            <div key={method.idMetodoPago}>
              <div
                onClick={() => setSelectedMethod(method.idMetodoPago)}
                className={`p-4 border-2 rounded-t-lg cursor-pointer transition-all hover:shadow-sm ${selectedMethod === method.idMetodoPago
                  ? "border-blue bg-blue/2 border-b-0"
                  : "border-gray-200 hover:border-blue/30 rounded-lg"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedMethod === method.idMetodoPago}
                      onChange={() => setSelectedMethod(method.idMetodoPago)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>

                  {renderIcon(method.idMetodoPago)}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{method.nombreMetodo}</h3>
                    <p className="text-xs text-gray-600 mt-1">{method.descripcion}</p>

                    {selectedMethod === method.idMetodoPago && (
                      <p className="text-xs text-gray-700 mt-2 pt-2 border-t border-gray-200">
                        {details.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transferencia Bancaria */}
              {selectedMethod === method.idMetodoPago && method.idMetodoPago === 2 && (
                <div className="border-2 border-t-0 border-blue  rounded-b-lg overflow-hidden">
                  <div className="bg-blue/2 p-4 space-y-4">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs font-medium mb-2">Datos para la transferencia:</p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><strong>Banco:</strong> BCP</p>
                        <p><strong>Cuenta:</strong> 123-456789-01-2</p>
                        <p><strong>Titular:</strong> Lumina Eventos SAC</p>
                        <p><strong>CCI:</strong> 002-123-000456789012-01</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Sube el comprobante:</label>
                      <div className="relative">
                        <input
                          id="voucher-upload"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setVoucher(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label
                          htmlFor="voucher-upload"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue hover:bg-blue/5 transition-all bg-white"
                        >
                          {voucher ? (
                            <>
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-green-600">{voucher.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setVoucher(null);
                                }}
                                className="ml-auto text-red-500 hover:text-red-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm text-gray-600">
                                Seleccionar archivo o arrastrarlo aquí
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Formatos permitidos: JPG, PNG, PDF. Tamaño máximo: 5MB
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800">
                        <strong>Nota:</strong> Tu reserva quedará pendiente de confirmación. Verificaremos tu comprobante y confirmaremos tu reserva dentro de 24 horas.
                      </p>
                    </div>

                    {uploadError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-800">{uploadError}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleConfirmPayment(2)}
                      disabled={!voucher || isProcessing || uploading}
                      className="w-full py-3 bg-blue text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subiendo comprobante...
                        </>
                      ) : (
                        getButtonText(2)
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tarjeta de Crédito/Débito */}
              {selectedMethod === method.idMetodoPago && method.idMetodoPago === 1 && (
                <div className="border-2 border-t-0 border-blue rounded-b-lg bg-blue/2 overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-800">
                        <strong>✓ Pago seguro:</strong> Tu reserva quedará confirmada inmediatamente después del pago exitoso.
                      </p>
                    </div>

                    <button
                      onClick={() => handleConfirmPayment(1)}
                      disabled={isProcessing}
                      className="w-full py-3 bg-blue text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue/90 transition-colors"
                    >
                      {getButtonText(1)}
                    </button>
                  </div>
                </div>
              )}

              {/* PagoEfectivo */}
              {selectedMethod === method.idMetodoPago && method.idMetodoPago === 3 && (
                <div className="border-2 border-t-0 border-blue rounded-b-lg overflow-hidden">
                  <div className="bg-blue/2 rounded-b-lg p-4 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800">
                        <strong>Nota:</strong> Tu reserva quedará pendiente de confirmación. Una vez realizado el pago, recibirás la confirmación en 5-10 minutos.
                      </p>
                    </div>

                    <button
                      onClick={() => handleConfirmPayment(3)}
                      disabled={isProcessing}
                      className="w-full py-3 bg-blue text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue/90 transition-colors"
                    >
                      {getButtonText(3)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CulqiPaymentModal
        isOpen={showCulqiModal}
        onClose={() => setShowCulqiModal(false)}
        amount={totalAmount}
        onPaymentSuccess={handleCulqiSuccess}
      />

      <PagoEfectivoModal
        isOpen={showPagoEfectivoModal}
        onClose={() => setShowPagoEfectivoModal(false)}
        amount={totalAmount}
        onPaymentGenerated={handlePagoEfectivoGenerated}
      />
    </div>
  );
};