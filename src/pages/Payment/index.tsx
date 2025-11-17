import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { data } from "@/constants/data";
import { useCustomerService } from "@/api/services/customerService";
import type { Furniture } from "@/api/interfaces/furniture";
import { PaymentSteps } from "./components/PaymentSteps";
import { PaymentForm } from "./components/PaymentForm";
import { LoginRequired } from "./components/LoginRequired";
import { MyDataStep } from "./components/MyDataStep";
import { FurnitureStep } from "./components/FurnitureStep";
import { CheckoutStep } from "./components/CheckoutStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { Button } from "@/components/atomic/Button";
import { useState, useCallback, useEffect } from "react";
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
    const customerService = useCustomerService();
    const venueId = parseInt(id || "1");
    const isUserLogged = true;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFurniture, setSelectedFurniture] = useState<SelectedFurniture>({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [approvalCode, setApprovalCode] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [furnitureList, setFurnitureList] = useState<Furniture[]>([]);
    const [userData, setUserData] = useState({
        email: "",
        nombres: "",
        apellidos: "",
        dni: "",
        celular: ""
    });

    const eventTypeId = searchParams.get("eventType") || "";
    const eventTypeData = data.tiposEvento.find(te => te.idTipoEvento.toString() === eventTypeId);
    const eventTypeName = eventTypeData?.nombreTipo || "Tipo de evento";

    const date = searchParams.get("date") || "";
    const quantity = searchParams.get("quantity") || "";
    const initTime = searchParams.get("initTime") || "";
    const endTime = searchParams.get("endTime") || "";
    const eventHours = searchParams.get("horas") || "0";

    // Cargar mobiliarios del backend
    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const data = await customerService.getAllFurniture();
                setFurnitureList(data as unknown as Furniture[]);
            } catch (err) {
                console.error('Error al cargar mobiliarios:', err);
            }
        };

        fetchFurniture();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                console.log('Datos del usuario mapeados:', {
                    email: parsedData.email,
                    nombres: parsedData.firstName,
                    apellidos: parsedData.lastName,
                    dni: parsedData.dni || parsedData.documentNumber,
                    celular: parsedData.phone
                });
            } catch (err) {
                console.error('Error al parsear datos del usuario:', err);
            }
        }
    }, []);

    const handleFurnitureSelectionChange = useCallback((selected: SelectedFurniture) => {
        setSelectedFurniture(selected);
    }, []);

    const venueData = data.locales.find(l => l.idLocal === venueId);

    if (!venueData) {
        return <div className="p-8 text-center">Local no encontrado.</div>;
    }

    const firstPhoto = data.fotosLocales.find(f => f.idLocal === venueId)?.urlFoto || '';
    const district = data.distritos.find(d => d.idDistrito === venueData.idDistrito)?.nombreDistrito || '';

    const handleRemoveFurniture = (furnitureId: number) => {
        setSelectedFurniture(prev => {
            const newSelected = { ...prev };
            delete newSelected[furnitureId];
            return newSelected;
        });
    };

    const handlePaymentMethodSelect = async (method: { id: number; name: string }, code: string) => {
        setSelectedPaymentMethod({
            id: method.id,
            name: method.name,
            description: "",
            icon: "",
            details: ""
        });
        setApprovalCode(code);

        // Crear la reserva en BD
        try {
            // Verificar si el token existe
            const token = Cookies.get('auth_token');
            console.log('Token en cookies:', token ? 'Existe' : 'NO EXISTE');

            // Convertir fecha de dd/MM/yyyy a yyyy-MM-dd
            const dateParts = date.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const venueHourPrice = parseFloat(venueData.precioHora.toString());
            const eventHoursNumber = parseInt(eventHours);
            const venueCost = venueHourPrice * eventHoursNumber;

            // Calcular costos de mobiliarios
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
                eventTypeId: parseInt(eventTypeId),
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

            const response = await customerService.createReservation(reservationData);
            console.log('Reserva creada exitosamente:', response);
        } catch (err) {
            console.error('Error al crear la reserva:', err);
        }

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
                        venueData={venueData}
                        firstPhoto={firstPhoto}
                        selectedFurniture={selectedFurniture}
                        furnitureList={furnitureList}
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