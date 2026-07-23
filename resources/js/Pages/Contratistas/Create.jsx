import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        cedula: '',
        telefono: '',
        especialidad: '',
        tarifa_hora: '',
        saldo_actual: '',
        observaciones: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contratistas.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Nuevo Contratista</h2>
                    <Link
                        href={route('contratistas.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </Link>
                </div>
            }
        >
            <Head title="Nuevo Contratista" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Nombre */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Nombre completo"
                                        required
                                    />
                                    {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                                </div>

                                {/* Cédula */}
                                <div>
                                    <label htmlFor="cedula" className="mb-1 block text-sm font-medium text-gray-700">
                                        Cédula <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="cedula"
                                        type="text"
                                        value={data.cedula}
                                        onChange={(e) => setData('cedula', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Ej: 1234567"
                                        required
                                    />
                                    {errors.cedula && <p className="mt-1 text-xs text-red-600">{errors.cedula}</p>}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-gray-700">
                                        Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="telefono"
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Ej: 0981 123456"
                                        required
                                    />
                                    {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
                                </div>

                                {/* Especialidad */}
                                <div>
                                    <label htmlFor="especialidad" className="mb-1 block text-sm font-medium text-gray-700">
                                        Especialidad <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="especialidad"
                                        type="text"
                                        value={data.especialidad}
                                        onChange={(e) => setData('especialidad', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Ej: Cosecha, Siembra, Fumigación..."
                                        required
                                    />
                                    {errors.especialidad && <p className="mt-1 text-xs text-red-600">{errors.especialidad}</p>}
                                </div>

                                {/* Tarifa por Hora */}
                                <div>
                                    <label htmlFor="tarifa_hora" className="mb-1 block text-sm font-medium text-gray-700">
                                        Tarifa por Hora (Gs.) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="tarifa_hora"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.tarifa_hora}
                                        onChange={(e) => setData('tarifa_hora', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Ej: 50000"
                                        required
                                    />
                                    {errors.tarifa_hora && <p className="mt-1 text-xs text-red-600">{errors.tarifa_hora}</p>}
                                </div>

                                {/* Saldo Actual */}
                                <div>
                                    <label htmlFor="saldo_actual" className="mb-1 block text-sm font-medium text-gray-700">
                                        Saldo Actual (Gs.) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="saldo_actual"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.saldo_actual}
                                        onChange={(e) => setData('saldo_actual', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Ej: 0"
                                        required
                                    />
                                    {errors.saldo_actual && <p className="mt-1 text-xs text-red-600">{errors.saldo_actual}</p>}
                                </div>

                                {/* Observaciones */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="observaciones" className="mb-1 block text-sm font-medium text-gray-700">
                                        Observaciones
                                    </label>
                                    <textarea
                                        id="observaciones"
                                        rows={4}
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Notas adicionales sobre el contratista..."
                                    />
                                    {errors.observaciones && <p className="mt-1 text-xs text-red-600">{errors.observaciones}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-emerald-100 pt-5">
                                <Link
                                    href={route('contratistas.index')}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar Contratista
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
