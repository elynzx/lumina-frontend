import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atomic/Button";
import Cookies from "js-cookie";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Cargar datos del usuario desde cookies solo una vez
    if (!initialized) {
      const userDataCookie = Cookies.get("user_data");
      if (userDataCookie) {
        try {
          const parsedData = JSON.parse(userDataCookie);
          setFormData({
            firstName: parsedData.firstName || "",
            lastName: parsedData.lastName || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            documentNumber: parsedData.dni || parsedData.documentNumber || "",
          });
        } catch (err) {
          console.error("Error al parsear datos del usuario:", err);
        }
      }
      setInitialized(true);
    }
  }, [initialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implementar endpoint de actualización de perfil en el backend
      // const response = await updateProfile(formData);
      
      // Por ahora, solo actualizamos las cookies
      Cookies.set("user_data", JSON.stringify(formData), { expires: 7 });
      
      setMessage({
        type: "success",
        text: "Perfil actualizado correctamente",
      });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setMessage({
        type: "error",
        text: "Error al actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bgray py-12 px-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue hover:text-blue/80 font-semibold text-sm mb-4"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Actualiza tu información personal</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Names Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="tu@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                DNI / Documento
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="12345678"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="+51 999 999 999"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                text="Cancelar"
                onClick={() => navigate("/")}
                variant="secondary"
              />
              <Button
                type="submit"
                text={loading ? "Guardando..." : "Guardar Cambios"}
                variant="tertiary"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
