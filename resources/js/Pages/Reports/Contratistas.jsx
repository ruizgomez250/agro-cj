import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function Contratistas({ contratistas, porEspecialidad, totalSaldo }) {
    const espLabels = porEspecialidad.map(e => e.especialidad);
    const espData = porEspecialidad.map(e => e.total);
    const espSaldo = porEspecialidad.map(e => e.saldo_total);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">D. Contratistas</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Listado de contratistas, especialidades y saldos</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.contratistas" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Contratistas" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Contratistas</p>
                            <p className="text-3xl font-bold text-purple-600">{contratistas.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Saldo Total</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalSaldo)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Especialidades</p>
                            <p className="text-3xl font-bold text-blue-600">{porEspecialidad.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Contratistas por Especialidad</h3>
                            <div className="h-72">
                                {espData.length > 0 ? (
                                    <Doughnut
                                        data={{
                                            labels: espLabels,
                                            datasets: [{ data: espData, backgroundColor: COLORS.mixed, borderWidth: 2 }],
                                        }}
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin contratistas registrados</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Saldo por Especialidad</h3>
                            <div className="h-72">
                                {espSaldo.length > 0 ? (
                                    <Bar
                                        data={{
                                            labels: espLabels,
                                            datasets: [{
                                                label: 'Saldo Total',
                                                data: espSaldo,
                                                backgroundColor: COLORS.mixed.slice(0, espSaldo.length),
                                            }],
                                        }}
                                        options={{ ...chartOptions, indexAxis: 'y', scales: { x: { beginAtZero: true } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos registrados</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Detalle de Contratistas</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tarifa/Hora</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Actual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contratistas.length > 0 ? contratistas.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-900">{c.nombre}</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">{c.especialidad}</span>
                                            </td>
                                            <td className="px-6 py-3 text-right text-gray-600">{c.tarifa_hora > 0 ? formatCurrency(c.tarifa_hora) : '-'}</td>
                                            <td className={`px-6 py-3 text-right font-semibold ${c.saldo_actual > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(c.saldo_actual)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No hay contratistas registrados</td></tr>
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
