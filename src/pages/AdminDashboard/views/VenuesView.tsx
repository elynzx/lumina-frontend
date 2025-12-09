import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Venue, VenueCreateRequest, District, EventType } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';
import { parseApiError } from '@/api/base';
import { DistrictsView } from './DistrictsView';
import { EventTypesView } from './EventTypesView';

type SubView = 'venues' | 'districts' | 'event-types';

export const VenuesView = () => {
    const [activeSubView, setActiveSubView] = useState<SubView>('venues');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState<VenueCreateRequest>({
        venueName: '',
        address: '',
        maxCapacity: 0,
        pricePerHour: 0,
        description: '',
        districtId: 0
    });

    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState<number[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    
    const [districts, setDistricts] = useState<District[]>([]);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);

    const adminService = useAdminService();

    const loadVenues = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllVenues();
            const sortedData = data.sort((a, b) => a.venueId - b.venueId);
            setVenues(sortedData);
        } catch (error) {
            console.error('Error al cargar locales:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudieron cargar los locales',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVenues();
        loadDistricts();
        loadEventTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Búsqueda en tiempo real
    const filteredVenues = venues.filter(venue => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return venue.venueName?.toLowerCase().includes(searchLower) ||
               venue.address?.toLowerCase().includes(searchLower) ||
               venue.districtName?.toLowerCase().includes(searchLower);
    });

    const loadDistricts = async () => {
        try {
            const data = await adminService.getAllDistricts();
            setDistricts(data);
        } catch (error) {
            console.error('Error al cargar distritos:', error);
        }
    };

    const loadEventTypes = async () => {
        try {
            const data = await adminService.getAllEventTypes();
            setEventTypes(data);
        } catch (error) {
            console.error('Error al cargar tipos de evento:', error);
        }
    };

    const handleOpenModal = (venue?: Venue) => {
        if (venue) {
            setEditingVenue(venue);
            setFormData({
                venueName: venue.venueName,
                address: venue.address,
                maxCapacity: venue.maxCapacity,
                pricePerHour: venue.pricePerHour,
                description: venue.description || '',
                districtId: venue.districtId,
                latitude: venue.latitude,
                longitude: venue.longitude,
                googleMapsUrl: venue.googleMapsUrl
            });
            // Cargar fotos y tipos de evento existentes
            setPhotoUrls(venue.photos ? venue.photos.split(',').filter(p => p.trim()) : []);
            setSelectedEventTypes(venue.availableEventTypeIds ? venue.availableEventTypeIds.split(',').map(id => parseInt(id.trim())) : []);
            setIsAvailable(venue.status === 'AVAILABLE');
        } else {
            setEditingVenue(null);
            setFormData({
                venueName: '',
                address: '',
                maxCapacity: 0,
                pricePerHour: 0,
                description: '',
                districtId: 0
            });
            setPhotoUrls([]);
            setSelectedEventTypes([]);
            setIsAvailable(true);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.venueName.trim() || !formData.address.trim() || formData.maxCapacity <= 0 || formData.pricePerHour <= 0 || formData.districtId <= 0) {
            await showAlert({
                title: 'Error',
                text: 'Por favor complete todos los campos correctamente',
                icon: 'error'
            });
            return;
        }

        try {
            if (editingVenue) {
                // Preparar datos de actualización con status, fotos y tipos de evento
                const updateData = {
                    ...formData,
                    status: isAvailable ? 'AVAILABLE' : 'UNAVAILABLE',
                    photos: photoUrls.filter(url => url.trim()).join(','),
                    availableEventTypes: selectedEventTypes.join(',')
                };
                await adminService.updateVenue(editingVenue.venueId, updateData);
                await showAlert({
                    title: 'Éxito',
                    text: 'Local actualizado correctamente',
                    icon: 'success'
                });
            } else {
                await adminService.createVenue(formData);
                await showAlert({
                    title: 'Éxito',
                    text: 'Local creado correctamente',
                    icon: 'success'
                });
            }
            setShowModal(false);
            loadVenues();
        } catch (error) {
            console.error('Error al guardar local:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo guardar el local',
                icon: 'error'
            });
        }
    };

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await showAlert({
            title: '¿Eliminar local?',
            text: `¿Estás seguro de que deseas eliminar "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await adminService.deleteVenue(id);
            await showAlert({
                title: 'Eliminado',
                text: 'Local eliminado correctamente',
                icon: 'success'
            });
            loadVenues();
        } catch (error) {
            console.error('Error al eliminar local:', error);
            const apiError = error instanceof Error ? parseApiError(error) : { message: 'No se pudo eliminar el local' };
            await showAlert({
                title: 'Error',
                text: apiError.message,
                icon: 'error'
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="px-8 py-4">
            {/* Sub-navegación */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveSubView('venues')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeSubView === 'venues'
                            ? 'text-[#FF5050] border-b-2 border-[#FF5050]'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Locales
                </button>
                <button
                    onClick={() => setActiveSubView('districts')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeSubView === 'districts'
                            ? 'text-[#FF5050] border-b-2 border-[#FF5050]'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Distritos
                </button>
                <button
                    onClick={() => setActiveSubView('event-types')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeSubView === 'event-types'
                            ? 'text-[#FF5050] border-b-2 border-[#FF5050]'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Tipos de Evento
                </button>
            </div>

            {/* Renderizar vista según sub-navegación */}
            {activeSubView === 'districts' && <DistrictsView />}
            {activeSubView === 'event-types' && <EventTypesView />}
            {activeSubView === 'venues' && (
            <>
            {/* Título y descripción */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Locales para Eventos</h2>
                <p className="text-gray-600 mt-1">Gestiona los locales disponibles para alquiler</p>
            </div>

            {/* Buscador y botón nuevo */}
            <div className="mb-6 flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar local por nombre, dirección o distrito..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A61A3]"
                />
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-2 bg-[#4A61A3] text-white rounded-lg hover:bg-[#3d5087] transition font-semibold whitespace-nowrap"
                >
                    + Nuevo Local
                </button>
            </div>

            {/* Tabla de locales */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#4A61A3]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Dirección</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Capacidad</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Precio/Hora</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Distrito</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredVenues.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay locales registrados'}
                                </td>
                            </tr>
                        ) : (
                            filteredVenues.map((venue) => (
                                <tr key={venue.venueId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venue.venueId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{venue.venueName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{venue.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venue.maxCapacity} personas</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(venue.pricePerHour)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{venue.districtName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => handleOpenModal(venue)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(venue.venueId, venue.venueName)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5 text-[#FF5050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

            {/* Modal para crear/editar */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center overflow-y-auto"
                    style={{
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-16 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingVenue ? 'Editar Local' : 'Nuevo Local'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-8">
                                {/* COLUMNA IZQUIERDA */}
                                <div className="space-y-4">
                                    {/* Área de Fotos */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Fotos del Local
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[0, 1, 2].map((index) => (
                                                <div key={index} className="relative">
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-24 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                                                        {photoUrls[index] ? (
                                                            <div className="relative w-full h-full">
                                                                <img src={photoUrls[index]} alt={`Foto ${index + 1}`} className="w-full h-full object-cover rounded" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newUrls = [...photoUrls];
                                                                        newUrls.splice(index, 1);
                                                                        setPhotoUrls(newUrls);
                                                                    }}
                                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <input
                                                                    type="text"
                                                                    placeholder="URL"
                                                                    className="w-full text-xs text-center border-0 bg-transparent focus:outline-none"
                                                                    onBlur={(e) => {
                                                                        if (e.target.value.trim()) {
                                                                            const newUrls = [...photoUrls];
                                                                            newUrls[index] = e.target.value.trim();
                                                                            setPhotoUrls(newUrls);
                                                                            e.target.value = '';
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.venueName}
                                            onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Aforo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Aforo *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.maxCapacity}
                                            onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Distrito */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Distrito *
                                        </label>
                                        <select
                                            value={formData.districtId}
                                            onChange={(e) => setFormData({ ...formData, districtId: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value={0}>Selecciona un distrito</option>
                                            {districts.map((district) => (
                                                <option key={district.districtId} value={district.districtId}>
                                                    {district.districtName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Precio por Hora */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio por Hora (S/) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.pricePerHour}
                                            onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Disponible */}
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 mr-3">Estado: Activo</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsAvailable(!isAvailable)}
                                                className={`relative inline-flex items-center w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                    isAvailable ? 'bg-blue' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                                                        isAvailable ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA */}
                                <div className="space-y-4">
                                    {/* Tipo de Evento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Evento *
                                        </label>
                                        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                            {eventTypes.map((eventType) => (
                                                <label key={eventType.eventTypeId} className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEventTypes.includes(eventType.eventTypeId)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedEventTypes([...selectedEventTypes, eventType.eventTypeId]);
                                                            } else {
                                                                setSelectedEventTypes(selectedEventTypes.filter(id => id !== eventType.eventTypeId));
                                                            }
                                                        }}
                                                        className="mr-3 h-4 w-4 text-blue border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{eventType.eventTypeName}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubicación del Local (Opcional)</h3>
                                
                                <div className="grid grid-cols-2 gap-8">

                                    <div className="space-y-4">
                                        {/* Latitud */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Latitud
                                            </label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                placeholder="-12.111627"
                                                value={formData.latitude || ''}
                                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Longitud */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Longitud
                                            </label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                placeholder="-77.021151"
                                                value={formData.longitude || ''}
                                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* URL de Google Maps */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                URL de Google Maps Embed
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                value={formData.googleMapsUrl || ''}
                                                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value || undefined })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 h-fit">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-blue-900 mb-3">Cómo obtener las coordenadas y mapa:</p>
                                                <ol className="list-decimal ml-4 space-y-2 text-xs text-blue-800">
                                                    <li>
                                                        Ve a <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-blue underline hover:text-blue-800 font-medium">Google Maps</a>
                                                    </li>
                                                    <li>Busca la dirección del local</li>
                                                    <li>Haz <strong>clic derecho</strong> en el marcador del local</li>
                                                    <li>
                                                        Las coordenadas aparecen arriba
                                                        <br />
                                                        <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 text-xs">-12.111627, -77.021151</code>
                                                        <br />
                                                        Cópialas por separado en los campos
                                                    </li>
                                                    <li>
                                                        Para el mapa: Click en <strong>"Compartir"</strong> → <strong>"Insertar un mapa"</strong>
                                                        <br />
                                                        Copia el <strong>URL</strong> del <code className="bg-blue-100 px-1 py-0.5 rounded">&lt;iframe src="..."&gt;</code>
                                                    </li>
                                                </ol>
                                                <p className="text-xs text-blue-700 mt-3 italic bg-blue-100 p-2 rounded">
                                                    💡 La ubicación mejora la experiencia del cliente al mostrar un mapa interactivo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-12 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-12 py-3 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition"
                                >
                                    {editingVenue ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </>
            )}
        </div>
    );
};
