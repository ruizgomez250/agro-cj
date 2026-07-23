import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ proveedores, filters }) {
    const handleDelete = (proveedor) => {
        if (confirm(`¿Esta seguro de eliminar al proveedor "${proveedor.nombre}"?`)) {
            router.delete(route('proveedores.destroy', proveedor.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('proveedores.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>}
        >
            <Head title="Proveedores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, RUC o especialidad..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-72"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.activo ?? ''}
                                onChange={(e) => handleFilter('activo', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="1">Activos</option>
                                <option value="0">Inactivos</option>
                            </select>
                        </div>
                        <Link
                            href={route('proveedores.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Proveedor
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre', 'RUC', 'Telefono', 'Especialidad', 'Estado', 'Acciones'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {proveedores.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron proveedores.
                                            </td>
                                        </tr>
                                    ) : (
                                        proveedores.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{p.id}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{p.ruc || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{p.telefono || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{p.especialidad || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {p.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('proveedores.edit', p.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                            Editar
                                                        </Link>
                                                        <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800 font-medium">
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

                        {proveedores.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {proveedores.from} a {proveedores.to} de {proveedores.total} proveedores
                                </p>
                                <div className="flex items-center gap-1">
                                    {proveedores.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                                                link.active ? 'bg-emerald-600 text-white shadow-sm' : link.url ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300' : 'text-gray-300 cursor-default'
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
