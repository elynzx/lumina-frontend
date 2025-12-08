interface CustomerInfoCardProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export const CustomerInfoCard = ({
  customerName,
  customerPhone,
  customerEmail,
}: CustomerInfoCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">Datos del Cliente</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-gray-600">Nombre</p>
          <p className="font-semibold">{customerName}</p>
        </div>
        <div>
          <p className="text-gray-600">Teléfono</p>
          <p className="font-semibold">{customerPhone}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p className="font-semibold break-all">{customerEmail}</p>
        </div>
      </div>
    </div>
  );
};
