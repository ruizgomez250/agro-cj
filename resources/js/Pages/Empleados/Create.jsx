import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido: '',
        cedula: '',
        cargo: '',
        telefono: '',
        email: '',
        direccion: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('empleados.store'));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Nuevo Empleado</h2>}
        >
            <Head title="Crear Empleado" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                                    <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className={inputClass('apellido')} />
                                    {errors.apellido && <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cedula *</label>
                                    <input type="text" value={data.cedula} onChange={(e) => setData('cedula', e.target.value)} className={inputClass('cedula')} placeholder="Ej: 1234567" />
                                    {errors.cedula && <p className="mt-1 text-sm text-red-500">{errors.cedula}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cargo</label>
                                    <input type="text" value={data.cargo} onChange={(e) => setData('cargo', e.target.value)} className={inputClass('cargo')} placeholder="Ej: Peon" />
                                    {errors.cargo && <p className="mt-1 text-sm text-red-500">{errors.cargo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefono</label>
                                    <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className={inputClass('telefono')} />
                                    {errors.telefono && <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass('email')} />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Direccion</label>
                                    <input type="text" value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} className={inputClass('direccion')} />
                                    {errors.direccion && <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('empleados.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                    {processing ? 'Guardando...' : 'Guardar Empleado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
