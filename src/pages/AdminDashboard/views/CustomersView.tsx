import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Customer } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

export const CustomersView = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const adminService = useAdminService();

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllCustomers();
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.userId - b.userId);
            setCustomers(sortedData);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            await showAlert({
                title: 'Error',
                text: 'No se pudieron cargar los clientes',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadCustomers();
            return;
        }
        try {
            setLoading(true);
            const data = await adminService.searchCustomers(searchTerm);
            // Ordenar por ID ascendente
            const sortedData = data.sort((a, b) => a.userId - b.userId);
            setCustomers(sortedData);
        } catch (error) {
            console.error('Error en búsqueda del backend, usando búsqueda local:', error);
            // Fallback: búsqueda local si el endpoint falla
            try {
                const allCustomers = await adminService.getAllCustomers();
                const searchLower = searchTerm.toLowerCase().trim();
                const filtered = allCustomers.filter(customer => 
                    customer.firstName?.toLowerCase().includes(searchLower) ||
                    customer.lastName?.toLowerCase().includes(searchLower) ||
                    customer.email?.toLowerCase().includes(searchLower) ||
                    customer.phone?.includes(searchTerm) ||
                    customer.dni?.includes(searchTerm)
                );
                const sortedData = filtered.sort((a, b) => a.userId - b.userId);
                setCustomers(sortedData);
            } catch (fallbackError) {
                console.error('Error en búsqueda local:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return dateString;
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
            {/* Header con búsqueda */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
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
                        onClick={loadCustomers}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-400 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Apellido</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">DNI</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Celular</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Fecha de Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No hay clientes registrados
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.userId}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{customer.firstName}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{customer.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.dni}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(customer.registrationDate)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

