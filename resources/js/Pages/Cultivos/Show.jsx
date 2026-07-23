import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const estadoBadge = (estado) => {
    const styles = {
        activo: 'bg-green-100 text-green-800',
        cosechado: 'bg-blue-100 text-blue-800',
        abandonado: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[estado] || 'bg-gray-100 text-gray-800'}`}>
            {estado}
        </span>
    );
};

function DetailCard({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{value || '—'}</p>
        </div>
    );
}

export default function Show({ cultivo }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('cultivos.index')}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{cultivo.nombre}</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{cultivo.variedad} — {cultivo.hectareas} ha</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {estadoBadge(cultivo.estado)}
                        <Link
                            href={route('cultivos.edit', cultivo.id)}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Cultivo - ${cultivo.nombre}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Información General */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Información General</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <DetailCard label="Nombre" value={cultivo.nombre} />
                                <DetailCard label="Variedad" value={cultivo.variedad} />
                                <DetailCard label="Hectáreas" value={`${cultivo.hectareas} ha`} />
                                <DetailCard label="Lote / Parcela" value={cultivo.lote?.nombre || '—'} />
                                {cultivo.lote?.latitud && cultivo.lote?.longitud && (
                                    <DetailCard label="Coordenadas" value={`${cultivo.lote.latitud}, ${cultivo.lote.longitud}`} />
                                )}
                                <DetailCard label="Estado" value={cultivo.estado} />
                                <DetailCard
                                    label="Rendimiento Estimado"
                                    value={cultivo.rendimiento_estimado ? `${cultivo.rendimiento_estimado} kg/ha` : null}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Fechas</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailCard label="Fecha de Siembra" value={formatDate(cultivo.fecha_siembra)} />
                                <DetailCard label="Fecha de Cosecha" value={formatDate(cultivo.fecha_cosecha)} />
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {cultivo.observaciones && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Observaciones</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{cultivo.observaciones}</p>
                            </div>
                        </div>
                    )}

                    {/* Insumos Asociados */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Insumos Asociados</h3>
                            {cultivo.insumos?.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                                    {cultivo.insumos.length}
                                </span>
                            )}
                        </div>
                        <div className="p-6">
                            {!cultivo.insumos || cultivo.insumos.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="mt-3 text-sm text-gray-400">No hay insumos registrados para este cultivo.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {['Nombre', 'Tipo', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Fecha'].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {cultivo.insumos.map((insumo) => (
                                                <tr key={insumo.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{insumo.nombre}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{insumo.tipo}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{insumo.cantidad}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(insumo.costo_unitario)}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(insumo.costo_total)}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(insumo.fecha)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
