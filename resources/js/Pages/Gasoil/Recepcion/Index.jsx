import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Index({ recepciones, totalStock, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [fechaDesde, setFechaDesde] = useState(filters?.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filters?.fecha_hasta || '');

    const handleDelete = (recepcion) => {
        if (confirm(`¿Está seguro de eliminar la recepción #${recepcion.id}?`)) {
            router.delete(route('gasoil.recepcion.destroy', recepcion.id));
        }
    };

    const applyFilters = (key, value) => {
        router.get(route('gasoil.recepcion.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Recepcion de Gasoil</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Registro de recepciones de combustible</p>
                    </div>
                    <Link
                        href={route('gasoil.recepcion.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Recepcion
                    </Link>
                </div>
            }
        >
            <Head title="Recepcion de Gasoil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stat Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Stock Total Disponible</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{totalStock} L</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Recepciones</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{recepciones.total}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Ultimo Ingreso</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {recepciones.data.length > 0 ? recepciones.data[0].fecha : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por proveedor o guia..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-72"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    applyFilters('search', e.target.value);
                                }}
                            />
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                value={fechaDesde}
                                onChange={(e) => {
                                    setFechaDesde(e.target.value);
                                    applyFilters('fecha_desde', e.target.value);
                                }}
                            />
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                value={fechaHasta}
                                onChange={(e) => {
                                    setFechaHasta(e.target.value);
                                    applyFilters('fecha_hasta', e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Fecha', 'Proveedor', 'Guia Remision', 'Litros', 'Precio/Litro', 'Total', 'Stock Disponible', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {recepciones.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron recepciones.
                                            </td>
                                        </tr>
                                    ) : (
                                        recepciones.data.map((r) => {
                                            const stock = r.stock_disponible ?? (r.cantidad_galones - (r.despachos_total || 0));
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-4 text-sm text-gray-500">{r.id}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{r.fecha}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.proveedor}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{r.guia_remision}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{r.cantidad_galones} L</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(r.precio_galon)}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(r.total)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {stock} L
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={route('gasoil.recepcion.show', r.id)}
                                                                className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <Link
                                                                href={route('gasoil.recepcion.edit', r.id)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(r)}
                                                                className="text-red-600 hover:text-red-800 font-medium"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {recepciones.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {recepciones.from} a {recepciones.to} de {recepciones.total} recepciones
                                </p>
                                <div className="flex items-center gap-1">
                                    {recepciones.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                    : 'text-gray-300 cursor-default'
                                            }`}
                                            preserveState
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
