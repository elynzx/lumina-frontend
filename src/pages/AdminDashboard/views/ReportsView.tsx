import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { showAlert } from '@/utils/alert';
import logomark from '@/assets/logo/logomark.svg';

type Period = 'hoy' | 'semana' | 'mes' | 'año' | 'personalizado';

const COLOR_BLUE = '#084579';

const toRgb = (hex: string) => {
    const m = hex.replace('#', '');
    const r = parseInt(m.substring(0, 2), 16);
    const g = parseInt(m.substring(2, 4), 16);
    const b = parseInt(m.substring(4, 6), 16);
    return [r, g, b];
};

const formatLongDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatRangeLabel = (start: string, end: string) => {
    if (!start || !end) return '';
    return `Reporte del ${formatLongDate(start)} al ${formatLongDate(end)}`;
};

const loadLogoDataUrl = async (): Promise<string | null> => {
    let logoDataUrl: string | null = null;
    try {
        const resp = await fetch(logomark);
        const svgText = await resp.text();
        const svg64 = btoa(unescape(encodeURIComponent(svgText)));
        const imageSrc = `data:image/svg+xml;base64,${svg64}`;
        const img = new Image();
        img.src = imageSrc;
        await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
        });
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 100;
        canvas.height = img.height || 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            logoDataUrl = canvas.toDataURL('image/png');
        }
    } catch (error) {
        console.error('Error loading logo for report', error);
    }
    return logoDataUrl;
};

