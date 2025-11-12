import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Reservation } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
};

export const ReservationsView = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const adminService = useAdminService();

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllReservations();
            // Ordenar por ID ascendente (1, 2, 3...)
            const sortedData = data.sort((a, b) => a.reservationId - b.reservationId);
            setReservations(sortedData);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudieron cargar las reservas',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeStatus = async (reservationId: number, newStatus: ReservationStatus) => {
        const confirmed = await showAlert({
            title: '¿Cambiar estado?',
            text: `¿Deseas cambiar el estado de esta reserva a "${statusConfig[newStatus].label}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await adminService.updateReservationStatus(reservationId, newStatus);
            
            await showAlert({
                title: 'Estado actualizado',
                text: 'El estado de la reserva ha sido actualizado correctamente',
                icon: 'success'
            });
            loadReservations();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo actualizar el estado de la reserva',
                icon: 'error'
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.substring(0, 5); // HH:mm
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toFixed(2)}`;
    };

    const handleViewDetail = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const filteredReservations = filterStatus === 'ALL' 
        ? reservations 
        : reservations.filter(r => r.status === filterStatus);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus('ALL')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === 'ALL'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Todas ({reservations.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('PENDING')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === 'PENDING'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Pendientes ({reservations.filter(r => r.status === 'PENDING').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('CONFIRMED')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === 'CONFIRMED'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Confirmadas ({reservations.filter(r => r.status === 'CONFIRMED').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('CANCELLED')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === 'CANCELLED'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Canceladas ({reservations.filter(r => r.status === 'CANCELLED').length})
                    </button>
                </div>
                <button
                    onClick={loadReservations}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualizar
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-400 text-white">
                            <tr>
                                <th className="px-4 py-4 text-left text-sm font-semibold">ID</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Fecha</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Local</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Cliente</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Tipo Evento</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Horario</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Invitados</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Total</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold">Estado</th>
                                <th className="px-4 py-4 text-center text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                                        No hay reservas {filterStatus !== 'ALL' ? statusConfig[filterStatus as ReservationStatus].label.toLowerCase() : 'registradas'}
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.reservationId} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm text-gray-900">{reservation.reservationId}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {formatDate(reservation.reservationDate)}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                            {reservation.venueName || `Local #${reservation.venueId}`}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {reservation.customerName || `Usuario #${reservation.userId}`}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {reservation.eventTypeName || `Evento #${reservation.eventTypeId}`}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 text-center">
                                            {reservation.guestCount}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                            {formatCurrency(reservation.totalCost)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[reservation.status as ReservationStatus].color}`}>
                                                {statusConfig[reservation.status as ReservationStatus].label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleViewDetail(reservation)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs flex items-center gap-1"
                                                    title="Ver detalle"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Detalle
                                                </button>
                                                {reservation.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleChangeStatus(reservation.reservationId, 'CONFIRMED')}
                                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                                                            title="Confirmar"
                                                        >
                                                            ✓ Confirmar
                                                        </button>
                                                        <button
                                                            onClick={() => handleChangeStatus(reservation.reservationId, 'CANCELLED')}
                                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                                                            title="Cancelar"
                                                        >
                                                            ✗ Cancelar
                                                        </button>
                                                    </>
                                                )}
                                                {reservation.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleChangeStatus(reservation.reservationId, 'CANCELLED')}
                                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                                                        title="Cancelar"
                                                    >
                                                        ✗ Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalle */}
            {showDetailModal && selectedReservation && (
                <div 
                    className="fixed inset-0 flex items-center justify-center overflow-y-auto"
                    style={{ 
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={() => setShowDetailModal(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full mx-4 my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Detalle de Reserva #{selectedReservation.reservationId}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Creada el {formatDate(selectedReservation.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Estado */}
                        <div className="mb-6">
                            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusConfig[selectedReservation.status as ReservationStatus].color}`}>
                                {statusConfig[selectedReservation.status as ReservationStatus].label}
                            </span>
                        </div>

                        {/* Información en Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Columna Izquierda */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Local</h3>
                                    <p className="text-base font-semibold text-gray-900">{selectedReservation.venueName}</p>
                                    <p className="text-sm text-gray-600">{selectedReservation.venueAddress}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Tipo de Evento</h3>
                                    <p className="text-base text-gray-900">{selectedReservation.eventTypeName}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Fecha del Evento</h3>
                                    <p className="text-base text-gray-900">{formatDate(selectedReservation.reservationDate)}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Horario</h3>
                                    <p className="text-base text-gray-900">
                                        {formatTime(selectedReservation.startTime)} - {formatTime(selectedReservation.endTime)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Cantidad de Invitados</h3>
                                    <p className="text-base text-gray-900">{selectedReservation.guestCount} personas</p>
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Cliente</h3>
                                    <p className="text-base font-semibold text-gray-900">{selectedReservation.customerName}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Email</h3>
                                    <p className="text-base text-gray-900">{selectedReservation.customerEmail}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Teléfono</h3>
                                    <p className="text-base text-gray-900">{selectedReservation.customerPhone}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Costos</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Costo del Local:</span>
                                            <span className="font-semibold">{formatCurrency(selectedReservation.venueCost)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Costo de Mobiliario:</span>
                                            <span className="font-semibold">{formatCurrency(selectedReservation.furnitureCost)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                            <span>Total:</span>
                                            <span className="text-blue-600">{formatCurrency(selectedReservation.totalCost)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobiliario (si existe) */}
                        {selectedReservation.furnitureItems && selectedReservation.furnitureItems.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mobiliario Solicitado</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-600">
                                                <th className="pb-2">Artículo</th>
                                                <th className="pb-2 text-center">Cantidad</th>
                                                <th className="pb-2 text-right">Precio Unit.</th>
                                                <th className="pb-2 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {selectedReservation.furnitureItems.map((item, index) => (
                                                <tr key={index} className="border-t border-gray-200">
                                                    <td className="py-2">{item.furnitureName}</td>
                                                    <td className="py-2 text-center">{item.quantity}</td>
                                                    <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="py-2 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cerrar
                            </button>
                            {selectedReservation.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleChangeStatus(selectedReservation.reservationId, 'CONFIRMED');
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    >
                                        ✓ Confirmar Reserva
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleChangeStatus(selectedReservation.reservationId, 'CANCELLED');
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        ✗ Cancelar Reserva
                                    </button>
                                </>
                            )}
                            {selectedReservation.status === 'CONFIRMED' && (
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        handleChangeStatus(selectedReservation.reservationId, 'CANCELLED');
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    ✗ Cancelar Reserva
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
