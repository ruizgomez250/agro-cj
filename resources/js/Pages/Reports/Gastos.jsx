import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function Gastos({ gastos, porCategoria, porMes, totalGastos }) {
    const catLabels = porCategoria.map(c => c.categoria);
    const catData = porCategoria.map(c => c.total);
    const catCount = porCategoria.map(c => c.cantidad);

    const mesLabels = porMes.map(m => m.mes);
    const mesData = porMes.map(m => m.total);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">B. Registros de Gastos Varios - Caja</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Resumen de gastos por categoria y periodo</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.gastos" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Gastos" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Total Gastos</p>
                            <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalGastos)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Registros</p>
                            <p className="text-3xl font-bold text-gray-800">{gastos.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Categorias</p>
                            <p className="text-3xl font-bold text-purple-600">{porCategoria.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Gastos por Categoria</h3>
                            <div className="h-72">
                                {catData.length > 0 ? (
                                    <Doughnut
                                        data={{
                                            labels: catLabels,
                                            datasets: [{ data: catData, backgroundColor: COLORS.mixed, borderWidth: 2 }],
                                        }}
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos registrados</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolucion Mensual de Gastos</h3>
                            <div className="h-72">
                                {mesData.length > 0 ? (
                                    <Line
                                        data={{
                                            labels: mesLabels,
                                            datasets: [{
                                                label: 'Gastos',
                                                data: mesData,
                                                borderColor: COLORS.yellow[0],
                                                backgroundColor: COLORS.yellow[1] + '40',
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

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Detalle de Gastos</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {gastos.length > 0 ? gastos.map((g) => (
                                        <tr key={g.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-gray-500">{g.fecha}</td>
                                            <td className="px-6 py-3 font-medium text-gray-900">{g.concepto}</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{g.categoria}</span>
                                            </td>
                                            <td className="px-6 py-3 font-semibold text-red-600">{formatCurrency(g.monto)}</td>
                                            <td className="px-6 py-3 text-gray-500">{g.usuario}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No hay gastos registrados</td></tr>
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
