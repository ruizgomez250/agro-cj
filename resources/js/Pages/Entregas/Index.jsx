import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const tipoBadge = (tipo) => {
    const styles = {
        insumo: 'bg-blue-100 text-blue-800',
        gasoil: 'bg-yellow-100 text-yellow-800',
        producto: 'bg-purple-100 text-purple-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[tipo] || 'bg-gray-100 text-gray-800'}`}>
            {tipo}
        </span>
    );
};

export default function Index({ entregas, filters }) {
    const handleFilter = (key, value) => {
        router.get(route('entregas.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Entregas</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Registro de entregas a empleados</p>
                    </div>
                    <Link
                        href={route('entregas.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Entrega
                    </Link>
                </div>
            }
        >
            <Head title="Entregas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Buscar por empleado..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-64"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.tipo || ''}
                                onChange={(e) => handleFilter('tipo', e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="insumo">Insumo</option>
                                <option value="gasoil">Gasoil</option>
                                <option value="producto">Producto</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Fecha', 'Empleado', 'Tipo', 'Cantidad', 'Observaciones', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {entregas.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron entregas.
                                            </td>
                                        </tr>
                                    ) : (
                                        entregas.data.map((entrega) => (
                                            <tr key={entrega.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm text-gray-500">#{entrega.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{entrega.fecha}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {entrega.empleado?.nombre} {entrega.empleado?.apellido}
                                                </td>
                                                <td className="px-4 py-3">{tipoBadge(entrega.tipo)}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{entrega.cantidad}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{entrega.observaciones || '—'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={route('entregas.comprobante', entrega.id)}
                                                            target="_blank"
                                                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                        >
                                                            Comprobante
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {entregas.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {entregas.from} a {entregas.to} de {entregas.total} entregas
                                </p>
                                <div className="flex items-center gap-1">
                                    {entregas.links.map((link, i) => (
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
