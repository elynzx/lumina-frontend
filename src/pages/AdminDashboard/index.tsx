import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from 'react';
import { DashboardView } from './views/DashboardView';
import { DistrictsView } from './views/DistrictsView';
import { ReservationsView } from './views/ReservationsView';
import { VenuesView } from './views/VenuesView';
import { ReportsView } from './views/ReportsView';
import logomark from '@/assets/logo/logomark.svg';

type MenuItem = 'dashboard' | 'reservas' | 'locales' | 'mobiliario' | 'distritos' | 'tipos-evento' | 'clientes' | 'reportes';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user, isAuthenticated } = useAuthStore();
    const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const currentUser = user();
    const userIsAuthenticated = isAuthenticated();

    // Verificar si el usuario está autenticado y es admin
    useEffect(() => {
        if (!userIsAuthenticated) {
            navigate("/admin/login");
        } else if (currentUser?.roleName !== "ADMIN") {
            // Si no es admin, redirigir al home
            navigate("/");
        }
    }, [userIsAuthenticated, currentUser, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    if (!userIsAuthenticated || currentUser?.roleName !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar Superior */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo y Menú de Navegación */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                                <img src={logomark} alt="Logo" className="h-6 w-6" />
                            </div>

                            {/* Menú de Navegación */}
                            <nav className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveMenu('dashboard')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'dashboard'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveMenu('reservas')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'reservas'
                                            ? 'bg-red-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Reservas
                                </button>
                                <button
                                    onClick={() => setActiveMenu('locales')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'locales'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Locales
                                </button>
                                <button
                                    onClick={() => setActiveMenu('mobiliario')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'mobiliario'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Mobiliario
                                </button>
                                <button
                                    onClick={() => setActiveMenu('distritos')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'distritos'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Distritos
                                </button>
                                <button
                                    onClick={() => setActiveMenu('tipos-evento')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'tipos-evento'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Tipos de Evento
                                </button>
                                <button
                                    onClick={() => setActiveMenu('clientes')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'clientes'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Clientes
                                </button>
                                <button
                                    onClick={() => setActiveMenu('reportes')}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        activeMenu === 'reportes'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Reportes
                                </button>
                            </nav>
                        </div>

                        {/* Iconos de la derecha */}
                        <div className="flex items-center gap-4">
                            {/* Ayuda */}
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {/* Configuración */}
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                            {/* Usuario con Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {currentUser?.firstName} {currentUser?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="px-8 py-6 bg-gray-50 min-h-screen">
                {/* Dashboard Content */}
                {activeMenu === 'dashboard' && <DashboardView />}

                {/* Vista Reservas */}
                {activeMenu === 'reservas' && <ReservationsView />}

                {/* Vista Locales */}
                {activeMenu === 'locales' && <VenuesView />}

                {/* Vista Distritos */}
                {activeMenu === 'distritos' && <DistrictsView />}

                {/* Vista Reportes */}
                {activeMenu === 'reportes' && <ReportsView />}

                {/* Otras vistas (placeholder) */}
                {activeMenu !== 'dashboard' && activeMenu !== 'reservas' && activeMenu !== 'locales' && activeMenu !== 'distritos' && activeMenu !== 'reportes' && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1).replace('-', ' ')}
                        </h2>
                        <p className="text-gray-600">Esta sección está en desarrollo</p>
                    </div>
                )}
            </main>
        </div>
    );
};
