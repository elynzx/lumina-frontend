import { useState, useEffect } from "react";
import { X, CreditCard, Lock, CheckCircle2 } from "lucide-react";

interface CulqiModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (approvalCode: string) => void;
}

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  email: string;
}

export default function CulqiPaymentModal({ isOpen, onClose, amount, onPaymentSuccess }: CulqiModalProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    email: ""
  });
  
  const [cardType, setCardType] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const firstDigit = cardData.number.charAt(0);
    if (firstDigit === "4") setCardType("visa");
    else if (firstDigit === "5") setCardType("mastercard");
    else if (firstDigit === "3") setCardType("amex");
    else setCardType("");
  }, [cardData.number]);

  const validateLuhn = (number: string): boolean => {
    const digits = number.replace(/\s/g, "");
    if (!/^\d+$/.test(digits)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;

    if (field === "number") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
    }

    if (field === "expiry") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    }

    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    if (field === "name") {
      formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").toUpperCase();
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    const cardNumber = cardData.number.replace(/\s/g, "");
    if (!cardNumber || cardNumber.length < 13) {
      newErrors.number = "Número de tarjeta inválido";
    } else if (!validateLuhn(cardNumber)) {
      newErrors.number = "Número de tarjeta inválido";
    }

    if (!cardData.name.trim()) {
      newErrors.name = "Ingresa el nombre del titular";
    }

    const [month, year] = cardData.expiry.split("/");
    if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      newErrors.expiry = "Fecha inválida";
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cardData.email || !emailRegex.test(cardData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      const approvalCode = `CULQI-${timestamp}-${random}`;

      setTimeout(() => {
        onPaymentSuccess(approvalCode);
        handleClose();
      }, 2000);
    }, 2500);
  };

  const handleClose = () => {
    setCardData({ number: "", name: "", expiry: "", cvv: "", email: "" });
    setErrors({});
    setIsProcessing(false);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        <div className="bg-[#2c2c2c] text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#00a19b] rounded-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#e95420] rounded-full"></div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold">Culqi</h2>
          </div>
          <button onClick={handleClose} className="hover:bg-white/10 p-2 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="bg-[#f8f8f8] p-4 flex justify-end items-center gap-2 border-b">
          <span className="text-2xl font-bold text-[#00a19b]">S/ {amount.toFixed(2)}</span>
          <CreditCard className="text-[#00a19b]" size={28} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          <div className="bg-[#fafafa] p-6 border-r">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white border-l-4 border-[#00a19b] rounded">
                <CreditCard size={24} className="text-gray-600" />
                <span className="font-semibold text-sm">Tarjeta débito/crédito</span>
              </div>
            </div>

            <div className="mt-auto pt-80">
              <div className="text-xs text-gray-500 text-center">Powered by</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-8 h-8 border-4 border-[#00a19b] rounded-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#e95420] rounded-full"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold">Culqi</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 border-4 border-[#00a19b] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Procesando pago...</p>
                <p className="text-sm text-gray-500 mt-2">Por favor espera un momento</p>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <p className="text-xl font-bold text-green-600">¡Pago exitoso!</p>
                <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Lock size={16} className="text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Recuerda activar tu tarjeta para compras por internet</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Número de tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className={`w-full px-2 py-1 border text-sm rounded-md focus:ring-2 focus:ring-[#00a19b] focus:border-transparent ${
                        errors.number ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {cardType && (
                      <div className="absolute right-3 top-2.5">
                        {cardType === "visa" && (
                          <div className="text-[#1434CB] font-bold text-xl">VISA</div>
                        )}
                        {cardType === "mastercard" && (
                          <div className="flex gap-0">
                            <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                            <div className="w-6 h-6 bg-yellow-500 rounded-full -ml-3 opacity-80"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.number && (
                    <p className="text-xs text-red-500 mt-1">{errors.number}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleInputChange("expiry", e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-2 py-1 border text-sm rounded-md focus:ring-2 focus:ring-[#00a19b] focus:border-transparent ${
                        errors.expiry ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.expiry && (
                      <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Código de seguridad
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      placeholder="CVV"
                      maxLength={3}
                      className={`w-full px-2 py-1 border text-sm rounded-md focus:ring-2 focus:ring-[#00a19b] focus:border-transparent ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Titular de la tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="NOMBRE APELLIDO"
                    className={`w-full px-2 py-1 border text-sm rounded-md focus:ring-2 focus:ring-[#00a19b] focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className={`w-full px-2 py-1 border text-sm rounded-md focus:ring-2 focus:ring-[#00a19b] focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Recibirás el comprobante en este correo
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-[#00a19b] hover:bg-[#008f8a] text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                >
                  Pagar S/ {amount.toFixed(2)}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  <Lock size={12} className="inline mr-1" />
                  Pago 100% seguro encriptado
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}