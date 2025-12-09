import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { District, DistrictCreateRequest } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

export const DistrictsView = () => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
    const [formData, setFormData] = useState<DistrictCreateRequest>({
        districtName: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const adminService = useAdminService();

    const loadDistricts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllDistricts();
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.districtId - b.districtId);
            setDistricts(sortedData);
        } catch (error) {
            console.error('Error al cargar distritos:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudieron cargar los distritos',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Búsqueda en tiempo real
    const filteredDistricts = districts.filter(district => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return district.districtName?.toLowerCase().includes(searchLower);
    });

    const handleCreate = () => {
        setEditingDistrict(null);
        setFormData({ districtName: '' });
        setShowModal(true);
    };

    const handleEdit = (district: District) => {
        setEditingDistrict(district);
        setFormData({ districtName: district.districtName });
        setShowModal(true);
    };

    const handleDelete = async (id: number, name: string) => {
        // Mostrar confirmación
        const confirmed = await showAlert({
            title: '¿Estás seguro?',
            text: `Se eliminará el distrito "${name}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) {
            return;
        }

        try {
            await adminService.deleteDistrict(id);
            await showAlert({
                title: 'Eliminado',
                text: `El distrito "${name}" ha sido eliminado correctamente`,
                icon: 'success'
            });
            loadDistricts();
        } catch (error) {
            console.error('Error al eliminar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo eliminar el distrito. Puede que tenga locales asociados.',
                icon: 'error'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDistrict) {
                await adminService.updateDistrict(editingDistrict.districtId, formData);
                await showAlert({
                    title: 'Actualizado',
                    text: 'Distrito actualizado correctamente',
                    icon: 'success'
                });
            } else {
                await adminService.createDistrict(formData);
                await showAlert({
                    title: 'Creado',
                    text: 'Distrito creado correctamente',
                    icon: 'success'
                });
            }
            setShowModal(false);
            loadDistricts();
        } catch (error) {
            console.error('Error al guardar:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudo guardar el distrito',
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
                <h2 className="text-2xl font-bold text-gray-800">Distritos</h2>
                <p className="text-gray-600 mt-1">Gestiona los distritos donde se ubican los locales</p>
            </div>

            {/* Buscador y botón nuevo */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar distrito..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A61A3]"
                />
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-[#4A61A3] text-white rounded-lg hover:bg-[#3d5087] transition font-semibold whitespace-nowrap"
                >
                    + Nuevo Distrito
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#4A61A3]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre del Distrito</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredDistricts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay distritos registrados'}
                                </td>
                            </tr>
                        ) : (
                            filteredDistricts.map((district) => (
                                <tr key={district.districtId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{district.districtId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{district.districtName}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(district)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(district.districtId, district.districtName)}
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
                                {editingDistrict ? 'Editar Distrito' : 'Nuevo Distrito'}
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
                                    Nombre del Distrito *
                                </label>
                                <input
                                    type="text"
                                    value={formData.districtName}
                                    onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Miraflores"
                                    required
                                    autoFocus
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
                                    {editingDistrict ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
