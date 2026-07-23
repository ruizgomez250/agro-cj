import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Stock({ recepciones, totalStock, totalRecibido, totalDespachado }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Stock de Gasoil</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Estado actual del inventario de combustible</p>
                </div>
            }
        >
            <Head title="Stock de Gasoil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Recibido</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{totalRecibido} L</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-amber-500 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Despachado</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{totalDespachado} L</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className={`${totalStock > 0 ? 'bg-green-500' : 'bg-red-500'} h-1.5`} />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Stock Actual</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{totalStock} L</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {totalRecibido > 0 ? `${((totalStock / totalRecibido) * 100).toFixed(1)}% del total recibido` : 'Sin recepciones'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Detalle por Recepcion</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Proveedor', 'Guia', 'Fecha', 'Recibido', 'Despachado', 'Stock', 'Estado'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {recepciones.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No hay recepciones registradas.
                                            </td>
                                        </tr>
                                    ) : (
                                        recepciones.map((r) => {
                                            const despachado = r.despachos_total || 0;
                                            const stock = r.stock_disponible ?? (r.cantidad_galones - despachado);
                                            const sinStock = stock <= 0;
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.proveedor}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{r.guia_remision}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{r.fecha}</td>
                                                     <td className="px-4 py-4 text-sm text-gray-700">{r.cantidad_galones} L</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{despachado} L</td>
                                                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{stock} L</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${sinStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {sinStock ? 'Agotado' : 'Disponible'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href={route('gasoil.recepcion.index')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Recepcion
                        </Link>
                        <Link
                            href={route('gasoil.despacho.index')}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Ver Despachos
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
