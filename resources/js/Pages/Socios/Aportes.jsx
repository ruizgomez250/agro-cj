import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Aportes({ socios, total_aportes, chartData }) {
    const maxAporte = chartData?.length
        ? Math.max(...chartData.map((d) => Math.max(d.aporte_inicial, d.aporte_mensual)))
        : 1;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Aportes de Socios</h2>}
        >
            <Head title="Aportes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Total Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <p className="text-sm font-medium text-gray-500">Total de Aportes Recaudados</p>
                            <p className="mt-1 text-3xl font-bold text-emerald-700">{formatCurrency(total_aportes)}</p>
                        </div>
                    </div>

                    {/* Chart */}
                    {chartData && chartData.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-1.5 bg-emerald-600" />
                            <div className="p-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Comparativa de Aportes</h3>
                                <div className="flex items-end gap-2 h-64 overflow-x-auto pb-4">
                                    {chartData.map((item) => (
                                        <div key={item.id} className="flex flex-col items-center min-w-[60px] flex-shrink-0">
                                            <div className="flex items-end gap-1 h-56">
                                                <div
                                                    className="w-5 bg-emerald-400 rounded-t"
                                                    style={{ height: `${(item.aporte_inicial / maxAporte) * 100}%` }}
                                                    title={`Inicial: ${formatCurrency(item.aporte_inicial)}`}
                                                />
                                                <div
                                                    className="w-5 bg-emerald-700 rounded-t"
                                                    style={{ height: `${(item.aporte_mensual / maxAporte) * 100}%` }}
                                                    title={`Mensual: ${formatCurrency(item.aporte_mensual)}`}
                                                />
                                            </div>
                                            <span className="text-[10px] text-gray-500 mt-1 text-center leading-tight truncate w-14" title={`${item.nombre} ${item.apellido}`}>
                                                {item.nombre}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 mt-3 justify-center">
                                    <span className="flex items-center gap-1 text-xs text-gray-600">
                                        <span className="w-3 h-3 bg-emerald-400 rounded-sm inline-block" /> Aporte Inicial
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-600">
                                        <span className="w-3 h-3 bg-emerald-700 rounded-sm inline-block" /> Aporte Mensual
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre Completo', 'Cédula', 'Aporte Inicial', 'Aporte Mensual', 'Estado'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {socios.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                No hay datos de aportes disponibles.
                                            </td>
                                        </tr>
                                    ) : (
                                        socios.map((socio) => (
                                            <tr key={socio.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-500">{socio.id}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    <Link href={route('socios.show', socio.id)} className="hover:text-emerald-700 transition">
                                                        {socio.nombre} {socio.apellido}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{socio.cedula}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatCurrency(socio.aporte_inicial)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatCurrency(socio.aporte_mensual)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                                        socio.estado === 'activo' ? 'bg-green-100 text-green-800'
                                                        : socio.estado === 'inactivo' ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {socio.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
