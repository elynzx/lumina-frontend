import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Furniture, FurnitureCreateRequest } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

export const FurnitureView = () => {
    const [furniture, setFurniture] = useState<Furniture[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFurniture, setEditingFurniture] = useState<Furniture | null>(null);
    const [formData, setFormData] = useState<FurnitureCreateRequest>({
        furnitureName: '',
        description: '',
        pricePerUnit: 0,
        availableStock: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    const adminService = useAdminService();

    const loadFurniture = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllFurniture();
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.furnitureId - b.furnitureId);
            setFurniture(sortedData);
        } catch (error) {
            console.error('Error al cargar mobiliario:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo cargar el mobiliario',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFurniture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadFurniture();
            return;
        }
        try {
            setLoading(true);
            const data = await adminService.searchFurniture(searchTerm);
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.furnitureId - b.furnitureId);
            setFurniture(sortedData);
        } catch (error) {
            console.error('Error en búsqueda del backend, usando búsqueda local:', error);
            // Fallback: búsqueda local si el endpoint falla
            try {
                const allFurniture = await adminService.getAllFurniture();
                const searchLower = searchTerm.toLowerCase().trim();
                const filtered = allFurniture.filter(item => 
                    item.furnitureName?.toLowerCase().includes(searchLower) ||
                    item.description?.toLowerCase().includes(searchLower)
                );
                const sortedData = filtered.sort((a, b) => a.furnitureId - b.furnitureId);
                setFurniture(sortedData);
            } catch (fallbackError) {
                console.error('Error en búsqueda local:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingFurniture(null);
        setFormData({
            furnitureName: '',
            description: '',
            pricePerUnit: 0,
            availableStock: 0
        });
        setShowModal(true);
    };

    const handleEdit = (item: Furniture) => {
        setEditingFurniture(item);
        setFormData({
            furnitureName: item.furnitureName,
            description: item.description,
            pricePerUnit: item.pricePerUnit,
            availableStock: item.availableStock
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number, name: string) => {
        // Mostrar confirmación
        const confirmed = await showAlert({
            title: '¿Estás seguro?',
            text: `Se eliminará el mobiliario "${name}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await adminService.deleteFurniture(id);
            await showAlert({
                title: 'Eliminado',
                text: `El mobiliario "${name}" ha sido eliminado correctamente`,
                icon: 'success'
            });
            loadFurniture();
        } catch (error) {
            console.error('Error al eliminar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo eliminar el mobiliario. Puede que tenga reservas asociadas.',
                icon: 'error'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFurniture) {
                await adminService.updateFurniture(editingFurniture.furnitureId, formData);
                await showAlert({
                    title: 'Actualizado',
                    text: 'Mobiliario actualizado correctamente',
                    icon: 'success'
                });
            } else {
                await adminService.createFurniture(formData);
                await showAlert({
                    title: 'Creado',
                    text: 'Mobiliario creado correctamente',
                    icon: 'success'
                });
            }
            setShowModal(false);
            loadFurniture();
        } catch (error) {
            console.error('Error al guardar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo guardar el mobiliario',
                icon: 'error'
            });
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
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
                        placeholder="Buscar mobiliario..."
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
                        onClick={loadFurniture}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        Limpiar
                    </button>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                    + Nuevo Mobiliario
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-400 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Precio Unitario</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Stock Disponible</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {furniture.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No hay mobiliario registrado
                                </td>
                            </tr>
                        ) : (
                            furniture.map((item) => (
                                <tr key={item.furnitureId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.furnitureId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.furnitureName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(item.unitPrice)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.totalStock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.furnitureId, item.furnitureName)}
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
                                {editingFurniture ? 'Editar Mobiliario' : 'Nuevo Mobiliario'}
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
                                    Nombre del Mobiliario *
                                </label>
                                <input
                                    type="text"
                                    value={formData.furnitureName}
                                    onChange={(e) => setFormData({ ...formData, furnitureName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Sillas"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Sillas de plástico para eventos"
                                    required
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio Unitario (S/) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.pricePerUnit}
                                    onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Disponible *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.availableStock}
                                    onChange={(e) => setFormData({ ...formData, availableStock: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    required
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
                                    {editingFurniture ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

