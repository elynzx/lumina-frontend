import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Furniture, FurnitureCreateRequest } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

export const AdditionalServicesView = () => {
    const [furniture, setFurniture] = useState<Furniture[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFurniture, setEditingFurniture] = useState<Furniture | null>(null);
    const [formData, setFormData] = useState<FurnitureCreateRequest>({
        furnitureName: '',
        description: '',
        totalStock: 0,
        unitPrice: 0,
        photoUrl: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const adminService = useAdminService();

    // Filtrar solo servicios adicionales (no contienen mesa/silla y no son "Servicios Obligatorios")
    const filterAdditionalServices = (items: Furniture[]) => {
        return items.filter(item => {
            const name = item.furnitureName.toLowerCase();
            const isFurniture = name.includes('mesa') || name.includes('silla');
            const isMandatory = name === 'servicios obligatorios';
            return !isFurniture && !isMandatory;
        });
    };

    const loadFurniture = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllFurniture();
            const filtered = filterAdditionalServices(data);
            const sortedData = filtered.sort((a, b) => a.furnitureId - b.furnitureId);
            setFurniture(sortedData);
        } catch (error) {
            console.error('Error al cargar servicios adicionales:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo cargar los servicios adicionales',
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

    // Búsqueda en tiempo real
    const filteredFurniture = furniture.filter(item => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return item.furnitureName?.toLowerCase().includes(searchLower) ||
               item.description?.toLowerCase().includes(searchLower);
    });

    const handleCreate = () => {
        setEditingFurniture(null);
        setFormData({
            furnitureName: '',
            description: '',
            totalStock: 0,
            unitPrice: 0,
            photoUrl: ''
        });
        setShowModal(true);
    };

    const handleEdit = (item: Furniture) => {
        setEditingFurniture(item);
        setFormData({
            furnitureName: item.furnitureName,
            description: item.description,
            totalStock: item.totalStock,
            unitPrice: item.unitPrice,
            photoUrl: item.photoUrl || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await showAlert({
            title: '¿Estás seguro?',
            text: `Se eliminará el servicio "${name}". Esta acción no se puede deshacer.`,
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
                text: `El servicio "${name}" ha sido eliminado correctamente`,
                icon: 'success'
            });
            loadFurniture();
        } catch (error) {
            console.error('Error al eliminar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo eliminar el servicio. Puede que tenga reservas asociadas.',
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
                    text: 'Servicio adicional actualizado correctamente',
                    icon: 'success'
                });
            } else {
                await adminService.createFurniture(formData);
                await showAlert({
                    title: 'Creado',
                    text: 'Servicio adicional creado correctamente',
                    icon: 'success'
                });
            }
            setShowModal(false);
            loadFurniture();
        } catch (error) {
            console.error('Error al guardar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo guardar el servicio adicional',
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
            {/* Título y descripción */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Servicios Adicionales</h2>
                <p className="text-gray-600 mt-1">Gestiona servicios extra como decoración, catering y más</p>
            </div>

            {/* Buscador y botón nuevo */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar servicio adicional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A61A3]"
                />
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-[#4A61A3] text-white rounded-lg hover:bg-[#3d5087] transition font-semibold whitespace-nowrap"
                >
                    + Nuevo Servicio Adicional
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#4A61A3]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Descripción</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Precio Unitario</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredFurniture.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay servicios adicionales registrados'}
                                </td>
                            </tr>
                        ) : (
                            filteredFurniture.map((item) => (
                                <tr key={item.furnitureId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.furnitureId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.furnitureName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(item.unitPrice)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.furnitureId, item.furnitureName)}
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
                        className="bg-white rounded-lg shadow-xl p-12 max-w-3xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingFurniture ? 'Editar Servicio Adicional' : 'Nuevo Servicio Adicional'}
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
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6">
                                {/* COLUMNA IZQUIERDA: Foto */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Foto del Servicio
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 aspect-square flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                                            {formData.photoUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={formData.photoUrl} alt="Vista previa" className="w-full h-full object-cover rounded" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, photoUrl: '' })}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="URL de imagen"
                                                        className="w-full text-xs text-center border-0 bg-transparent focus:outline-none"
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim()) {
                                                                setFormData({ ...formData, photoUrl: e.target.value.trim() });
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA: Información */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Servicio *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.furnitureName}
                                            onChange={(e) => setFormData({ ...formData, furnitureName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Ej: DJ"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Ej: Servicio de DJ profesional"
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
                                            value={formData.unitPrice}
                                            onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6 mt-6 border-t">
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
