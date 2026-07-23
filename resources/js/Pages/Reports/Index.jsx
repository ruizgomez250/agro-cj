import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const reports = [
    {
        title: 'A. Aportes de Socios',
        description: 'Detalle de aportes iniciales y mensuales por socio, estado y evolucion temporal.',
        href: 'reportes.aportes-socios',
        color: 'green',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        title: 'B. Registros de Gastos',
        description: 'Gastos varios de caja por categoria, mes y responsable.',
        href: 'reportes.gastos',
        color: 'yellow',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
        ),
    },
    {
        title: 'C. Movimiento de Gasoil',
        description: 'Recepciones, despachos, stock actual y distribucion por destino.',
        href: 'reportes.gasoil',
        color: 'red',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'D. Contratistas',
        description: 'Listado de contratistas, especialidades, tarifas y saldos.',
        href: 'reportes.contratistas',
        color: 'purple',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'E. Registro de Cultivos',
        description: 'Cultivos 2026: tipo, variedad, hectareas, fechas y rendimiento estimado.',
        href: 'reportes.cultivos',
        color: 'blue',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
        ),
    },
    {
        title: 'F. Recepcion de Insumos',
        description: 'Insumos recibidos: tipo, proveedor, cantidad, costo y cultivo asociado.',
        href: 'reportes.insumos',
        color: 'indigo',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
];

const colorMap = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100' },
    yellow: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconBg: 'bg-red-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', iconBg: 'bg-indigo-100' },
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function ReportsIndex({ resumen }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Informes y Reportes</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Informes generales del sistema Agro-CJ</p>
                </div>
            }
        >
            <Head title="Reportes" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">{resumen.total_socios}</p>
                            <p className="text-xs text-gray-500 mt-1">Socios</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{resumen.total_cultivos}</p>
                            <p className="text-xs text-gray-500 mt-1">Cultivos</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-2xl font-bold text-amber-600">{formatCurrency(resumen.total_gastos)}</p>
                            <p className="text-xs text-gray-500 mt-1">Total Gastos</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-2xl font-bold text-red-600">{resumen.total_gasoil_despacho} L</p>
                            <p className="text-xs text-gray-500 mt-1">Gasoil Despachado</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">{resumen.total_contratistas}</p>
                            <p className="text-xs text-gray-500 mt-1">Contratistas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => {
                            const c = colorMap[report.color];
                            return (
                                <Link
                                    key={report.href}
                                    href={route(report.href)}
                                    className={`group block ${c.bg} ${c.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
                                >
                                    <div className={`w-14 h-14 ${c.iconBg} rounded-xl flex items-center justify-center ${c.text} mb-4 group-hover:scale-110 transition-transform`}>
                                        {report.icon}
                                    </div>
                                    <h3 className={`text-lg font-semibold ${c.text}`}>{report.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{report.description}</p>
                                    <div className={`mt-4 text-sm font-medium ${c.text} flex items-center gap-1`}>
                                        Ver reporte
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
