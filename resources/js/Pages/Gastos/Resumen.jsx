import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Resumen({ datosGrafico, gastosCategoria, totalMes, totalAnio, totalGeneral }) {
    const maxValue = Math.max(...Object.values(datosGrafico || {}), 1);

    const categoriaColors = {
        operativo: 'bg-green-500',
        administrativo: 'bg-blue-500',
        mantenimiento: 'bg-orange-500',
        otro: 'bg-gray-400',
    };

    const categoriaTextColors = {
        operativo: 'text-green-700',
        administrativo: 'text-blue-700',
        mantenimiento: 'text-orange-700',
        otro: 'text-gray-700',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Resumen de Gastos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Estadísticas y gráficos de gastos</p>
                    </div>
                    <Link
                        href={route('gastos.index')}
                        className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg border border-green-200 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a Gastos
                    </Link>
                </div>
            }
        >
            <Head title="Resumen de Gastos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Gastos del Mes</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalMes)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Gastos del Año</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalAnio)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-700 to-green-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total General</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalGeneral)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Chart */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Gastos Mensuales</h3>
                            {datosGrafico && Object.keys(datosGrafico).length > 0 ? (
                                <div className="flex items-end gap-2 h-64">
                                    {Object.entries(datosGrafico).map(([month, value]) => (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-xs font-medium text-gray-500">{formatCurrency(value)}</span>
                                            <div
                                                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500"
                                                style={{ height: `${(value / maxValue) * 200}px`, minHeight: value > 0 ? '8px' : '0' }}
                                            />
                                            <span className="text-xs font-medium text-gray-600 mt-1">{month}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-12">No hay datos para mostrar</p>
                            )}
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Gastos por Categoría</h3>
                            {gastosCategoria && gastosCategoria.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {gastosCategoria.map((item) => {
                                        const pct = totalGeneral > 0 ? ((item.total / totalGeneral) * 100).toFixed(1) : 0;
                                        return (
                                            <div key={item.categoria} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-3 h-3 rounded-full ${categoriaColors[item.categoria] || 'bg-gray-400'}`} />
                                                    <span className={`text-sm font-semibold capitalize ${categoriaTextColors[item.categoria] || 'text-gray-700'}`}>
                                                        {item.categoria}
                                                    </span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900">{formatCurrency(item.total)}</p>
                                                <p className="text-xs text-gray-400 mt-1">{pct}% del total</p>
                                                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${categoriaColors[item.categoria] || 'bg-gray-400'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-12">No hay datos por categoría</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
