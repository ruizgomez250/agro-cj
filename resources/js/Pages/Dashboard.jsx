import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function StatCard({ title, value, subtitle, icon, color = 'green', href }) {
    const colors = {
        green: 'from-green-500 to-green-600',
        blue: 'from-blue-500 to-blue-600',
        yellow: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
        indigo: 'from-indigo-500 to-indigo-600',
    };

    const content = (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                        {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
                    </div>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white`}>
                        {icon}
                    </div>
                </div>
            </div>
            {href && (
                <Link href={href} className="block bg-gray-50 px-5 py-2.5 text-xs font-medium text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors border-t border-gray-100">
                    Ver detalle &rarr;
                </Link>
            )}
        </div>
    );

    return content;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);
}

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Resumen general del sistema Agro-CJ</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard
                            title="Socios Activos"
                            value={stats.socios.activos}
                            subtitle={`${stats.socios.total} total`}
                            color="green"
                            href={route('socios.index')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Cultivos Activos"
                            value={stats.cultivos.activos}
                            subtitle={`${stats.cultivos.hectareas} hectareas`}
                            color="blue"
                            href={route('cultivos.index')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Gastos del Mes"
                            value={formatCurrency(stats.gastos.total_mes)}
                            subtitle={`${formatCurrency(stats.gastos.total_anio)} en el anio`}
                            color="yellow"
                            href={route('gastos.index')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Insumos"
                            value={stats.insumos.total}
                            subtitle={`Costo total: ${formatCurrency(stats.insumos.costo_total)}`}
                            color="purple"
                            href={route('insumos.index')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Gasoil"
                            value={`${stats.gasoil.recepciones} recepciones`}
                            subtitle={`${stats.gasoil.despachos} despachos`}
                            color="red"
                            href={route('gasoil.stock')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Contratistas"
                            value={stats.contratistas.total}
                            color="indigo"
                            href={route('contratistas.index')}
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
