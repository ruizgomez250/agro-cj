import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { COLORS, chartOptions } from '@/chartConfig';
import ExportButtons from '@/Components/ExportButtons';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function Gasoil({ recepciones, despachos, totalRecepcionGalones, totalRecepcionMonto, totalDespachoGalones, stockActual, despachoPorDestino, despachoPorMes }) {
    const destinoLabels = despachoPorDestino.map(d => d.destino);
    const destinoData = despachoPorDestino.map(d => d.total);

    const mesLabels = despachoPorMes.map(m => m.mes);
    const mesData = despachoPorMes.map(m => m.total);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">C. Movimiento de Gasoil</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Recepciones, despachos y stock actual</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExportButtons routeName="reportes.export.gasoil" />
                        <Link href={route('reportes.index')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                            &larr; Volver a Reportes
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Reporte - Gasoil" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Recepcion Total</p>
                            <p className="text-2xl font-bold text-blue-600">{totalRecepcionGalones} L</p>
                            <p className="text-xs text-gray-400 mt-1">{formatCurrency(totalRecepcionMonto)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Despacho Total</p>
                            <p className="text-2xl font-bold text-red-600">{totalDespachoGalones} L</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Stock Actual</p>
                            <p className={`text-2xl font-bold ${stockActual > 0 ? 'text-green-600' : 'text-red-600'}`}>{stockActual} L</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                            <p className="text-sm text-gray-500">Recepciones</p>
                            <p className="text-2xl font-bold text-gray-800">{recepciones.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Despacho por Destino</h3>
                            <div className="h-72">
                                {destinoData.length > 0 ? (
                                    <Doughnut
                                        data={{
                                            labels: destinoLabels,
                                            datasets: [{ data: destinoData, backgroundColor: COLORS.mixed, borderWidth: 2 }],
                                        }}
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin despachos registrados</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolucion Mensual de Despacho</h3>
                            <div className="h-72">
                                {mesData.length > 0 ? (
                                    <Bar
                                        data={{
                                            labels: mesLabels,
                                            datasets: [{
                                                label: 'Litros Despachados',
                                                data: mesData,
                                                backgroundColor: COLORS.red[0],
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Recepciones</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Litros</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio/Litro</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recepciones.length > 0 ? recepciones.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-500">{r.fecha}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{r.proveedor}</td>
                                                <td className="px-4 py-3 text-right text-blue-600 font-semibold">{r.cantidad_galones}</td>
                                                <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(r.precio_galon)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(r.total)}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No hay recepciones registradas</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700">Despachos</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Litros</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {despachos.length > 0 ? despachos.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-500">{d.fecha}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">{d.destino}</span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{d.responsable}</td>
                                                <td className="px-4 py-3 text-gray-600">{d.equipo_vehiculo}</td>
                                                <td className="px-4 py-3 text-right text-red-600 font-semibold">{d.cantidad_galones}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No hay despachos registrados</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
