import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { data } from "@/constants/data";
import { PaymentSteps } from "./components/PaymentSteps";
import { PaymentForm } from "./components/PaymentForm";
import { LoginRequired } from "./components/LoginRequired";
import { MyDataStep } from "./components/MyDataStep";
import { FurnitureStep } from "./components/FurnitureStep";
import { CheckoutStep } from "./components/CheckoutStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { Button } from "@/components/atomic/Button";
import { useState, useCallback } from "react";

interface SelectedFurniture {
    [key: number]: number;
}

interface PaymentMethod {
    id: number;
    name: string;
    description: string;
    icon: string;
    details: string;
}

export const Payment = () => {

    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const venueId = parseInt(id || "1");
    const isUserLogged = true;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFurniture, setSelectedFurniture] = useState<SelectedFurniture>({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [approvalCode, setApprovalCode] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState(0);

    const eventTypeId = searchParams.get("eventType") || "";
    const eventTypeData = data.tiposEvento.find(te => te.idTipoEvento.toString() === eventTypeId);
    const eventTypeName = eventTypeData?.nombreTipo || "Tipo de evento";

    const date = searchParams.get("date") || "";
    const quantity = searchParams.get("quantity") || "";
    const initTime = searchParams.get("initTime") || "";
    const endTime = searchParams.get("endTime") || "";
    const eventHours = searchParams.get("horas") || "0";

    const venueData = data.locales.find(l => l.idLocal === venueId);

    if (!venueData) {
        return <div className="p-8 text-center">Local no encontrado.</div>;
    }

    const firstPhoto = data.fotosLocales.find(f => f.idLocal === venueId)?.urlFoto || '';
    const district = data.distritos.find(d => d.idDistrito === venueData.idDistrito)?.nombreDistrito || '';

    const handleFurnitureSelectionChange = useCallback((selected: SelectedFurniture) => {
        setSelectedFurniture(selected);
    }, []);

    const handleRemoveFurniture = (furnitureId: number) => {
        setSelectedFurniture(prev => {
            const newSelected = { ...prev };
            delete newSelected[furnitureId];
            return newSelected;
        });
    };

    const handlePaymentMethodSelect = (method: { id: number; name: string }, code: string) => {
        setSelectedPaymentMethod({
            id: method.id,
            name: method.name,
            description: "",
            icon: "",
            details: ""
        });
        setApprovalCode(code);
        setCurrentStep(4);
    };
    const handleTotalAmountChange = (amount: number) => {
        setTotalAmount(amount);
    };

    const handleFormSubmit = () => {
        setCurrentStep(currentStep + 1);
    };

    const reservationDetails = {
        venueName: venueData.nombreLocal,
        eventType: eventTypeName,
        district: district,
        address: venueData.direccion,
        date: date,
        initTime: initTime,
        endTime: endTime,
        totalHours: eventHours,
        fullName: "Juan Pérez García",
        email: "juan@example.com",
        totalAmount: totalAmount
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <MyDataStep />;
            case 2:
                return (
                    <FurnitureStep
                        onFurnitureSelectionChange={handleFurnitureSelectionChange}
                        selectedFurnitureItems={selectedFurniture}
                    />
                );

            case 3:
                return (
                    <CheckoutStep
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                        totalAmount={totalAmount}
                    />
                );
            case 4:
                return (
                    <ConfirmationStep
                        approvalCode={approvalCode}
                        paymentMethod={selectedPaymentMethod}
                        reservationDetails={reservationDetails}
                    />
                );
            default:
                return <MyDataStep />;
        }
    };

    return (
        <div className="min-h-screen flex max-h-screen">

            <div className="flex-1 bg-light-bgray px-24 overflow-y-auto flex flex-col">
                <div className="flex flex-col gap-6 flex-1 py-12">
                    <PaymentSteps currentStep={currentStep} />

                    <div className="bg-white rounded-lg shadow-sm p-8 flex-1 flex flex-col">
                        {!isUserLogged ? (
                            <LoginRequired />
                        ) : (
                            renderStepContent()
                        )}
                    </div>
                    {currentStep !== 4 && (
                        <div className="flex justify-between gap-4">
                            <Button
                                text="Volver"
                                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(`/producto/${venueId}`)}
                            />
                            <Button
                                type="submit"
                                text="Continuar"
                                variant="tertiary"
                                disabled={!isUserLogged}
                                form="summary-form"
                            />
                        </div>
                    )}
                </div>
            </div>
            {currentStep !== 4 && (
                <div className="w-2/5 px-10 py-10 bg-white hidden lg:flex flex-col border-l border-gray-200 overflow-y-auto">
                    <PaymentForm
                        venueData={venueData}
                        firstPhoto={firstPhoto}
                        selectedFurniture={selectedFurniture}
                        onRemoveFurniture={handleRemoveFurniture}
                        eventType={eventTypeName}
                        date={date}
                        quantity={quantity}
                        initTime={initTime}
                        endTime={endTime}
                        eventHours={eventHours}
                        onTotalAmountChange={handleTotalAmountChange}
                        onFormSubmit={handleFormSubmit}
                    />
                </div>
            )}
        </div>
    )
};