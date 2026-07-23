import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const estadoBadge = (estado) => {
    const styles = {
        activo: 'bg-green-100 text-green-800 border-green-200',
        inactivo: 'bg-red-100 text-red-800 border-red-200',
        suspendido: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize border ${styles[estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {estado}
        </span>
    );
};

export default function Show({ socio }) {
    const fields = [
        { label: 'Nombre', value: socio.nombre },
        { label: 'Apellido', value: socio.apellido },
        { label: 'Cédula', value: socio.cedula },
        { label: 'Teléfono', value: socio.telefono },
        { label: 'Email', value: socio.email },
        { label: 'Aporte Inicial', value: formatCurrency(socio.aporte_inicial) },
        { label: 'Aporte Mensual', value: formatCurrency(socio.aporte_mensual) },
        { label: 'Fecha de Ingreso', value: socio.fecha_ingreso },
        { label: 'Estado', value: socio.estado, isStatus: true },
        { label: 'Observaciones', value: socio.observaciones || '—', full: true },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Detalle del Socio</h2>}
        >
            <Head title={`${socio.nombre} ${socio.apellido}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{socio.nombre} {socio.apellido}</h3>
                                <p className="text-sm text-gray-500">ID: {socio.id}</p>
                            </div>
                            {estadoBadge(socio.estado)}
                        </div>

                        {/* Fields */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.label} className={field.full ? 'sm:col-span-2' : ''}>
                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{field.label}</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {field.isStatus ? estadoBadge(field.value) : field.value}
                                        </dd>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <Link
                                href={route('socios.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition"
                            >
                                Volver
                            </Link>
                            <Link
                                href={route('socios.edit', socio.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
