import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { EventType, EventTypeCreateRequest } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

export const EventTypesView = () => {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEventType, setEditingEventType] = useState<EventType | null>(null);
    const [formData, setFormData] = useState<EventTypeCreateRequest>({
        eventTypeName: '',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const adminService = useAdminService();

    const loadEventTypes = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllEventTypes();
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.eventTypeId - b.eventTypeId);
            setEventTypes(sortedData);
        } catch (error) {
            console.error('Error al cargar tipos de evento:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudieron cargar los tipos de evento',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEventTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadEventTypes();
            return;
        }
        try {
            setLoading(true);
            const data = await adminService.searchEventTypes(searchTerm);
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.eventTypeId - b.eventTypeId);
            setEventTypes(sortedData);
        } catch (error) {
            console.error('Error en búsqueda del backend, usando búsqueda local:', error);
            // Fallback: búsqueda local si el endpoint falla
            try {
                const allEventTypes = await adminService.getAllEventTypes();
                const searchLower = searchTerm.toLowerCase().trim();
                const filtered = allEventTypes.filter(item => 
                    item.eventTypeName?.toLowerCase().includes(searchLower)
                );
                const sortedData = filtered.sort((a, b) => a.eventTypeId - b.eventTypeId);
                setEventTypes(sortedData);
            } catch (fallbackError) {
                console.error('Error en búsqueda local:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingEventType(null);
        setFormData({ eventTypeName: '', description: '' });
        setShowModal(true);
    };

    const handleEdit = (eventType: EventType) => {
        setEditingEventType(eventType);
        setFormData({ 
            eventTypeName: eventType.eventTypeName,
            description: eventType.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number, name: string) => {
        // Mostrar confirmación
        const confirmed = await showAlert({
            title: '¿Estás seguro?',
            text: `Se eliminará el tipo de evento "${name}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await adminService.deleteEventType(id);
            await showAlert({
                title: 'Eliminado',
                text: `El tipo de evento "${name}" ha sido eliminado correctamente`,
                icon: 'success'
            });
            loadEventTypes();
        } catch (error) {
            console.error('Error al eliminar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo eliminar el tipo de evento. Puede que tenga locales asociados.',
                icon: 'error'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEventType) {
                await adminService.updateEventType(editingEventType.eventTypeId, formData);
                await showAlert({
                    title: 'Actualizado',
                    text: 'Tipo de evento actualizado correctamente',
                    icon: 'success'
                });
            } else {
                await adminService.createEventType(formData);
                await showAlert({
                    title: 'Creado',
                    text: 'Tipo de evento creado correctamente',
                    icon: 'success'
                });
            }
            setShowModal(false);
            loadEventTypes();
        } catch (error) {
            console.error('Error al guardar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo guardar el tipo de evento',
                icon: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con búsqueda y botón crear */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar tipo de evento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={loadEventTypes}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        Limpiar
                    </button>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                    + Nuevo Tipo de Evento
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-400 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre del Tipo de Evento</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {eventTypes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No hay tipos de evento registrados
                                </td>
                            </tr>
                        ) : (
                            eventTypes.map((eventType) => (
                                <tr key={eventType.eventTypeId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{eventType.eventTypeId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{eventType.eventTypeName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{eventType.description || 'N/A'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(eventType)}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(eventType.eventTypeId, eventType.eventTypeName)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 flex items-center justify-center"
                    style={{ 
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingEventType ? 'Editar Tipo de Evento' : 'Nuevo Tipo de Evento'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Tipo de Evento *
                                </label>
                                <input
                                    type="text"
                                    value={formData.eventTypeName}
                                    onChange={(e) => setFormData({ ...formData, eventTypeName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Boda"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Eventos matrimoniales"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                                >
                                    {editingEventType ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

