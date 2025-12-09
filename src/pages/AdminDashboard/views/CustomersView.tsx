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

    // Búsqueda en tiempo real
    const filteredCustomers = customers.filter(customer => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase();
        return customer.firstName?.toLowerCase().includes(searchLower) ||
               customer.lastName?.toLowerCase().includes(searchLower) ||
               customer.email?.toLowerCase().includes(searchLower) ||
               customer.phone?.includes(searchTerm) ||
               customer.dni?.includes(searchTerm);
    });

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
        <div className="space-y-6 px-8 py-4">
            {/* Título y descripción */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
                <p className="text-gray-600 mt-1">Visualiza la base de clientes registrados en el sistema</p>
            </div>

            {/* Buscador */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar por nombre, DNI, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A61A3]"
                />
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#4A61A3]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Apellido</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">DNI</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Celular</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">Fecha de Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
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

