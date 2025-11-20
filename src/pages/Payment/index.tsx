import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { PaymentSteps } from "./components/PaymentSteps";
import { PaymentForm } from "./components/PaymentForm";
import { LoginRequired } from "./components/LoginRequired";
import { MyDataStep } from "./components/MyDataStep";
import { FurnitureStep } from "./components/FurnitureStep";
import { CheckoutStep } from "./components/CheckoutStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { Button } from "@/components/atomic/Button";
import { useState, useCallback, useEffect } from "react";
import { useVenueDetail, useFurniture, useCreateReservation } from "@/hooks/api";
import Cookies from 'js-cookie';

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

    const { venue: venueData, loading: venueLoading, error: venueError } = useVenueDetail(venueId);
    const { furniture: furnitureList, loading: furnitureLoading } = useFurniture();
    const { createReservation } = useCreateReservation();

    const eventTypeId = parseInt(searchParams.get("eventType") || "0");
    const date = searchParams.get("date") || "";
    const quantity = searchParams.get("quantity") || "";
    const initTime = searchParams.get("initTime") || "";
    const endTime = searchParams.get("endTime") || "";
    const eventHours = searchParams.get("horas") || "0";
    const subtotalFromUrl = searchParams.get("subtotal") || "0";

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFurniture, setSelectedFurniture] = useState<SelectedFurniture>({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [approvalCode, setApprovalCode] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState(parseFloat(subtotalFromUrl));
    const [userData, setUserData] = useState({
        email: "",
        nombres: "",
        apellidos: "",
        dni: "",
        celular: ""
    });

    const authToken = Cookies.get('auth_token');
    const isUserLogged = !!authToken;

    // Obtener datos del usuario logeado desde cookies
    useEffect(() => {
        const userDataCookie = Cookies.get('user_data');
        if (userDataCookie) {
            try {
                const parsedData = JSON.parse(userDataCookie);
                setUserData({
                    email: parsedData.email || "",
                    nombres: parsedData.firstName || parsedData.nombres || parsedData.nombre || "",
                    apellidos: parsedData.lastName || parsedData.apellidos || parsedData.apellido || "",
                    dni: parsedData.dni || parsedData.documentNumber || "",
                    celular: parsedData.phone || parsedData.celular || parsedData.telefono || ""
                });
            } catch (err) {
                console.error('Error al parsear datos del usuario:', err);
            }
        }
    }, []);

    const handleFurnitureSelectionChange = useCallback((selected: SelectedFurniture) => {
        setSelectedFurniture(selected);
    }, []);

    const handleRemoveFurniture = useCallback((furnitureId: number) => {
        setSelectedFurniture(prev => {
            const newSelected = { ...prev };
            delete newSelected[furnitureId];
            return newSelected;
        });
    }, []);

    const handleTotalAmountChange = useCallback((amount: number) => {
        setTotalAmount(amount);
    }, []);

    const handleFormSubmit = useCallback(() => {
        setCurrentStep(currentStep + 1);
    }, [currentStep]);

    const handlePaymentMethodSelect = async (method: { id: number; name: string }, code: string) => {
        setSelectedPaymentMethod({
            id: method.id,
            name: method.name,
            description: "",
            icon: "",
            details: ""
        });
        setApprovalCode(code);

        try {
            const token = Cookies.get('auth_token');
            console.log('Token en cookies:', token ? 'Existe' : 'NO EXISTE');

            const dateParts = date.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            /* 
                        const venueHourPrice = parseFloat(venueData.pricePerHour.toString());
                        const eventHoursNumber = parseInt(eventHours);
             */
            const venueCost = parseFloat(subtotalFromUrl);

            let furnitureCost = 0;
            const furnitureItems = Object.entries(selectedFurniture).map(([furnitureId, qty]) => {
                const furniture = furnitureList.find(f => f.furnitureId === parseInt(furnitureId));
                const subtotal = furniture ? furniture.unitPrice * qty : 0;
                furnitureCost += subtotal;
                return {
                    furnitureId: parseInt(furnitureId),
                    quantity: qty,
                    unitPrice: furniture?.unitPrice || 0,
                    subtotal: subtotal
                };
            });

            const reservationData = {
                venueId: venueId,
                eventTypeId: eventTypeId,
                reservationDate: formattedDate,
                startTime: initTime,
                endTime: endTime,
                guestCount: parseInt(quantity),
                venueCost: venueCost,
                furnitureCost: furnitureCost,
                totalCost: totalAmount,
                furnitureItems: furnitureItems,
                paymentMethodId: method.id,
                approvalCode: code
            };

            const response = await createReservation(reservationData);
            console.log('Reserva creada exitosamente:', response);
        } catch (err: any) {
            console.error('Error al crear reserva:', err);
            alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
            return;
        }
        setCurrentStep(4);
    };

    if (venueLoading || furnitureLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (venueError || !venueData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{venueError || 'Local no encontrado'}</p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    const mappedEventTypes = venueData.availableEventTypes?.map((et) => {
        if (typeof et === "string") {
            return { eventTypeId: parseInt(et, 10), eventTypeName: `Tipo ${et}` };
        }
        return et;
    });

    const eventTypeName = mappedEventTypes?.find(
        (et: { eventTypeId: number; eventTypeName: string }) => et.eventTypeId === eventTypeId
    )?.eventTypeName || "Tipo de evento";

    const reservationDetails = {
        venueName: venueData.venueName,
        eventType: eventTypeName,
        district: venueData.districtName,
        address: venueData.address,
        date: date,
        initTime: initTime,
        endTime: endTime,
        totalHours: eventHours,
        fullName: userData.nombres + " " + userData.apellidos,
        email: userData.email,
        totalAmount: totalAmount
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <MyDataStep userData={userData} />;
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
                return <MyDataStep userData={userData} />;
        }
    };

    return (
        <div className="min-h-screen flex max-h-screen">

            <div className="flex-1 bg-light-bgray px-24 overflow-y-auto flex flex-col">
                <div className="flex flex-col gap-6 flex-1 py-12">
                    <button
                        onClick={() => navigate(`/producto/${venueId}`)}
                        className="flex items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm w-fit"
                    >
                        <span>←</span>
                        <span>Volver</span>
                    </button>
                    <PaymentSteps currentStep={currentStep} />

                    <div className="bg-white rounded-lg shadow-sm p-8 flex-1 flex flex-col">
                        {!isUserLogged ? (
                            <LoginRequired />
                        ) : (
                            renderStepContent()
                        )}
                    </div>
                    {currentStep !== 3 && currentStep !== 4 && (
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
                        venueId={venueId}
                        venueName={venueData.venueName}
                        districtName={venueData.districtName}
                        address={venueData.address}
                        pricePerHour={venueData.pricePerHour}
                        firstPhoto={venueData.photos?.[0]}
                        selectedFurniture={selectedFurniture}
                        furnitureList={furnitureList}
                        onRemoveFurniture={handleRemoveFurniture}
                        eventType={eventTypeId.toString()}
                        eventTypeName={eventTypeName}
                        date={date}
                        quantity={quantity}
                        initTime={initTime}
                        endTime={endTime}
                        eventHours={eventHours}
                        subtotalFromUrl={subtotalFromUrl}
                        onTotalAmountChange={handleTotalAmountChange}
                        onFormSubmit={handleFormSubmit}
                    />
                </div>
            )}
        </div>
    )
};