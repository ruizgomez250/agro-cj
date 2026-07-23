import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

export default function Cultivos({ cultivos, porTipo, porEstado, totalHectareas, totalRendimiento }) {
    const tipoLabels = porTipo.map(t => t.nombre);
    const tipoHectareas = porTipo.map(t => t.total_hectareas);
    const tipoCount = porTipo.map(t => t.cantidad);

    const estadoLabels = porEstado.map(e => e.estado);
    const estadoData = porEstado.map(e => e.total);
    const estadoHectareas = porEstado.map(e => e.hectareas);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">E. Registro de Cultivos 2026</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Cultivos, hectareas y rendimiento estimado</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.cultivos" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Cultivos" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Cultivos</p>
                            <p className="text-3xl font-bold text-blue-600">{cultivos.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Hectareas</p>
                            <p className="text-3xl font-bold text-green-600">{totalHectareas} ha</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Rendimiento Estimado</p>
                            <p className="text-3xl font-bold text-amber-600">{totalRendimiento > 0 ? totalRendimiento + ' kg' : '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Hectareas por Tipo de Cultivo</h3>
                            <div className="h-72">
                                {tipoHectareas.length > 0 ? (
                                    <Bar
                                        data={{
                                            labels: tipoLabels,
                                            datasets: [{
                                                label: 'Hectareas',
                                                data: tipoHectareas,
                                                backgroundColor: COLORS.mixed.slice(0, tipoLabels.length),
                                            }],
                                        }}
                                        options={{ ...chartOptions, indexAxis: 'y', scales: { x: { beginAtZero: true } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin cultivos registrados</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribucion por Estado</h3>
                            <div className="h-72 flex items-center justify-center">
                                <div className="w-64 h-64">
                                    {estadoData.length > 0 ? (
                                        <Doughnut
                                            data={{
                                                labels: estadoLabels,
                                                datasets: [{ data: estadoData, backgroundColor: COLORS.mixed, borderWidth: 2 }],
                                            }}
                                            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {tipoCount.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Cantidad de Cultivos por Tipo</h3>
                            <div className="h-64">
                                <Bar
                                    data={{
                                        labels: tipoLabels,
                                        datasets: [{
                                            label: 'Cantidad',
                                            data: tipoCount,
                                            backgroundColor: COLORS.green[0],
                                        }],
                                    }}
                                    options={{ ...chartOptions, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Detalle de Cultivos</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cultivo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variedad</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hectareas</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siembra</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cosecha</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rend. Est.</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cultivos.length > 0 ? cultivos.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900 capitalize">{c.nombre}</td>
                                            <td className="px-4 py-3 text-gray-600">{c.variedad}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-blue-600">{c.hectareas}</td>
                                            <td className="px-4 py-3 text-gray-600">{c.lote_parcela}</td>
                                            <td className="px-4 py-3 text-gray-500">{c.fecha_siembra}</td>
                                            <td className="px-4 py-3 text-gray-500">{c.fecha_cosecha || '-'}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">{c.rendimiento_estimado ? c.rendimiento_estimado + ' kg' : '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    c.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                                    c.estado === 'cosechado' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>{c.estado}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400">No hay cultivos registrados</td></tr>
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
