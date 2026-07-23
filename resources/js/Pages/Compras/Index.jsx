import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const estadoBadge = (estado) => {
    const styles = {
        pagada: 'bg-green-100 text-green-800',
        pendiente: 'bg-yellow-100 text-yellow-800',
        cancelada: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[estado] || 'bg-gray-100 text-gray-800'}`}>
            {estado}
        </span>
    );
};

const tipoBadge = (tipo) => {
    const styles = {
        insumo: 'bg-blue-100 text-blue-800',
        gasoil: 'bg-orange-100 text-orange-800',
        general: 'bg-gray-100 text-gray-700',
    };
    const labels = { insumo: 'Insumo', gasoil: 'Gasoil', general: 'General' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[tipo] || styles.general}`}>
            {labels[tipo] || 'General'}
        </span>
    );
};

export default function Index({ compras, proveedores, stats, filters }) {
    const handleDelete = (compra) => {
        if (confirm(`¿Esta seguro de eliminar esta compra?`)) {
            router.delete(route('compras.destroy', compra.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('compras.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Compras</h2>}
        >
            <Head title="Compras" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-1.5 bg-emerald-600" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Total Compras</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-1.5 bg-yellow-500" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Pendiente Pago</p>
                                <p className="mt-1 text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendiente)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-1.5 bg-green-500" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Pagadas</p>
                                <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(stats.pagada)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por descripcion, factura..."
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
                                <option value="general">General</option>
                                <option value="insumo">Insumo</option>
                                <option value="gasoil">Gasoil</option>
                            </select>
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.proveedor_id || ''}
                                onChange={(e) => handleFilter('proveedor_id', e.target.value)}
                            >
                                <option value="">Todos los proveedores</option>
                                {proveedores.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.estado || ''}
                                onChange={(e) => handleFilter('estado', e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="pagada">Pagada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                        <Link
                            href={route('compras.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Compra
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Fecha', 'Tipo', 'Proveedor', 'Descripcion', 'Monto', 'Factura', 'Estado', 'Acciones'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {compras.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron compras.
                                            </td>
                                        </tr>
                                    ) : (
                                        compras.data.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{c.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{c.fecha}</td>
                                                <td className="px-6 py-4">{tipoBadge(c.tipo)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.proveedor?.nombre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{c.descripcion}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(c.monto)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{c.factura || '-'}</td>
                                                <td className="px-6 py-4">{estadoBadge(c.estado)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('compras.edit', c.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                            Editar
                                                        </Link>
                                                        <button onClick={() => handleDelete(c)} className="text-red-600 hover:text-red-800 font-medium">
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

                        {compras.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {compras.from} a {compras.to} de {compras.total} compras
                                </p>
                                <div className="flex items-center gap-1">
                                    {compras.links.map((link, i) => (
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
