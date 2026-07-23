import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const estadoBadge = (estado) => {
    const styles = {
        activo: 'bg-green-100 text-green-800',
        inactivo: 'bg-red-100 text-red-800',
        suspendido: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[estado] || 'bg-gray-100 text-gray-800'}`}>
            {estado}
        </span>
    );
};

export default function Index({ socios, stats, filters }) {
    const handleDelete = (socio) => {
        if (confirm(`¿Está seguro de eliminar al socio "${socio.nombre} ${socio.apellido}"?`)) {
            router.delete(route('socios.destroy', socio.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('socios.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Socios</h2>}
        >
            <Head title="Socios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Total Socios', value: stats.total, color: 'bg-emerald-600' },
                            { label: 'Activos', value: stats.activos, color: 'bg-green-500' },
                            { label: 'Inactivos', value: stats.inactivos, color: 'bg-red-500' },
                            { label: 'Suspendidos', value: stats.suspendidos, color: 'bg-yellow-500' },
                            { label: 'Total Aportes', value: formatCurrency(stats.total_aportes), color: 'bg-teal-600' },
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
                                placeholder="Buscar por nombre, cédula o email..."
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
                                <option value="inactivo">Inactivo</option>
                                <option value="suspendido">Suspendido</option>
                            </select>
                        </div>
                        <Link
                            href={route('socios.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Socio
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre Completo', 'Cédula', 'Teléfono', 'Estado', 'Aporte Mensual', 'Acciones'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {socios.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron socios.
                                            </td>
                                        </tr>
                                    ) : (
                                        socios.data.map((socio) => (
                                            <tr key={socio.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{socio.id}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {socio.nombre} {socio.apellido}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{socio.cedula}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{socio.telefono}</td>
                                                <td className="px-6 py-4">{estadoBadge(socio.estado)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(socio.aporte_mensual)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('socios.show', socio.id)}
                                                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                            title="Ver"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('socios.edit', socio.id)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                            title="Editar"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(socio)}
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
                        {socios.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {socios.from} a {socios.to} de {socios.total} socios
                                </p>
                                <div className="flex items-center gap-1">
                                    {socios.links.map((link, i) => (
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
