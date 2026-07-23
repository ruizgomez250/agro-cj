import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const tipoBadge = (tipo) => {
    const styles = {
        semilla: 'bg-emerald-100 text-emerald-800',
        fertilizante: 'bg-blue-100 text-blue-800',
        herbicida: 'bg-red-100 text-red-800',
        insecticida: 'bg-orange-100 text-orange-800',
        fungicida: 'bg-yellow-100 text-yellow-800',
        herbicida_preemergente: 'bg-amber-100 text-amber-800',
        enmienda: 'bg-purple-100 text-purple-800',
        abono: 'bg-lime-100 text-lime-800',
        otro: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[tipo] || styles.otro}`}>
            {tipo?.replace(/_/g, ' ')}
        </span>
    );
};

export default function Index({ insumos, resumenTipos, totalGeneral, filters }) {
    const handleDelete = (insumo) => {
        if (confirm(`¿Está seguro de eliminar el insumo "${insumo.nombre}"?`)) {
            router.delete(route('insumos.destroy', insumo.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('insumos.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Insumos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Gestión de insumos agrícolas</p>
                    </div>
                    <Link
                        href={route('insumos.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Insumo
                    </Link>
                </div>
            }
        >
            <Head title="Insumos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Total General Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-500 h-1.5" />
                        <div className="p-5">
                            <p className="text-sm font-medium text-gray-500">Costo Total General</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(totalGeneral)}</p>
                            <p className="mt-1 text-xs text-gray-400">{insumos.total} insumos registrados</p>
                        </div>
                    </div>

                    {/* Resumen por Tipo */}
                    {resumenTipos && resumenTipos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {resumenTipos.map((item) => (
                                <div key={item.tipo} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        {tipoBadge(item.tipo)}
                                    </div>
                                    <p className="mt-2 text-lg font-bold text-gray-900">{item.cantidad}</p>
                                    <p className="text-xs text-gray-500">{formatCurrency(item.total)}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.tipo || ''}
                                onChange={(e) => handleFilter('tipo', e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="semilla">Semilla</option>
                                <option value="fertilizante">Fertilizante</option>
                                <option value="herbicida">Herbicida</option>
                                <option value="insecticida">Insecticida</option>
                                <option value="fungicida">Fungicida</option>
                                <option value="herbicida_preemergente">Herbicida Preemergente</option>
                                <option value="enmienda">Enmienda</option>
                                <option value="abono">Abono</option>
                                <option value="otro">Otro</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Proveedor..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-48"
                                defaultValue={filters?.proveedor || ''}
                                onChange={(e) => handleFilter('proveedor', e.target.value)}
                            />
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.fecha_desde || ''}
                                onChange={(e) => handleFilter('fecha_desde', e.target.value)}
                                title="Fecha desde"
                            />
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.fecha_hasta || ''}
                                onChange={(e) => handleFilter('fecha_hasta', e.target.value)}
                                title="Fecha hasta"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre', 'Tipo', 'Proveedor', 'Cantidad', 'Costo Unit.', 'Total', 'Fecha', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {insumos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron insumos.
                                            </td>
                                        </tr>
                                    ) : (
                                        insumos.data.map((insumo) => (
                                            <tr key={insumo.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm text-gray-500">{insumo.id}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{insumo.nombre}</td>
                                                <td className="px-4 py-3">{tipoBadge(insumo.tipo)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{insumo.proveedor}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {insumo.cantidad} {insumo.unidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(insumo.costo_unitario)}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(insumo.total)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{insumo.fecha_recepcion}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('insumos.show', insumo.id)}
                                                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('insumos.edit', insumo.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(insumo)}
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
                        {insumos.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {insumos.from} a {insumos.to} de {insumos.total} insumos
                                </p>
                                <div className="flex items-center gap-1">
                                    {insumos.links.map((link, i) => (
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
