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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadDistricts();
            return;
        }
        try {
            const data = await adminService.searchDistricts(searchTerm);
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.districtId - b.districtId);
            setDistricts(sortedData);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    };

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
            {/* Header con búsqueda y botón crear */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar distrito..."
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
                        onClick={loadDistricts}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        Limpiar
                    </button>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                    + Nuevo Distrito
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-400 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre del Distrito</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {districts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No hay distritos registrados
                                </td>
                            </tr>
                        ) : (
                            districts.map((district) => (
                                <tr key={district.districtId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{district.districtId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{district.districtName}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(district)}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(district.districtId, district.districtName)}
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
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
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
