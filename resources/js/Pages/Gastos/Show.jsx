import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const categoriaBadge = (categoria) => {
    const styles = {
        operativo: 'bg-green-100 text-green-800',
        administrativo: 'bg-blue-100 text-blue-800',
        mantenimiento: 'bg-orange-100 text-orange-800',
        otro: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[categoria] || 'bg-gray-100 text-gray-800'}`}>
            {categoria}
        </span>
    );
};

export default function Show({ gasto }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Detalle del Gasto</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gasto #{gasto.id}</p>
                </div>
            }
        >
            <Head title={`Gasto #${gasto.id}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ID</p>
                                    <p className="mt-1 text-lg text-gray-900">{gasto.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Concepto</p>
                                    <p className="mt-1 text-lg text-gray-900">{gasto.concepto}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Categoría</p>
                                    <div className="mt-1">{categoriaBadge(gasto.categoria)}</div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Monto</p>
                                    <p className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(gasto.monto)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                                    <p className="mt-1 text-lg text-gray-900">{gasto.fecha}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Usuario</p>
                                    <p className="mt-1 text-lg text-gray-900">{gasto.usuario?.name || '—'}</p>
                                </div>
                            </div>

                            {gasto.descripcion && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Descripción</p>
                                    <p className="mt-1 text-gray-700 whitespace-pre-line">{gasto.descripcion}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-gray-500">Comprobante</p>
                                {gasto.comprobante ? (
                                    <a
                                        href={`/storage/${gasto.comprobante}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        {gasto.comprobante}
                                    </a>
                                ) : (
                                    <p className="mt-1 text-gray-400">Sin comprobante</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <Link
                                href={route('gastos.index')}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                            >
                                Volver
                            </Link>
                            <Link
                                href={route('gastos.edit', gasto.id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
