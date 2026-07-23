import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function AportesSocios({ socios, porEstado, totalInicial, totalMensual, porMes }) {
    const estadoLabels = porEstado.map(e => e.estado);
    const estadoData = porEstado.map(e => e.total);
    const estadoColors = estadoLabels.map((_, i) => COLORS.mixed[i % COLORS.mixed.length]);

    const socioLabels = socios.map(s => s.nombre_completo);
    const inicialData = socios.map(s => s.aporte_inicial);
    const mensualData = socios.map(s => s.aporte_mensual);

    const mesLabels = porMes.map(m => m.mes);
    const mesData = porMes.map(m => m.aportes_iniciales);
    const mesCount = porMes.map(m => m.total);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">A. Aportes de Socios</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Detalle de aportes iniciales y mensuales</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.aportes-socios" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Aportes de Socios" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Socios</p>
                            <p className="text-3xl font-bold text-green-600">{socios.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Aportes Iniciales</p>
                            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalInicial)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Aportes Mensuales</p>
                            <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalMensual)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Aportes por Socio</h3>
                            <div className="h-80">
                                <Bar
                                    data={{
                                        labels: socioLabels,
                                        datasets: [
                                            { label: 'Aporte Inicial', data: inicialData, backgroundColor: COLORS.blue[0] },
                                            { label: 'Aporte Mensual', data: mensualData, backgroundColor: COLORS.green[0] },
                                        ],
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribucion por Estado</h3>
                            <div className="h-80 flex items-center justify-center">
                                <div className="w-64 h-64">
                                    <Doughnut
                                        data={{
                                            labels: estadoLabels,
                                            datasets: [{ data: estadoData, backgroundColor: estadoColors, borderWidth: 2 }],
                                        }}
                                        options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: { ...chartOptions.plugins.legend, position: 'bottom' },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {porMes.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Ingresos por Mes de Ingreso</h3>
                            <div className="h-72">
                                <Bar
                                    data={{
                                        labels: mesLabels,
                                        datasets: [
                                            { label: 'Aportes Iniciales', data: mesData, backgroundColor: COLORS.purple[0] },
                                            { label: 'Socios Ingresados', data: mesCount, backgroundColor: COLORS.green[0], yAxisID: 'y1' },
                                        ],
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: { beginAtZero: true, position: 'left', title: { display: true, text: 'Monto (Gs)' } },
                                            y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Socios' } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Detalle de Socios</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Socio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aporte Inicial</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aporte Mensual</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Ingreso</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {socios.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-900">{s.nombre_completo}</td>
                                            <td className="px-6 py-3 text-gray-600">{formatCurrency(s.aporte_inicial)}</td>
                                            <td className="px-6 py-3 text-gray-600">{formatCurrency(s.aporte_mensual)}</td>
                                            <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(s.total_aportes)}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    s.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                                    s.estado === 'inactivo' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>{s.estado}</span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">{s.fecha_ingreso}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
