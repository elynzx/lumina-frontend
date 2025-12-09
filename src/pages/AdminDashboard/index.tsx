import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/api/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from 'react';
import { DashboardView } from './views/DashboardView';
import { ReservationsView } from './views/ReservationsView';
import { VenuesView } from './views/VenuesView';
import { ReportsView } from './views/ReportsView';
import { CustomersView } from './views/CustomersView';
import { FurnitureView } from './views/FurnitureView';
import { ServicesView } from './views/ServicesView';
import logo from '@/assets/logo/admin-logo.svg';

type MenuItem = 'dashboard' | 'reservas' | 'locales' | 'mobiliarios' | 'servicios' | 'clientes' | 'reportes';

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
        <div className=" min-h-screen bg-gray-50">
            {/* Navbar Superior */}
            <header className="bg-gray-50 px-30">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div></div>

                    </div>
                </div>
                <div className="border-b border-gray-200 shadow-sm py-6 rounded-lg bg-white">

                    {/* Menú de Navegación */}
                    <nav className="flex gap-8 justify-center">
                        {/* Logo */}
                        <img src={logo} alt="Logo" className="h-8 w-8 mr-12" />
                        <button
                            onClick={() => setActiveMenu('dashboard')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'dashboard'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveMenu('reservas')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'reservas'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Reservas
                        </button>
                        <button
                            onClick={() => setActiveMenu('locales')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'locales'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Locales
                        </button>
                        <button
                            onClick={() => setActiveMenu('mobiliarios')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'mobiliarios'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Mobiliarios
                        </button>
                        <button
                            onClick={() => setActiveMenu('servicios')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'servicios'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Servicios
                        </button>
                        <button
                            onClick={() => setActiveMenu('clientes')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'clientes'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Clientes
                        </button>
                        <button
                            onClick={() => setActiveMenu('reportes')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeMenu === 'reportes'
                                ? 'bg-admin-secondary text-white'
                                : 'text-admin-primary hover:bg-gray-100'
                                }`}
                        >
                            Reportes
                        </button>
                        <div className="flex items-center gap-2 ml-12">
                            {/* Ayuda */}
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <svg className="w-5 h-5 text-admin-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {/* Configuración */}
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <svg className="w-6 h-6 text-admin-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    <svg className="w-6 h-6 text-admin-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </nav>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="py-6  min-h-screen px-30">
                <div className="mb-6 bg-white rounded-lg shadow p-6">
                    {/* Dashboard Content */}
                    {activeMenu === 'dashboard' && <DashboardView />}

                    {/* Vista Reservas */}
                    {activeMenu === 'reservas' && <ReservationsView />}

                    {/* Vista Locales */}
                    {activeMenu === 'locales' && <VenuesView />}

                    {/* Vista Mobiliarios */}
                    {activeMenu === 'mobiliarios' && <FurnitureView />}

                    {/* Vista Servicios */}
                    {activeMenu === 'servicios' && <ServicesView />}

                    {/* Vista Clientes */}
                    {activeMenu === 'clientes' && <CustomersView />}

                    {/* Vista Reportes */}
                    {activeMenu === 'reportes' && <ReportsView />}

                </div>

                {/* Otras vistas (placeholder) */}
                {activeMenu !== 'dashboard' &&
                    activeMenu !== 'reservas' &&
                    activeMenu !== 'locales' &&
                    activeMenu !== 'mobiliarios' &&
                    activeMenu !== 'servicios' &&
                    activeMenu !== 'clientes' &&
                    activeMenu !== 'reportes' && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {String(activeMenu).charAt(0).toUpperCase() + String(activeMenu).slice(1).replace('-', ' ')}
                            </h2>
                            <p className="text-gray-600">Esta sección está en desarrollo</p>
                        </div>
                    )}
            </main>
        </div>
    );
};
