import { useState } from "react";
import { User, Lock } from "lucide-react";
import { MyProfileData } from "./components/MyProfileData";
import { UpdatePassword } from "./components/UpdatePassword";

type TabType = "myData" | "changePassword";

/**
 * User profile management view with tabs
 * Allows users to update personal info and change password
 */
export const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabType>("myData");

  return (
    <div className="min-h-screen py-12 px-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal y seguridad</p>
        </div>

        <div className="flex gap-20">
          {/* Vertical Tabs */}
          <div className="w-64 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("myData")}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all ${
                activeTab === "myData"
                  ? "border-l-4 border-blue text-blue font-semibold"
                  : "border-l-4 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <User size={20} />
              <span className="font-medium">Mis Datos</span>
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all ${
                activeTab === "changePassword"
                  ? "border-l-4 border-blue text-blue font-semibold"
                  : "border-l-4 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Lock size={20} />
              <span className="font-medium">Cambiar Contraseña</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white border-2 border-gray-100 p-12 rounded-lg shadow-sm hover:shadow-md transition-shadow ">
            {activeTab === "myData" && <MyProfileData />}
            {activeTab === "changePassword" && <UpdatePassword />}
          </div>
        </div>
      </div>
    </div>
  );
};
