import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Show({ recepcion }) {
    const despachos = recepcion.despachos || [];
    const stock = recepcion.stock_disponible ?? (recepcion.cantidad_galones - despachos.reduce((sum, d) => sum + parseFloat(d.cantidad_galones || 0), 0));

    const fields = [
        { label: 'Fecha', value: recepcion.fecha },
        { label: 'Proveedor', value: recepcion.proveedor },
        { label: 'Guia de Remision', value: recepcion.guia_remision },
        { label: 'Cantidad de Litros', value: `${recepcion.cantidad_galones} L` },
        { label: 'Precio por Litro', value: formatCurrency(recepcion.precio_galon) },
        { label: 'Total', value: formatCurrency(recepcion.total) },
        { label: 'Observaciones', value: recepcion.observaciones || '—', full: true },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Detalle de Recepcion</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Recepcion #{recepcion.id}</p>
                </div>
            }
        >
            <Head title={`Recepcion #${recepcion.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />

                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Recepcion #{recepcion.id}</h3>
                                <p className="text-sm text-gray-500">{recepcion.proveedor} — {recepcion.guia_remision}</p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${stock > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                Stock: {stock} L
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.label} className={field.full ? 'sm:col-span-2' : ''}>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{field.label}</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {recepcion.comprobante_url && (
                            <div className="px-6 pb-6">
                                <a
                                    href={recepcion.comprobante_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver Comprobante
                                </a>
                            </div>
                        )}

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <Link
                                href={route('gasoil.recepcion.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition"
                            >
                                Volver
                            </Link>
                            <Link
                                href={route('gasoil.recepcion.edit', recepcion.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>

                    {/* Despachos */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Despachos Asociados</h3>
                            <p className="text-sm text-gray-500">{despachos.length} despacho(s) registrado(s)</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Fecha', 'Destino', 'Responsable', 'Equipo/Vehiculo', 'Litros'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {despachos.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                                No hay despachos registrados para esta recepcion.
                                            </td>
                                        </tr>
                                    ) : (
                                        despachos.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-4 text-sm text-gray-500">{d.id}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.fecha}</td>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">{d.destino}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.responsable}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{d.equipo_vehiculo}</td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{d.cantidad_galones} L</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
