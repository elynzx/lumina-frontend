import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Venue, VenueCreateRequest, District, EventType } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';
import { parseApiError } from '@/api/base';

export const VenuesView = () => {
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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadVenues();
            return;
        }

        try {
            setLoading(true);
            const data = await adminService.searchVenues(searchTerm);
            const sortedData = data.sort((a, b) => a.venueId - b.venueId);
            setVenues(sortedData);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        } finally {
            setLoading(false);
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
                districtId: venue.districtId
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
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Locales</h1>
                <p className="text-gray-600 mt-2">Administra los locales disponibles para eventos</p>
            </div>

            {/* Barra de búsqueda y botón agregar */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar local por nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Buscar
                    </button>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                loadVenues();
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    + Nuevo Local
                </button>
            </div>

            {/* Tabla de locales */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distrito</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {venues.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    No se encontraron locales
                                </td>
                            </tr>
                        ) : (
                            venues.map((venue) => (
                                <tr key={venue.venueId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venue.venueId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{venue.venueName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{venue.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venue.maxCapacity} personas</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(venue.pricePerHour)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{venue.districtName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <button
                                            onClick={() => handleOpenModal(venue)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(venue.venueId, venue.venueName)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
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
                        className="bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
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
                                            <span className="text-sm font-medium text-gray-700 mr-3">Disponible</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsAvailable(!isAvailable)}
                                                className={`relative inline-flex items-center w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                    isAvailable ? 'bg-blue-600' : 'bg-gray-300'
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
                                                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    {editingVenue ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
