import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ lote }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: lote.nombre || '',
        descripcion: lote.descripcion || '',
        hectareas: lote.hectareas || '',
        latitud: lote.latitud || '',
        longitud: lote.longitud || '',
        activo: lote.activo ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('lotes.update', lote.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('lotes.index')} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Editar Lote</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Modificar "{lote.nombre}"</p>
                    </div>
                </div>
            }
        >
            <Head title={`Editar Lote - ${lote.nombre}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} required />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Descripcion</label>
                                    <textarea rows={2} value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={inputClass('descripcion')} />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hectareas</label>
                                    <input type="number" step="0.01" value={data.hectareas} onChange={(e) => setData('hectareas', e.target.value)} className={inputClass('hectareas')} />
                                    {errors.hectareas && <p className="mt-1 text-sm text-red-500">{errors.hectareas}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select value={data.activo ? '1' : '0'} onChange={(e) => setData('activo', e.target.value === '1')} className={inputClass('activo')}>
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Coordenadas (opcional)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Latitud</label>
                                    <input type="number" step="0.0000001" value={data.latitud} onChange={(e) => setData('latitud', e.target.value)} className={inputClass('latitud')} placeholder="-25.2637" />
                                    {errors.latitud && <p className="mt-1 text-sm text-red-500">{errors.latitud}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Longitud</label>
                                    <input type="number" step="0.0000001" value={data.longitud} onChange={(e) => setData('longitud', e.target.value)} className={inputClass('longitud')} placeholder="-57.5692" />
                                    {errors.longitud && <p className="mt-1 text-sm text-red-500">{errors.longitud}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                            <Link href={route('lotes.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                {processing ? 'Actualizando...' : 'Actualizar Lote'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
