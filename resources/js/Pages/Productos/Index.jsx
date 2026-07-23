import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Index({ productos, filters }) {
    const handleDelete = (producto) => {
        if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
            router.delete(route('productos.destroy', producto.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('productos.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Gestión de productos</p>
                    </div>
                    <Link
                        href={route('productos.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Producto
                    </Link>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-64"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.activo || ''}
                                onChange={(e) => handleFilter('activo', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="1">Activos</option>
                                <option value="0">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre', 'Descripcion', 'Precio Unit.', 'Unidad', 'Stock', 'Estado', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {productos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron productos.
                                            </td>
                                        </tr>
                                    ) : (
                                        productos.data.map((producto) => (
                                            <tr key={producto.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm text-gray-500">{producto.id}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{producto.nombre}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{producto.descripcion || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(producto.precio_unitario)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{producto.unidad}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{producto.stock}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${producto.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('productos.edit', producto.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                            Editar
                                                        </Link>
                                                        <button onClick={() => handleDelete(producto)} className="text-red-600 hover:text-red-800 font-medium">
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

                        {productos.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {productos.from} a {productos.to} de {productos.total} productos
                                </p>
                                <div className="flex items-center gap-1">
                                    {productos.links.map((link, i) => (
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
