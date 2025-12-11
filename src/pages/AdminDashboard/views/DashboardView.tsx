import { useState, useEffect } from 'react';
import { useAdminService } from '@/api/services/adminService';
import type { DashboardStats } from '@/api/interfaces/admin';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const DashboardView = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
    const adminService = useAdminService();

    useEffect(() => {
        loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPeriod]);


    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDashboardStats(selectedPeriod);
            setStats(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getTrendIcon = (growth: number) => {
        if (growth > 0) {
            return (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            );
        } else if (growth < 0) {
            return (
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center text-gray-500 py-12">
                No se pudieron cargar las estadísticas
            </div>
        );
    }

    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) {
            if (current === 0) return 0;
            return 100;
        }
        return ((current - previous) / previous) * 100;
    };

    
    return (
        <div className="p-6">
            {/* Header con período selector */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Resumen general y métricas clave</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedPeriod === 'week'
                                ? 'bg-[#4A61A3] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedPeriod === 'month'
                                ? 'bg-[#4A61A3] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Mes
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('year')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedPeriod === 'year'
                                ? 'bg-[#4A61A3] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Año
                    </button>
                </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Ingresos del Mes */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 uppercase">Ingresos del {selectedPeriod === 'week' ? 'Semana' : selectedPeriod === 'year' ? 'Año' : 'Mes'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {getTrendIcon(calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue)))}
                            <span className="text-xs font-semibold text-gray-700 py-3">
                                {calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue)) >= 0 ? '+' : ''}
                                {calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue)).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-center py-3">{formatCurrency(stats.monthlyRevenue)}</p>
                    <p className=" text-gray-500 mt-1 text-center">vs. período anterior</p>
                </div>

                {/* Total Reservas del Mes */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2">
                                <svg className="w-5 h-5 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 uppercase">Reservas del {selectedPeriod === 'week' ? 'Semana' : selectedPeriod === 'year' ? 'Año' : 'Mes'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {getTrendIcon(calculateGrowth(stats.currentPeriodReservations, stats.previousPeriodReservations))}
                            <span className="text-xs font-semibold text-gray-700">
                                {calculateGrowth(stats.currentPeriodReservations, stats.previousPeriodReservations) >= 0 ? '+' : ''}
                                {calculateGrowth(stats.currentPeriodReservations, stats.previousPeriodReservations).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-center py-3">
                        {stats.currentPeriodReservations}
                    </p>
                    <p className="text-gray-500 mt-1 text-center">Hoy: {stats.todayReservations} reservas</p>
                </div>

                {/* Total de Locales */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 uppercase">Total de Locales</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-center py-3">
                        {stats.totalVenues}
                    </p>
                    <p className="text-gray-500 mt-1 text-center">Disponibles en el sistema</p>
                </div>

                {/* Reservas Pendientes */}
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 uppercase">Reservas Pendientes</span>
                        </div>
                        {stats.pendingReservations > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded">
                                ¡Atención!
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-center py-3">{stats.pendingReservations}</p>
                    <p className="text-gray-500 mt-1 text-center">Requieren confirmación</p>
                </div>
            </div>

            {/* Insights y alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Insight positivo */}
                {Number(calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue))) > 0 ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-semibold text-green-800">Rendimiento Positivo</h3>
                                <p className="text-xs text-green-700 mt-1">
                                    Los ingresos aumentaron un {calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue))}% respecto al período anterior
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-800">Oportunidad de Mejora</h3>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Los ingresos {Number(calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue))) === 0 ? 'se mantienen estables' : `disminuyeron un ${Math.abs(Number(calculateGrowth(Number(stats.monthlyRevenue), Number(stats.previousMonthRevenue))))}%`} respecto al período anterior
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadística de usuarios */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800">Base de Clientes</h3>
                            <p className="text-xs text-blue-700 mt-1">
                                {stats.totalUsers} clientes registrados en el sistema
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos de Evolución - Ingresos y Reservas separados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Evolución de Ingresos */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Evolución de Ingresos</h2>
                            <p className="text-sm text-gray-600 mt-1">Últimos 6 meses</p>
                        </div>
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.monthlyRevenue6Months}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <YAxis 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                fill="url(#colorRevenue)" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                name="Ingresos"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Evolución de Reservas */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Evolución de Reservas</h2>
                            <p className="text-sm text-gray-600 mt-1">Últimos 6 meses</p>
                        </div>
                        <svg className="w-6 h-6 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.monthlyRevenue6Months}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <YAxis 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                formatter={(value: number) => [value, 'Reservas']}
                            />
                            <Bar 
                                dataKey="reservations" 
                                fill="#4A61A3" 
                                radius={[8, 8, 0, 0]}
                                name="Reservas"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Fila de gráficos secundarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Distribución por Estado */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de Reservas por Estado</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Confirmadas', value: stats.reservationsByStatus?.CONFIRMED || 0 },
                                    { name: 'Pendientes', value: stats.reservationsByStatus?.PENDING || 0 },
                                    { name: 'Canceladas', value: stats.reservationsByStatus?.CANCELLED || 0 }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#f59e0b" />
                                <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.reservationsByStatus?.CONFIRMED || 0}
                            </p>
                            <p className="text-xs text-gray-600">Confirmadas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">
                                {stats.reservationsByStatus?.PENDING || 0}
                            </p>
                            <p className="text-xs text-gray-600">Pendientes</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">
                                {stats.reservationsByStatus?.CANCELLED || 0}
                            </p>
                            <p className="text-xs text-gray-600">Canceladas</p>
                        </div>
                    </div>
                </div>

                {/* Top Tipos de Evento */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Tipos de Evento Más Demandados</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.topEventTypes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="reservationCount"
                                nameKey="eventTypeName"
                            >
                                <Cell fill="#4A61A3" />
                                <Cell fill="#10b981" />
                                <Cell fill="#f59e0b" />
                                <Cell fill="#ef4444" />
                                <Cell fill="#8b5cf6" />
                                <Cell fill="#ec4899" />
                            </Pie>
                            <Tooltip />
                            <Legend 
                                verticalAlign="bottom" 
                                height={60}
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Rendimiento de Todos los Locales */}
            <div className="mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Rendimiento de Todos los Locales</h2>
                            <p className="text-sm text-gray-600 mt-1">Análisis comparativo del comportamiento de cada local</p>
                        </div>
                        <svg className="w-8 h-8 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    
                    {/* Gráfico de barras verticales para todos los locales */}
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={stats.topVenues} layout="horizontal" margin={{ bottom: 100, top: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="venueName" 
                                tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                axisLine={{ stroke: '#d1d5db' }}
                            />
                            <YAxis 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                                label={{ value: 'Número de Reservas', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb', 
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: number) => [`${value} reservas`, 'Total']}
                            />
                            <Bar 
                                dataKey="reservationCount" 
                                fill="#4A61A3" 
                                radius={[8, 8, 0, 0]}
                                name="Reservas"
                            >
                                {stats.topVenues.map((_entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={
                                            index === 0 ? '#10b981' : 
                                            index === 1 ? '#4A61A3' : 
                                            index === 2 ? '#f59e0b' : 
                                            '#6b7280'
                                        } 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Tabla detallada */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle por Local</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#4A61A3]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Ranking</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre del Local</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-white">Total Reservas</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-white">% del Total</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Rendimiento</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.topVenues.map((venue, index) => {
                                        const totalReservations = stats.topVenues.reduce((sum, v) => sum + v.reservationCount, 0);
                                        const percentage = ((venue.reservationCount / totalReservations) * 100).toFixed(1);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mx-auto ${
                                                        index === 0 ? 'bg-yellow-500' : 
                                                        index === 1 ? 'bg-gray-400' : 
                                                        index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                    {venue.venueName}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                                                    {venue.reservationCount}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                        {percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-[200px]">
                                                            <div 
                                                                className={`h-2.5 rounded-full ${
                                                                    index === 0 ? 'bg-green-500' : 
                                                                    index === 1 ? 'bg-[#4A61A3]' : 
                                                                    index === 2 ? 'bg-orange-500' : 'bg-gray-400'
                                                                }`}
                                                                style={{ width: `${(venue.reservationCount / (stats.topVenues[0]?.reservationCount || 1)) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-gray-600 min-w-[60px]">
                                                            {((venue.reservationCount / (stats.topVenues[0]?.reservationCount || 1)) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-900">
                                            TOTAL
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            {stats.topVenues.reduce((sum, v) => sum + v.reservationCount, 0)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
                                                100%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Análisis de Mobiliario y Servicios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Mobiliario (Mesas y Sillas) */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Mobiliario (Mesas y Sillas)</h2>
                            <p className="text-sm text-gray-600 mt-1">Más solicitados</p>
                        </div>
                        <svg className="w-6 h-6 text-[#4A61A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart 
                            data={stats.topFurniture
                                .filter(item => item.furnitureName.toLowerCase().includes('silla') || item.furnitureName.toLowerCase().includes('mesa'))
                                .slice(0, 6)} 
                            layout="horizontal"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="furnitureName" 
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                formatter={(value: number) => [`${value} solicitudes`, 'Total']}
                            />
                            <Bar 
                                dataKey="requestCount" 
                                fill="#4A61A3" 
                                radius={[8, 8, 0, 0]}
                                name="Solicitudes"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Servicios Adicionales */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Servicios Adicionales</h2>
                            <p className="text-sm text-gray-600 mt-1">Más solicitados</p>
                        </div>
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart 
                            data={stats.topFurniture
                                .filter(item => 
                                    !item.furnitureName.toLowerCase().includes('silla') && 
                                    !item.furnitureName.toLowerCase().includes('obligatorios') && 
                                    !item.furnitureName.toLowerCase().includes('mesa')
                                )
                                .slice(0, 6)} 
                            layout="horizontal"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="furnitureName" 
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                formatter={(value: number) => [`${value} solicitudes`, 'Total']}
                            />
                            <Bar 
                                dataKey="requestCount" 
                                fill="#10b981" 
                                radius={[8, 8, 0, 0]}
                                name="Solicitudes"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Resumen de actividad reciente */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
                        <p className="text-sm text-gray-600 mt-1">Últimas reservas del sistema</p>
                    </div>
                    <button className="px-4 py-2 bg-[#4A61A3] text-white rounded-lg hover:bg-[#3a4f8a] transition-colors text-sm font-medium">
                        Ver todas
                    </button>
                </div>
                {stats.recentReservations && stats.recentReservations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.recentReservations.slice(0, 5).map((reservation) => (
                                    <tr key={reservation.reservationId} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">#{reservation.reservationId}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {reservation.customerName || `Usuario #${reservation.userId}`}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {reservation.venueName || `Local #${reservation.venueId}`}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {new Date(reservation.reservationDate).toLocaleDateString('es-PE')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            {formatCurrency(reservation.totalCost)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                reservation.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {reservation.status === 'CONFIRMED' ? 'Confirmada' :
                                                 reservation.status === 'PENDING' ? 'Pendiente' : 'Cancelada'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No hay reservas recientes
                    </div>
                )}
            </div>
        </div>
    );
};
