import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Show({ insumo }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Detalle del Insumo</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{insumo.nombre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('insumos.edit', insumo.id)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </Link>
                        <Link
                            href={route('insumos.index')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Insumo - ${insumo.nombre}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{insumo.nombre}</h3>
                                    <p className="text-sm text-gray-500">
                                        {insumo.cantidad} {insumo.unidad} — {formatCurrency(insumo.total)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem label="ID" value={`#${insumo.id}`} />
                                <DetailItem label="Tipo" value={insumo.tipo?.replace(/_/g, ' ')} />
                                <DetailItem label="Proveedor" value={insumo.proveedor} />
                                <DetailItem label="Cantidad" value={`${insumo.cantidad} ${insumo.unidad}`} />
                                <DetailItem label="Costo Unitario" value={formatCurrency(insumo.costo_unitario)} />
                                <DetailItem label="Costo Total" value={formatCurrency(insumo.total)} highlight />
                                <DetailItem label="Fecha de Recepción" value={insumo.fecha_recepcion} />
                                <DetailItem label="Nº Factura" value={insumo.factura || '—'} />
                            </div>

                            {insumo.observaciones && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Observaciones</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">{insumo.observaciones}</p>
                                </div>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span>Creado: {insumo.created_at}</span>
                            <span>Actualizado: {insumo.updated_at}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function DetailItem({ label, value, highlight = false }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-sm ${highlight ? 'text-lg font-bold text-emerald-700' : 'text-gray-900 font-medium'}`}>
                {value}
            </p>
        </div>
    );
}
