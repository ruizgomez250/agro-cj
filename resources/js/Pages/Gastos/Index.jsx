import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

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

export default function Index({ gastos, resumenCategorias, totalGeneral, filters }) {
    const handleDelete = (gasto) => {
        if (confirm(`¿Está seguro de eliminar el gasto "${gasto.concepto}"?`)) {
            router.delete(route('gastos.destroy', gasto.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('gastos.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    const categoriaColors = {
        operativo: 'bg-green-500',
        administrativo: 'bg-blue-500',
        mantenimiento: 'bg-orange-500',
        otro: 'bg-gray-400',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Registro de Gastos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Control de gastos del agro</p>
                    </div>
                    <Link
                        href={route('gastos.create')}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Gasto
                    </Link>
                </div>
            }
        >
            <Head title="Gastos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Total General */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                        <div className="p-5">
                            <p className="text-sm font-medium text-gray-500">Total General</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(totalGeneral)}</p>
                        </div>
                    </div>

                    {/* Resumen Categorias */}
                    {resumenCategorias && Object.keys(resumenCategorias).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(resumenCategorias).map(([categoria, total]) => (
                                <div key={categoria} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className={`${categoriaColors[categoria] || 'bg-gray-400'} h-1.5`} />
                                    <div className="p-5">
                                        <p className="text-sm font-medium text-gray-500 capitalize">{categoria}</p>
                                        <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por concepto..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm w-full sm:w-64"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                defaultValue={filters?.categoria || ''}
                                onChange={(e) => handleFilter('categoria', e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                <option value="operativo">Operativo</option>
                                <option value="administrativo">Administrativo</option>
                                <option value="mantenimiento">Mantenimiento</option>
                                <option value="otro">Otro</option>
                            </select>
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                defaultValue={filters?.fecha_desde || ''}
                                onChange={(e) => handleFilter('fecha_desde', e.target.value)}
                            />
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                defaultValue={filters?.fecha_hasta || ''}
                                onChange={(e) => handleFilter('fecha_hasta', e.target.value)}
                            />
                        </div>
                        <Link
                            href={route('gastos.resumen')}
                            className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg border border-green-200 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Ver Resumen
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Concepto', 'Categoría', 'Monto', 'Fecha', 'Usuario', 'Comprobante', 'Acciones'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {gastos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron gastos.
                                            </td>
                                        </tr>
                                    ) : (
                                        gastos.data.map((gasto) => (
                                            <tr key={gasto.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{gasto.id}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{gasto.concepto}</td>
                                                <td className="px-6 py-4">{categoriaBadge(gasto.categoria)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatCurrency(gasto.monto)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{gasto.fecha}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{gasto.usuario?.name || '—'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {gasto.comprobante ? (
                                                        <a
                                                            href={`/storage/${gasto.comprobante}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                            Ver
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('gastos.show', gasto.id)}
                                                            className="text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('gastos.edit', gasto.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(gasto)}
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

                        {/* Pagination */}
                        {gastos.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {gastos.from} a {gastos.to} de {gastos.total} gastos
                                </p>
                                <div className="flex items-center gap-1">
                                    {gastos.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                                                link.active
                                                    ? 'bg-green-600 text-white shadow-sm'
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
