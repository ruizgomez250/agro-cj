import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function Insumos({ insumos, porTipo, porMes, totalCosto }) {
    const tipoLabels = porTipo.map(t => t.tipo);
    const tipoData = porTipo.map(t => t.costo_total);
    const tipoCount = porTipo.map(t => t.cantidad);

    const mesLabels = porMes.map(m => m.mes);
    const mesData = porMes.map(m => m.total);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">F. Registro de Recepcion de Insumos</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Insumos recibidos, costos y distribucion</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.insumos" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Insumos" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Insumos</p>
                            <p className="text-3xl font-bold text-indigo-600">{insumos.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Costo Total</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalCosto)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Tipos de Insumo</p>
                            <p className="text-3xl font-bold text-blue-600">{porTipo.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Costo por Tipo de Insumo</h3>
                            <div className="h-72">
                                {tipoData.length > 0 ? (
                                    <Doughnut
                                        data={{
                                            labels: tipoLabels,
                                            datasets: [{ data: tipoData, backgroundColor: COLORS.mixed, borderWidth: 2 }],
                                        }}
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin insumos registrados</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolucion Mensual de Costos</h3>
                            <div className="h-72">
                                {mesData.length > 0 ? (
                                    <Line
                                        data={{
                                            labels: mesLabels,
                                            datasets: [{
                                                label: 'Costo Total',
                                                data: mesData,
                                                borderColor: COLORS.indigo[0],
                                                backgroundColor: COLORS.indigo[1] + '40',
                                                fill: true,
                                                tension: 0.4,
                                            }],
                                        }}
                                        options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos registrados</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {tipoCount.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Cantidad de Insumos por Tipo</h3>
                            <div className="h-64">
                                <Bar
                                    data={{
                                        labels: tipoLabels,
                                        datasets: [{
                                            label: 'Cantidad',
                                            data: tipoCount,
                                            backgroundColor: COLORS.indigo[0],
                                        }],
                                    }}
                                    options={{ ...chartOptions, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Detalle de Insumos</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cultivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {insumos.length > 0 ? insumos.map((i) => (
                                        <tr key={i.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-500">{i.fecha_recepcion}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{i.nombre}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">{i.tipo}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{i.proveedor}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">{i.cantidad} {i.unidad}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(i.costo_unitario)}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-red-600">{formatCurrency(i.total)}</td>
                                            <td className="px-4 py-3 text-gray-600">{i.cultivo}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400">No hay insumos registrados</td></tr>
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
