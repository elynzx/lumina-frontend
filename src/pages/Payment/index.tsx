import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { PaymentSteps } from "./components/PaymentSteps";
import { PaymentForm } from "./components/PaymentForm";
import { LoginRequired } from "./components/LoginRequired";
import { MyDataStep } from "./components/MyDataStep";
import { FurnitureStep } from "./components/FurnitureStep";
import { CheckoutStep } from "./components/CheckoutStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { Button } from "@/components/atomic/Button";
import { useVenueDetail, useFurniture, useCreateReservation, useEventTypes, useUnavailableDates } from "@/hooks/api";
import { usePaymentStore } from "@/store/usePaymentStore";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";

export const Payment = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const venueId = parseInt(id || "1");

    const eventTypeId = parseInt(searchParams.get("eventType") || "0");
    const date = searchParams.get("date") || "";
    const quantity = searchParams.get("quantity") || "";
    const initTime = searchParams.get("initTime") || "";
    const endTime = searchParams.get("endTime") || "";
    const eventHours = searchParams.get("horas") || "0";
    const subtotalFromUrl = searchParams.get("subtotal") || "0";

    const [currentGuestCount, setCurrentGuestCount] = useState(parseInt(quantity || "0"));
    const [showBackConfirmDialog, setShowBackConfirmDialog] = useState(false);

    const {
        currentStep,
        selectedFurniture,
        selectedPaymentMethod,
        approvalCode,
        totalAmount,
        isFurnitureValid,
        userData,
        reservationDetails,
        setCurrentStep,
        setUserData,
        setTotalAmount,
        setSelectedPaymentMethod,
        setApprovalCode,
        setReservationDetails,
        resetPaymentState
    } = usePaymentStore();

    const { venue: venueData, loading: venueLoading, error: venueError } = useVenueDetail(venueId);
    const { furniture: furnitureList, loading: furnitureLoading } = useFurniture();
    const { unavailableDates, loading: _datesLoading } = useUnavailableDates(venueId);
    const { eventTypes } = useEventTypes();
    const { createReservation } = useCreateReservation();

    const authToken = Cookies.get('auth_token');
    const isUserLogged = !!authToken;

    const eventTypeName = eventTypes?.find(
        (eventType) => eventType.eventTypeId === eventTypeId
    )?.eventTypeName || "Tipo de evento";

    useEffect(() => {
        resetPaymentState();
        setTotalAmount(parseFloat(subtotalFromUrl));
    }, [resetPaymentState, setTotalAmount, subtotalFromUrl]);

    useEffect(() => {
        const userDataCookie = Cookies.get('user_data');
        if (!userDataCookie) return;

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
    }, [setUserData]);

    useEffect(() => {
        if (!venueData || !eventTypeName || !userData.nombres) return;

        const venueSubtotal = parseFloat(subtotalFromUrl) || 0;

        const mandatoryItem = furnitureList.find(f => 
            f.furnitureName.toLowerCase().includes('servicios obligatorios')
        );
        const mandatoryQty = mandatoryItem ? (selectedFurniture[mandatoryItem.furnitureId] || 0) : 0;
        const mandatoryServicesTotal = mandatoryItem ? (mandatoryItem.unitPrice * mandatoryQty) : 0;

        setReservationDetails({
            venueName: venueData.venueName,
            eventType: eventTypeName,
            district: venueData.districtName,
            address: venueData.address,
            date: date,
            initTime: initTime,
            endTime: endTime,
            totalHours: eventHours,
            fullName: `${userData.nombres} ${userData.apellidos}`,
            email: userData.email,
            totalAmount: totalAmount,
            venueSubtotal: venueSubtotal,
            pricePerHour: venueData.pricePerHour,
            guestCount: currentGuestCount,
            celular: userData.celular,
            mandatoryServicesTotal: mandatoryServicesTotal
        });
    }, [
        venueData, 
        eventTypeName, 
        userData, 
        date, 
        initTime, 
        endTime, 
        eventHours, 
        totalAmount, 
        currentGuestCount,
        subtotalFromUrl,
        furnitureList,
        selectedFurniture,
        setReservationDetails
    ]);

    const handleFormDataChange = useCallback((formData: any) => {
        if (formData.quantity && parseInt(formData.quantity) !== currentGuestCount) {
            setCurrentGuestCount(parseInt(formData.quantity) || 0);
        }
    }, [currentGuestCount]);

    const handleFormSubmit = useCallback(() => {
        const paymentStore = usePaymentStore.getState();
        paymentStore.nextStep();
    }, []);

    const handleBackClick = () => {
        setShowBackConfirmDialog(true);
    };

    const handleConfirmBack = () => {
        setShowBackConfirmDialog(false);
        navigate(`/producto/${venueId}`);
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

        try {
            
            const dateParts = date.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

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
                guestCount: currentGuestCount,
                venueCost: parseFloat(subtotalFromUrl),
                furnitureCost: furnitureCost,
                totalCost: totalAmount,
                furnitureItems: furnitureItems,
                paymentMethodId: method.id,
                approvalCode: code
            };

            const response = await createReservation(reservationData);
            console.log('Reserva creada exitosamente:', response);
            
            setCurrentStep(4);
        } catch (err: any) {
            console.error('Error al crear reserva:', err);
            alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
        }
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

    /**
     *
     */
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <MyDataStep userData={userData} />;
            
            case 2:
                return <FurnitureStep guestCount={currentGuestCount} />;

            case 3:
                return (
                    <CheckoutStep
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                        totalAmount={totalAmount}
                    />
                );
            
            case 4:
                return reservationDetails ? (
                    <ConfirmationStep
                        approvalCode={approvalCode}
                        paymentMethod={selectedPaymentMethod}
                        reservationDetails={reservationDetails}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p>Cargando detalles de la reserva...</p>
                    </div>
                );
            
            default:
                return <MyDataStep userData={userData} />;
        }
    };

    return (
        <div className="min-h-screen flex max-h-screen">

            <div className="flex-1 bg-light-bgray px-24 overflow-y-auto flex flex-col">
                <div className="flex flex-col gap-6 flex-1 mt-6 mb-10">
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
                                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : handleBackClick()}
                            />
                            {currentStep !== 3 && (
                                <Button
                                    type="submit"
                                    text="Continuar"
                                    variant="tertiary"
                                    disabled={!isUserLogged || (currentStep === 2 && !isFurnitureValid)}
                                    form="summary-form"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            {currentStep !== 4 && (
                <div className="w-[35%] px-10 py-10 bg-white hidden lg:flex flex-col border-l border-gray-200 overflow-y-auto">
                    <PaymentForm
                        venueId={venueId}
                        venueName={venueData.venueName}
                        districtName={venueData.districtName}
                        address={venueData.address}
                        pricePerHour={venueData.pricePerHour}
                        maxCapacity={venueData.maxCapacity}
                        firstPhoto={venueData.photos?.[0]}
                        furnitureList={furnitureList}
                        unavailableDates={unavailableDates}
                        eventType={eventTypeId.toString()}
                        eventTypeName={eventTypeName}
                        availableEventTypes={venueData.availableEventTypes || []}
                        date={date}
                        quantity={quantity}
                        initTime={initTime}
                        endTime={endTime}
                        eventHours={eventHours}
                        subtotalFromUrl={subtotalFromUrl}
                        onFormDataChange={handleFormDataChange}
                        onFormSubmit={handleFormSubmit}
                    />
                </div>
            )}

            <ConfirmDialog
                isOpen={showBackConfirmDialog}
                onClose={() => setShowBackConfirmDialog(false)}
                onConfirm={handleConfirmBack}
                title="¿Salir del proceso de reserva?"
                message="Si sales ahora, perderás toda tu selección del formulario de pago."
                confirmText="Sí, salir"
                cancelText="Continuar reserva"
            />
        </div>
    )
};