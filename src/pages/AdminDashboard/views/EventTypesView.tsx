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

    // Búsqueda en tiempo real
    const filteredEventTypes = eventTypes.filter(eventType => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return eventType.eventTypeName?.toLowerCase().includes(searchLower) ||
               eventType.description?.toLowerCase().includes(searchLower);
    });

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
            {/* Título y descripción */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Tipos de Evento</h2>
                <p className="text-gray-600 mt-1">Gestiona los tipos de eventos disponibles para los locales</p>
            </div>

            {/* Buscador y botón nuevo */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar tipo de evento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A61A3]"
                />
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-[#4A61A3] text-white rounded-lg hover:bg-[#3d5087] transition font-semibold whitespace-nowrap"
                >
                    + Nuevo Tipo de Evento
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#4A61A3]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre del Tipo de Evento</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Descripción</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredEventTypes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay tipos de evento registrados'}
                                </td>
                            </tr>
                        ) : (
                            filteredEventTypes.map((eventType) => (
                                <tr key={eventType.eventTypeId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{eventType.eventTypeId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{eventType.eventTypeName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{eventType.description || 'N/A'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(eventType)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(eventType.eventTypeId, eventType.eventTypeName)}
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
                                    className="flex-1 px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-blue transition font-medium"
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

