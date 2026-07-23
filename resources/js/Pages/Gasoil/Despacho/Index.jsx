import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Index({ despachos, resumen, filters }) {
    const [destino, setDestino] = useState(filters?.destino || '');
    const [responsable, setResponsable] = useState(filters?.responsable || '');
    const [fechaDesde, setFechaDesde] = useState(filters?.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filters?.fecha_hasta || '');

    const handleDelete = (despacho) => {
        if (confirm(`¿Está seguro de eliminar el despacho #${despacho.id}?`)) {
            router.delete(route('gasoil.despacho.destroy', despacho.id));
        }
    };

    const applyFilters = (key, value) => {
        router.get(route('gasoil.despacho.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Despachos de Gasoil</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Control de despachos de combustible</p>
                    </div>
                    <Link
                        href={route('gasoil.despacho.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Despacho
                    </Link>
                </div>
            }
        >
            <Head title="Despachos de Gasoil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Resumen Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Litros Despachados</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{resumen.total_galones} L</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Despachos</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{resumen.total_despachos}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Destinos</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {resumen.por_destino ? Object.keys(resumen.por_destino).length : 0} destinos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Per-destination breakdown */}
                    {resumen.por_destino && Object.keys(resumen.por_destino).length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Litros por Destino</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Object.entries(resumen.por_destino).map(([dest, galones]) => (
                                    <div key={dest} className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                                        <p className="text-xs font-semibold text-emerald-600 truncate">{dest}</p>
                                        <p className="text-lg font-bold text-emerald-700">{galones} L</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por destino..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-56"
                                value={destino}
                                onChange={(e) => {
                                    setDestino(e.target.value);
                                    applyFilters('destino', e.target.value);
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Responsable..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-56"
                                value={responsable}
                                onChange={(e) => {
                                    setResponsable(e.target.value);
                                    applyFilters('responsable', e.target.value);
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
                                        {['ID', 'Fecha', 'Destino', 'Responsable', 'Equipo/Vehiculo', 'Litros', 'Recepcion', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {despachos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron despachos.
                                            </td>
                                        </tr>
                                    ) : (
                                        despachos.data.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-4 text-sm text-gray-500">{d.id}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.fecha}</td>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">{d.destino}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.responsable}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.equipo_vehiculo}</td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{d.cantidad_galones} L</td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    {d.recepcion ? `#${d.recepcion.id} - ${d.recepcion.guia_remision}` : '—'}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('gasoil.despacho.show', d.id)}
                                                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('gasoil.despacho.edit', d.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <a
                                                            href={route('gasoil.despacho.comprobante', d.id)}
                                                            target="_blank"
                                                            className="text-purple-600 hover:text-purple-800 font-medium"
                                                        >
                                                            Comprobante
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(d)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {despachos.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {despachos.from} a {despachos.to} de {despachos.total} despachos
                                </p>
                                <div className="flex items-center gap-1">
                                    {despachos.links.map((link, i) => (
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
