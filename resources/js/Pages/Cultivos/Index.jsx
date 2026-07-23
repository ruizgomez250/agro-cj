import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

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

export default function Index({ cultivos, stats, filters }) {
    const handleDelete = (cultivo) => {
        if (confirm(`¿Está seguro de eliminar el cultivo "${cultivo.nombre}"?`)) {
            router.delete(route('cultivos.destroy', cultivo.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('cultivos.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Cultivos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Gestión de cultivos del sistema Agro-CJ</p>
                    </div>
                    <Link
                        href={route('cultivos.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Cultivo
                    </Link>
                </div>
            }
        >
            <Head title="Cultivos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Cultivos', value: stats.total, color: 'bg-emerald-600' },
                            { label: 'Activos', value: stats.activos, color: 'bg-green-500' },
                            { label: 'Cosechados', value: stats.cosechados, color: 'bg-blue-500' },
                            { label: 'Total Hectáreas', value: stats.total_hectareas, color: 'bg-teal-600' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className={`${stat.color} h-1.5`} />
                                <div className="p-5">
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o variedad..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-72"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.estado || ''}
                                onChange={(e) => handleFilter('estado', e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="activo">Activo</option>
                                <option value="cosechado">Cosechado</option>
                                <option value="abandonado">Abandonado</option>
                            </select>
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.fecha_desde || ''}
                                onChange={(e) => handleFilter('fecha_desde', e.target.value)}
                            />
                        </div>
                        <Link
                            href={route('cultivos.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Cultivo
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre', 'Variedad', 'Hectáreas', 'Lote/Parcela', 'Fecha Siembra', 'Estado', 'Insumos', 'Acciones'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {cultivos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron cultivos.
                                            </td>
                                        </tr>
                                    ) : (
                                        cultivos.data.map((cultivo) => (
                                            <tr key={cultivo.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{cultivo.id}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cultivo.nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{cultivo.variedad}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{cultivo.hectareas} ha</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{cultivo.lote?.nombre || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(cultivo.fecha_siembra)}</td>
                                                <td className="px-6 py-4">{estadoBadge(cultivo.estado)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{cultivo.insumos_count ?? cultivo.insumos?.length ?? 0}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('cultivos.show', cultivo.id)}
                                                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                            title="Ver"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('cultivos.edit', cultivo.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                            title="Editar"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(cultivo)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                            title="Eliminar"
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
                        {cultivos.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {cultivos.from} a {cultivos.to} de {cultivos.total} cultivos
                                </p>
                                <div className="flex items-center gap-1">
                                    {cultivos.links.map((link, i) => (
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
