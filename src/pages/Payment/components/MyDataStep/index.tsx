import { useState } from "react";
import { Button } from "@/components/atomic/Button";
import editIcon from "@/assets/icons/edit.svg";

interface MyDataStepProps {
  userData?: {
    email: string;
    nombres: string;
    apellidos: string;
    dni: string;
    celular: string;
  }
}

export const MyDataStep = ({ userData = {
  email: "usuario@example.com",
  nombres: "Juan",
  apellidos: "Pérez",
  dni: "12345678",
  celular: "987654321"
} }: MyDataStepProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Datos guardados:', formData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Mis Datos</h2>
          <p className="text-xs text-gray-600">Actualiza tus datos para continuar</p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-blue font-semibold text-xs whitespace-nowrap mr-12"
        >
          <img src={editIcon} alt="Editar" className="w-4 h-4" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="flex justify-center items-start gap-6 mt-4">
        <form className="flex flex-col gap-4 max-w-lg w-full">

          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold w-16 ">Correo:</label>
            <input
              className="flex-1 text-xs border-b border-gray-300 pb-1 focus:outline-none focus:border-blue disabled:bg-transparent disabled:cursor-not-allowed"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="usuario@example.com"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold w-16 shrink-0">Nombres:</label>
            <input
              className="flex-1 text-xs border-b border-gray-300 pb-1 focus:outline-none focus:border-blue disabled:bg-transparent disabled:cursor-not-allowed"
              type="text"
              value={formData.nombres}
              onChange={(e) => handleInputChange('nombres', e.target.value)}
              disabled={!isEditing}
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold w-16 shrink-0">Apellidos:</label>
            <input
              className="flex-1 text-xs border-b border-gray-300 pb-1 focus:outline-none focus:border-blue disabled:bg-transparent disabled:cursor-not-allowed"
              type="text"
              value={formData.apellidos}
              onChange={(e) => handleInputChange('apellidos', e.target.value)}
              disabled={!isEditing}
              placeholder="Ingresa tu apellido"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold w-16 shrink-0">DNI:</label>
            <div className="flex-1">
              <input
                className="w-full text-xs border-b border-gray-300 pb-1 bg-transparent cursor-not-allowed text-gray-600"
                type="text"
                value={formData.dni}
                disabled
                placeholder="12345678"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold w-16 shrink-0">Celular:</label>
            <input
              className="flex-1 text-xs border-b border-gray-300 pb-1 focus:outline-none focus:border-blue disabled:bg-transparent disabled:cursor-not-allowed"
              type="text"
              value={formData.celular}
              onChange={(e) => handleInputChange('celular', e.target.value)}
              disabled={!isEditing}
              placeholder="Ingresa tu celular"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button
              text="Guardar cambios"
              onClick={handleSaveChanges}
              disabled={!isEditing}
              variant={isEditing ? "primary" : "secondary"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};