const createStyledReportDoc = async (_title: string, rangeText: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    const [r, g, b] = toRgb(COLOR_BLUE);
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 28, 'F');

    const logoDataUrl = await loadLogoDataUrl();
    if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', margin, 6, 14, 14);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Lumina Eventos', margin + (logoDataUrl ? 18 : 0), 16);

    const createdAt = new Date();
    const createdLabel = `Creado el ${createdAt.toLocaleDateString('es-ES')} ${createdAt.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(createdLabel, pageWidth - margin, 10, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(rangeText, margin, 40);

    return { doc, pageWidth, margin, contentStartY: 54 };
};

export const ReportsView = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('mes');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const adminService = useAdminService();

    useEffect(() => {
        // Establecer fechas por defecto para el mes actual
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const handlePeriodChange = (period: Period) => {
        setSelectedPeriod(period);
        const today = new Date();

        switch (period) {
            case 'hoy': {
                setStartDate(today.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            }
            case 'semana': {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                setStartDate(weekAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            }
            case 'mes': {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                setStartDate(firstDay.toISOString().split('T')[0]);
                setEndDate(lastDay.toISOString().split('T')[0]);
                break;
            }
            case 'año': {
                const firstDayYear = new Date(today.getFullYear(), 0, 1);
                const lastDayYear = new Date(today.getFullYear(), 11, 31);
                setStartDate(firstDayYear.toISOString().split('T')[0]);
                setEndDate(lastDayYear.toISOString().split('T')[0]);
                break;
            }
        }
    };

    const generateIngresosPDF = async () => {
        setLoading(true);
        try {
            const reservations = await adminService.getAllReservations();

            // Filtrar por período y estado confirmado
            const filteredReservations = reservations
                .filter(r => {
                    const reservationDate = new Date(r.reservationDate);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return reservationDate >= start && reservationDate <= end && r.status === 'CONFIRMED';
                })
                .sort((a, b) => {
                    const dateDiff = new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime();
                    if (dateDiff !== 0) return dateDiff;
                    return a.reservationId - b.reservationId;
                });

            const rangeLabel = formatRangeLabel(startDate, endDate);
            const { doc, pageWidth, margin, contentStartY } = await createStyledReportDoc('Reporte de Ingresos', rangeLabel);

            const totalIngresos = filteredReservations.reduce((sum, r) => sum + r.totalCost, 0);

            // Título grande y centrado encima de la tabla
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Ingresos', pageWidth / 2, contentStartY, { align: 'center' });

            // Subtítulo con total de reservas debajo del título
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const tableStartY = contentStartY + 8;
            doc.text(`Total de Reservas: ${filteredReservations.length}`, margin, tableStartY - 4);

            autoTable(doc, {
                startY: tableStartY,
                head: [['ID Reserva', 'Fecha', 'Local', 'Cliente', 'Monto']],
                body: filteredReservations.map(r => [
                    r.reservationId.toString(),
                    new Date(r.reservationDate).toLocaleDateString('es-PE'),
                    r.venueName || '',
                    r.customerName || '',
                    `S/ ${r.totalCost.toFixed(2)}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [16, 185, 129] }
            });

            // Total inmediatamente debajo de la tabla, alineado a la derecha
            const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? (tableStartY + 10);
            const totalLabel = `TOTAL INGRESOS: S/ ${totalIngresos.toFixed(2)}`;
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(totalLabel, pageWidth - margin, finalY + 8, { align: 'right' });

            doc.save(`reporte-ingresos-${startDate}-${endDate}.pdf`);

            await showAlert({
                title: 'Éxito',
                text: 'Reporte de ingresos generado correctamente',
                icon: 'success'
            });
        } catch (error) {
            console.error('Error al generar reporte:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo generar el reporte',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const generateReservasPDF = async () => {
        setLoading(true);
        try {
            const reservations = await adminService.getAllReservations();

            // Filtrar por período
            const filteredReservations = reservations.filter(r => {
                const reservationDate = new Date(r.reservationDate);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return reservationDate >= start && reservationDate <= end;
            });
            const totalReservasMonto = filteredReservations.reduce((sum, r) => sum + r.totalCost, 0);
            const rangeLabel = formatRangeLabel(startDate, endDate);
            const { doc, pageWidth, margin, contentStartY } = await createStyledReportDoc('Reporte de Reservas', rangeLabel);

            // Título grande y centrado
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Reservas', pageWidth / 2, contentStartY, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const reservasStatsY = contentStartY + 8;
            doc.text(`Total de Reservas: ${filteredReservations.length}`, margin, reservasStatsY);

            const confirmed = filteredReservations.filter(r => r.status === 'CONFIRMED').length;
            const pending = filteredReservations.filter(r => r.status === 'PENDING').length;
            const cancelled = filteredReservations.filter(r => r.status === 'CANCELLED').length;

            doc.text(`Confirmadas: ${confirmed} | Pendientes: ${pending} | Canceladas: ${cancelled}`, margin, reservasStatsY + 8);

            autoTable(doc, {
                startY: reservasStatsY + 16,
                head: [['ID Reserva', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Local', 'Cliente', 'Invitados', 'Estado', 'Monto']],
                body: filteredReservations.map(r => [
                    r.reservationId.toString(),
                    new Date(r.reservationDate).toLocaleDateString('es-PE'),
                    (r.startTime || '').slice(0, 5),
                    (r.endTime || '').slice(0, 5),
                    r.venueName || '',
                    r.customerName || '',
                    r.guestCount != null ? r.guestCount.toString() : '-',
                    r.status === 'CONFIRMED' ? 'Confirmada' : r.status === 'PENDING' ? 'Pendiente' : 'Cancelada',
                    `S/ ${r.totalCost.toFixed(2)}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] }
            });

            // Total de monto de reservas inmediatamente debajo de la tabla, alineado a la derecha
            const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? (reservasStatsY + 26);
            const totalLabel = `TOTAL MONTO RESERVAS: S/ ${totalReservasMonto.toFixed(2)}`;
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(totalLabel, pageWidth - margin, finalY + 8, { align: 'right' });

            doc.save(`reporte-reservas-${startDate}-${endDate}.pdf`);

            await showAlert({
                title: 'Éxito',
                text: 'Reporte de reservas generado correctamente',
                icon: 'success'
            });
        } catch (error) {
            console.error('Error al generar reporte:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo generar el reporte',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const generateClientesExcel = async () => {
        setLoading(true);
        try {
            const customers = await adminService.getAllCustomers();
            const reservations = await adminService.getAllReservations();

            // Calcular estadísticas por cliente
            const clientData = customers.map(customer => {
                const customerReservations = reservations.filter(r => r.customerName === `${customer.firstName} ${customer.lastName}`);
                const totalSpent = customerReservations.reduce((sum, r) => sum + r.totalCost, 0);

                return {
                    'ID': customer.userId,
                    'Nombre': customer.firstName,
                    'Apellido': customer.lastName,
                    'Email': customer.email,
                    'Teléfono': customer.phone || 'N/A',
                    'Total Reservas': customerReservations.length,
                    'Monto Total': `S/ ${totalSpent.toFixed(2)}`,
                    'Última Reserva': customerReservations.length > 0
                        ? new Date(customerReservations[customerReservations.length - 1].reservationDate).toLocaleDateString('es-PE')
                        : 'N/A'
                };
            });

            const ws = XLSX.utils.json_to_sheet(clientData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

            XLSX.writeFile(wb, `reporte-clientes-${new Date().toISOString().split('T')[0]}.xlsx`);

            await showAlert({
                title: 'Éxito',
                text: 'Reporte de clientes generado correctamente',
                icon: 'success'
            });
        } catch (error) {
            console.error('Error al generar reporte:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo generar el reporte',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const generateOcupacionPDF = async () => {
        setLoading(true);
        try {
            const venues = await adminService.getAllVenues();
            const reservations = await adminService.getAllReservations();

            // Filtrar por período
            const filteredReservations = reservations.filter(r => {
                const reservationDate = new Date(r.reservationDate);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return reservationDate >= start && reservationDate <= end;
            });
            const rangeLabel = formatRangeLabel(startDate, endDate);
            const { doc, pageWidth, contentStartY } = await createStyledReportDoc('Reporte de Ocupación', rangeLabel);

            // Título grande y centrado
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Reporte de Ocupación', pageWidth / 2, contentStartY, { align: 'center' });

            const tableStartY = contentStartY + 8;

            const venueOccupancy = venues.map(venue => {
                const venueReservations = filteredReservations.filter(r => r.venueName === venue.venueName);
                return {
                    venue: venue.venueName,
                    reservations: venueReservations.length,
                    revenue: venueReservations.reduce((sum, r) => sum + r.totalCost, 0)
                };
            }).sort((a, b) => b.reservations - a.reservations);

            const totalRevenue = venueOccupancy.reduce((sum, v) => sum + v.revenue, 0);

            autoTable(doc, {
                startY: tableStartY,
                head: [['Local', 'Reservas', 'Ingresos']],
                body: venueOccupancy.map(v => [
                    v.venue,
                    v.reservations.toString(),
                    `S/ ${v.revenue.toFixed(2)}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [139, 92, 246] }
            });

            // Total de ingresos por ocupación inmediatamente debajo de la tabla, alineado a la derecha
            const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? (tableStartY + 10);
            const totalLabel = `TOTAL INGRESOS POR OCUPACIÓN: S/ ${totalRevenue.toFixed(2)}`;
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(totalLabel, pageWidth - 14, finalY + 8, { align: 'right' });

            doc.save(`reporte-ocupacion-${startDate}-${endDate}.pdf`);

            await showAlert({
                title: 'Éxito',
                text: 'Reporte de ocupación generado correctamente',
                icon: 'success'
            });
        } catch (error) {
            console.error('Error al generar reporte:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo generar el reporte',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
                <p className="text-sm text-gray-500 mt-1">Genera y descarga reportes del sistema</p>
            </div>

            {/* Selector de Período - Diseño Minimalista */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-4">Período de Análisis</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => handlePeriodChange('hoy')}
                        className={`px-4 py-2 text-sm font-medium rounded transition ${selectedPeriod === 'hoy'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Hoy
                    </button>
                    <button
                        onClick={() => handlePeriodChange('semana')}
                        className={`px-4 py-2 text-sm font-medium rounded transition ${selectedPeriod === 'semana'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Última Semana
                    </button>
                    <button
                        onClick={() => handlePeriodChange('mes')}
                        className={`px-4 py-2 text-sm font-medium rounded transition ${selectedPeriod === 'mes'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Este Mes
                    </button>
                    <button
                        onClick={() => handlePeriodChange('año')}
                        className={`px-4 py-2 text-sm font-medium rounded transition ${selectedPeriod === 'año'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Este Año
                    </button>
                    <button
                        onClick={() => handlePeriodChange('personalizado')}
                        className={`px-4 py-2 text-sm font-medium rounded transition ${selectedPeriod === 'personalizado'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Personalizado
                    </button>
                </div>

                {/* Selector de fechas personalizado */}
                {selectedPeriod === 'personalizado' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Fecha Inicio</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Fecha Fin</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                        <span className="font-medium">Período:</span> {startDate} al {endDate}
                    </p>
                </div>
            </div>

            {/* Tarjetas de Reportes - Diseño Minimalista */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reporte de Ingresos */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reporte de Ingresos</h3>
                            <p className="text-xs text-gray-500 mt-1">Análisis financiero del período</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Detalle de ingresos con desglose por local y tipo de evento.
                    </p>
                    <button
                        onClick={generateIngresosPDF}
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </>
                        )}
                    </button>
                </div>

                {/* Reporte de Reservas */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reporte de Reservas</h3>
                            <p className="text-xs text-gray-500 mt-1">Listado completo del período</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Detalle de reservas con estado, cliente, local y montos.
                    </p>
                    <button
                        onClick={generateReservasPDF}
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </>
                        )}
                    </button>
                </div>

                {/* Reporte de Clientes */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reporte de Clientes</h3>
                            <p className="text-xs text-gray-500 mt-1">Base de datos completa</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Historial de reservas y estadísticas de consumo.
                    </p>
                    <button
                        onClick={generateClientesExcel}
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar Excel
                            </>
                        )}
                    </button>
                </div>

                {/* Reporte de Ocupación */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reporte de Ocupación</h3>
                            <p className="text-xs text-gray-500 mt-1">Análisis de locales</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Ocupación por local y horarios de mayor demanda.
                    </p>
                    <button
                        onClick={generateOcupacionPDF}
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
