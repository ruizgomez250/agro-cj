import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ producto }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio_unitario: producto.precio_unitario || '',
        unidad: producto.unidad || '',
        stock: producto.stock || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('productos.update', producto.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Producto</h2>}
        >
            <Head title="Editar Producto" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Descripcion</label>
                                    <textarea rows={2} value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={inputClass('descripcion')} />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio Unitario (Gs.) *</label>
                                    <input type="number" value={data.precio_unitario} onChange={(e) => setData('precio_unitario', e.target.value)} className={inputClass('precio_unitario')} />
                                    {errors.precio_unitario && <p className="mt-1 text-sm text-red-500">{errors.precio_unitario}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unidad *</label>
                                    <select value={data.unidad} onChange={(e) => setData('unidad', e.target.value)} className={inputClass('unidad')}>
                                        <option value="">Seleccionar unidad</option>
                                        <option value="kg">Kilogramo (kg)</option>
                                        <option value="g">Gramo (g)</option>
                                        <option value="l">Litro (l)</option>
                                        <option value="ml">Mililitro (ml)</option>
                                        <option value="u">Unidad (u)</option>
                                        <option value="sc">Saco (sc)</option>
                                        <option value="ha">Hectarea (ha)</option>
                                    </select>
                                    {errors.unidad && <p className="mt-1 text-sm text-red-500">{errors.unidad}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock *</label>
                                    <input type="number" step="0.01" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className={inputClass('stock')} />
                                    {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('productos.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                    {processing ? 'Actualizando...' : 'Actualizar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
