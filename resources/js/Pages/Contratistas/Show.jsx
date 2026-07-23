import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const especialidadColors = {
    'Cosecha': 'bg-amber-100 text-amber-800',
    'Siembra': 'bg-green-100 text-green-800',
    'Fumigación': 'bg-red-100 text-red-800',
    'Mecanización': 'bg-blue-100 text-blue-800',
    'Riego': 'bg-cyan-100 text-cyan-800',
    'Poda': 'bg-purple-100 text-purple-800',
    'Fertilización': 'bg-lime-100 text-lime-800',
    'General': 'bg-gray-100 text-gray-800',
};

const getEspecialidadColor = (especialidad) =>
    especialidadColors[especialidad] || 'bg-emerald-100 text-emerald-800';

export default function Show({ contratista }) {
    const fields = [
        { label: 'ID', value: `#${contratista.id}` },
        { label: 'Nombre', value: contratista.nombre },
        { label: 'Cédula', value: contratista.cedula },
        { label: 'Teléfono', value: contratista.telefono },
        {
            label: 'Especialidad',
            value: (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEspecialidadColor(contratista.especialidad)}`}>
                    {contratista.especialidad}
                </span>
            ),
        },
        { label: 'Tarifa por Hora', value: formatCurrency(contratista.tarifa_hora), highlight: true },
        { label: 'Saldo Actual', value: formatCurrency(contratista.saldo_actual), highlight: true },
        { label: 'Observaciones', value: contratista.observaciones || '—', full: true },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Detalle del Contratista</h2>
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
            <Head title={contratista.nombre} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                        {/* Header */}
                        <div className="border-b border-emerald-100 bg-emerald-50/50 px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white shadow-sm">
                                    {contratista.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{contratista.nombre}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEspecialidadColor(contratista.especialidad)}`}>
                                            {contratista.especialidad}
                                        </span>
                                        <span className="text-sm text-gray-500">ID: #{contratista.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {fields.map((field, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-lg border border-gray-100 bg-gray-50/50 p-4 ${
                                            field.full ? 'sm:col-span-2' : ''
                                        }`}
                                    >
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                                            {field.label}
                                        </p>
                                        <p
                                            className={`text-sm ${
                                                field.highlight
                                                    ? 'text-lg font-bold text-emerald-700'
                                                    : 'font-medium text-gray-800'
                                            }`}
                                        >
                                            {field.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-emerald-100 px-6 py-4">
                            <Link
                                href={route('contratistas.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Volver al Listado
                            </Link>
                            <Link
                                href={route('contratistas.edit', contratista.id)}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar Contratista
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
