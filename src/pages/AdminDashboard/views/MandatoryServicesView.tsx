import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { Furniture } from '@/api/interfaces/admin';
import { showAlert } from '@/utils/alert';

// Constantes de servicios obligatorios que se pueden editar
interface MandatoryServiceConstant {
  key: string;
  name: string;
  price: number;
  description: string;
}

export const MandatoryServicesView = () => {
  const [loading, setLoading] = useState(true);
  const [mandatoryFurniture, setMandatoryFurniture] = useState<Furniture | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Constantes de servicios obligatorios (editables)
  const [services, setServices] = useState<MandatoryServiceConstant[]>([
    { key: 'limpieza', name: 'Limpieza', price: 300.00, description: 'Antes y después del alquiler' },
    { key: 'seguridad', name: 'Seguridad', price: 200.00, description: 'Durante el evento y en estacionamiento' },
    { key: 'serviciosBaño', name: 'Servicios de baño', price: 150.00, description: 'Limpieza y reposición de papel, jabón, etc.' },
    { key: 'garantia', name: 'Garantía', price: 1000.00, description: 'Reembolso si no hay daños' }
  ]);

  const adminService = useAdminService();

  // Calcular el total de servicios obligatorios
  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + service.price, 0);
  };

  const loadMandatoryService = async () => {
    try {
      setLoading(true);
      const allFurniture = await adminService.getAllFurniture();

      // Buscar el elemento "Servicios Obligatorios"
      const mandatory = allFurniture.find(
        item => item.furnitureName.toLowerCase() === 'servicios obligatorios'
      );

      if (mandatory) {
        setMandatoryFurniture(mandatory);

        // Si el precio unitario es diferente al total calculado, actualizar las constantes proporcionalmente
        const currentTotal = calculateTotal();
        if (mandatory.unitPrice !== currentTotal && currentTotal > 0) {
          const ratio = mandatory.unitPrice / currentTotal;
          setServices(prevServices =>
            prevServices.map(service => ({
              ...service,
              price: parseFloat((service.price * ratio).toFixed(2))
            }))
          );
        }
      } else {
        // Si no existe, sugerir crear el elemento
        await showAlert({
          title: 'Aviso',
          text: 'No existe el elemento "Servicios Obligatorios" en la base de datos. Por favor, créalo desde la vista de Mobiliarios.',
          icon: 'warning'
        });
      }
    } catch (error) {
      console.error('Error al cargar servicios obligatorios:', error);
      await showAlert({
        title: 'Error',
        text: 'No se pudo cargar los servicios obligatorios',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMandatoryService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleServicePriceChange = (key: string, newPrice: number) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.key === key ? { ...service, price: newPrice } : service
      )
    );
  };

  const handleSave = async () => {
    if (!mandatoryFurniture) {
      await showAlert({
        title: 'Error',
        text: 'No se encontró el elemento de Servicios Obligatorios',
        icon: 'error'
      });
      return;
    }

    try {
      const total = calculateTotal();

      // Actualizar el precio del elemento "Servicios Obligatorios" en la BD
      await adminService.updateFurniture(mandatoryFurniture.furnitureId, {
        furnitureName: mandatoryFurniture.furnitureName,
        description: mandatoryFurniture.description,
        unitPrice: total,
        totalStock: mandatoryFurniture.totalStock,
        photoUrl: mandatoryFurniture.photoUrl || ''
      });

      await showAlert({
        title: 'Actualizado',
        text: `Total de Servicios Obligatorios actualizado a S/ ${total.toFixed(2)}`,
        icon: 'success'
      });

      setIsEditing(false);
      loadMandatoryService();
    } catch (error) {
      console.error('Error al actualizar:', error);
      await showAlert({
        title: 'Error',
        text: 'No se pudo actualizar los servicios obligatorios',
        icon: 'error'
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadMandatoryService(); // Recargar para resetear cambios
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

  if (!mandatoryFurniture) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontró Servicios Obligatorios</h3>
          <p className="mt-1 text-sm text-gray-500">
            Por favor, crea un elemento llamado "Servicios Obligatorios" desde la vista de Mobiliarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Servicios Obligatorios</h2>
          <p className="text-sm text-gray-600 mt-1">
            Actualiza los precios de los componentes. El total se guardará como "Servicios Obligatorios".
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-blue transition font-semibold"
          >
            Editar Precios
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* Tabla de servicios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Servicio</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.key} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={service.price}
                        onChange={(e) => handleServicePriceChange(service.key, parseFloat(e.target.value) || 0)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold">{formatPrice(service.price)}</span>
                  )}
                </td>
              </tr>
            ))}
            {/* Fila de total */}
            <tr className="bg-gray-100">
              <td colSpan={2} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                TOTAL:
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="text-lg font-bold text-blue">
                  {formatPrice(calculateTotal())}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
