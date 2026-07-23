import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ socio }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: socio.nombre || '',
        apellido: socio.apellido || '',
        cedula: socio.cedula || '',
        telefono: socio.telefono || '',
        email: socio.email || '',
        aporte_inicial: socio.aporte_inicial || '',
        aporte_mensual: socio.aporte_mensual || '',
        fecha_ingreso: socio.fecha_ingreso || '',
        estado: socio.estado || 'activo',
        observaciones: socio.observaciones || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('socios.update', socio.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Socio</h2>}
        >
            <Head title={`Editar - ${socio.nombre} ${socio.apellido}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className={inputClass('apellido')} />
                                    {errors.apellido && <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                    <input type="text" value={data.cedula} onChange={(e) => setData('cedula', e.target.value)} className={inputClass('cedula')} />
                                    {errors.cedula && <p className="mt-1 text-sm text-red-500">{errors.cedula}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className={inputClass('telefono')} />
                                    {errors.telefono && <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass('email')} />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aporte Inicial (Gs.)</label>
                                    <input type="number" value={data.aporte_inicial} onChange={(e) => setData('aporte_inicial', e.target.value)} className={inputClass('aporte_inicial')} />
                                    {errors.aporte_inicial && <p className="mt-1 text-sm text-red-500">{errors.aporte_inicial}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aporte Mensual (Gs.)</label>
                                    <input type="number" value={data.aporte_mensual} onChange={(e) => setData('aporte_mensual', e.target.value)} className={inputClass('aporte_mensual')} />
                                    {errors.aporte_mensual && <p className="mt-1 text-sm text-red-500">{errors.aporte_mensual}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
                                    <input type="date" value={data.fecha_ingreso} onChange={(e) => setData('fecha_ingreso', e.target.value)} className={inputClass('fecha_ingreso')} />
                                    {errors.fecha_ingreso && <p className="mt-1 text-sm text-red-500">{errors.fecha_ingreso}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className={inputClass('estado')}>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                        <option value="suspendido">Suspendido</option>
                                    </select>
                                    {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        rows={4}
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        className={inputClass('observaciones')}
                                    />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('socios.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Actualizando...' : 'Actualizar Socio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
