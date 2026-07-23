import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ proveedor }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: proveedor.nombre || '',
        ruc: proveedor.ruc || '',
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        direccion: proveedor.direccion || '',
        especialidad: proveedor.especialidad || '',
        observaciones: proveedor.observaciones || '',
        activo: proveedor.activo ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('proveedores.update', proveedor.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Proveedor</h2>}
        >
            <Head title={`Editar - ${proveedor.nombre}`} />

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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">RUC</label>
                                    <input type="text" value={data.ruc} onChange={(e) => setData('ruc', e.target.value)} className={inputClass('ruc')} />
                                    {errors.ruc && <p className="mt-1 text-sm text-red-500">{errors.ruc}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefono</label>
                                    <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className={inputClass('telefono')} />
                                    {errors.telefono && <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass('email')} />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Direccion</label>
                                    <textarea rows={2} value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} className={inputClass('direccion')} />
                                    {errors.direccion && <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                                    <input type="text" value={data.especialidad} onChange={(e) => setData('especialidad', e.target.value)} className={inputClass('especialidad')} />
                                    {errors.especialidad && <p className="mt-1 text-sm text-red-500">{errors.especialidad}</p>}
                                </div>
                                <div className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    <label className="text-sm font-medium text-gray-700">Activo</label>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea rows={3} value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className={inputClass('observaciones')} />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('proveedores.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                    {processing ? 'Actualizando...' : 'Actualizar Proveedor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
