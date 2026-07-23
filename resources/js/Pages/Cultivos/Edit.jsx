import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ cultivo, lotes }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: cultivo.nombre || '',
        variedad: cultivo.variedad || '',
        hectareas: cultivo.hectareas || '',
        fecha_siembra: cultivo.fecha_siembra || '',
        fecha_cosecha: cultivo.fecha_cosecha || '',
        lote_id: cultivo.lote_id || '',
        rendimiento_estimado: cultivo.rendimiento_estimado || '',
        estado: cultivo.estado || 'activo',
        observaciones: cultivo.observaciones || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('cultivos.update', cultivo.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('cultivos.index')}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Editar Cultivo</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Modificar datos de "{cultivo.nombre}"</p>
                    </div>
                </div>
            }
        >
            <Head title={`Editar Cultivo - ${cultivo.nombre}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* Información General */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Información General</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nombre" value="Nombre *" />
                                        <TextInput
                                            id="nombre"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.nombre} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="variedad" value="Variedad *" />
                                        <TextInput
                                            id="variedad"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.variedad}
                                            onChange={(e) => setData('variedad', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.variedad} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="hectareas" value="Hectáreas *" />
                                        <TextInput
                                            id="hectareas"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.hectareas}
                                            onChange={(e) => setData('hectareas', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.hectareas} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="lote_id" value="Lote / Parcela" />
                                        <select
                                            id="lote_id"
                                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                            value={data.lote_id}
                                            onChange={(e) => setData('lote_id', e.target.value)}
                                        >
                                            <option value="">Seleccionar lote</option>
                                            {lotes?.map((lote) => (
                                                <option key={lote.id} value={lote.id}>{lote.nombre}{lote.hectareas ? ` (${lote.hectareas} ha)` : ''}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.lote_id} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Fechas</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="fecha_siembra" value="Fecha de Siembra *" />
                                        <TextInput
                                            id="fecha_siembra"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.fecha_siembra}
                                            onChange={(e) => setData('fecha_siembra', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.fecha_siembra} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha_cosecha" value="Fecha de Cosecha" />
                                        <TextInput
                                            id="fecha_cosecha"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.fecha_cosecha}
                                            onChange={(e) => setData('fecha_cosecha', e.target.value)}
                                        />
                                        <InputError message={errors.fecha_cosecha} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Estado y Rendimiento */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Estado y Rendimiento</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="estado" value="Estado *" />
                                        <select
                                            id="estado"
                                            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                            required
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="cosechado">Cosechado</option>
                                            <option value="abandonado">Abandonado</option>
                                        </select>
                                        <InputError message={errors.estado} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="rendimiento_estimado" value="Rendimiento Estimado (kg/ha)" />
                                        <TextInput
                                            id="rendimiento_estimado"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.rendimiento_estimado}
                                            onChange={(e) => setData('rendimiento_estimado', e.target.value)}
                                        />
                                        <InputError message={errors.rendimiento_estimado} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div>
                                <InputLabel htmlFor="observaciones" value="Observaciones" />
                                <textarea
                                    id="observaciones"
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    placeholder="Notas adicionales sobre el cultivo..."
                                />
                                <InputError message={errors.observaciones} className="mt-2" />
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                            <SecondaryButton type="button" onClick={() => window.history.back()}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Actualizando...' : 'Actualizar Cultivo'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
