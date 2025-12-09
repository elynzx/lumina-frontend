import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Reservation } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';
import { ReservationDetailModal } from './ReservationDetailModal';

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
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

    const adminService = useAdminService();

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllReservations();
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
        return timeString.substring(0, 5);
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toFixed(2)}`;
    };

    const handleViewDetail = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const handleViewReceipt = (receiptUrl: string) => {
        setSelectedReceiptUrl(receiptUrl);
        setShowReceiptModal(true);
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
                                ? 'bg-admin-primary text-white'
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
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Confirmadas ({reservations.filter(r => r.status === 'CONFIRMED').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('CANCELLED')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === 'CANCELLED'
                                ? 'bg-admin-secondary text-white'
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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#4A61A3]">
                            <tr>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">ID</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Fecha</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Local</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Cliente</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Tipo Evento</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Horario</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Invitados</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Total</th>
                                <th className="px-4 py-4 text-left text-sm font-semibold text-white">Estado</th>
                                <th className="px-4 py-4 text-center text-sm font-semibold text-white">Acciones</th>
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
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleViewDetail(reservation)}
                                                    className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver detalle completo"
                                                >
                                                    <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
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
                <ReservationDetailModal 
                    reservation={selectedReservation}
                    onClose={() => setShowDetailModal(false)}
                    onStatusChange={handleChangeStatus}
                    onViewReceipt={handleViewReceipt}
                />
            )}

            {/* Modal para Ver Comprobante */}
            {showReceiptModal && selectedReceiptUrl && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{ 
                        zIndex: 10000,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }}
                    onClick={() => setShowReceiptModal(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Comprobante de Pago</h3>
                            <button
                                onClick={() => setShowReceiptModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <img 
                                src={selectedReceiptUrl} 
                                alt="Comprobante de pago" 
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                            <div className="mt-4 flex justify-end gap-3">
                                <a
                                    href={selectedReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-secondary transition"
                                >
                                    Abrir en nueva pestaña
                                </a>
                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
