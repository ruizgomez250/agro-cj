import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Show({ despacho }) {
    const recepcion = despacho.recepcion || null;

    const fields = [
        { label: 'Fecha', value: despacho.fecha },
        { label: 'Destino', value: despacho.destino },
        { label: 'Responsable', value: despacho.responsable },
        { label: 'Equipo / Vehiculo', value: despacho.equipo_vehiculo },
        { label: 'Cantidad de Litros', value: `${despacho.cantidad_galones} L` },
        { label: 'Kilometraje', value: despacho.kilometraje ? `${despacho.kilometraje} km` : '—' },
        { label: 'Observaciones', value: despacho.observaciones || '—', full: true },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Detalle de Despacho</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Despacho #{despacho.id}</p>
                </div>
            }
        >
            <Head title={`Despacho #${despacho.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Despacho Detail */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />

                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Despacho #{despacho.id}</h3>
                            <p className="text-sm text-gray-500">{despacho.destino} — {despacho.responsable}</p>
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

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <Link
                                href={route('gasoil.despacho.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition"
                            >
                                Volver
                            </Link>
                            <Link
                                href={route('gasoil.despacho.edit', despacho.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>

                    {/* Recepcion info */}
                    {recepcion && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-1.5 bg-blue-500" />
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Recepcion de Origen</h3>
                                <p className="text-sm text-gray-500">Recepcion #{recepcion.id}</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{recepcion.fecha}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Proveedor</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{recepcion.proveedor}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Guia de Remision</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{recepcion.guia_remision}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Litros Recibidos</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{recepcion.cantidad_galones} L</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio por Litro</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatCurrency(recepcion.precio_galon)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatCurrency(recepcion.total)}</dd>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                                <Link
                                    href={route('gasoil.recepcion.show', recepcion.id)}
                                    className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                                >
                                    Ver recepcion completa &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
