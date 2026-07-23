import { Link, Head } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Agro-CJ" />
            <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex flex-col items-center justify-center px-4">
                <div className="max-w-2xl text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                            <svg className="w-12 h-12 text-white" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4C14 4 10 10 10 16c0 4 2 7 5 9l1 1v5c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-5l1-1c3-2 5-5 5-9 0-6-4-12-10-12z" fill="currentColor" opacity="0.9"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Agro-CJ</h1>
                        <p className="text-lg text-green-100 mb-2">Sistema de Gestion Agricola</p>
                        <p className="text-green-200/80 text-sm max-w-md mx-auto">
                            Administra socios, cultivos, insumos, gastos, gasoil y contratistas en un solo lugar.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 text-left">
                        {[
                            { icon: '👥', label: 'Socios', desc: 'Gestion de miembros' },
                            { icon: '🌾', label: 'Cultivos', desc: 'Seguimiento de siembras' },
                            { icon: '📦', label: 'Insumos', desc: 'Control de insumos' },
                            { icon: '💰', label: 'Caja', desc: 'Registro de gastos' },
                            { icon: '⛽', label: 'Gasoil', desc: 'Recepcion y despacho' },
                            { icon: '👷', label: 'Contratistas', desc: 'Personal externo' },
                        ].map((item) => (
                            <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-white font-medium text-sm">{item.label}</div>
                                <div className="text-green-200/60 text-xs">{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                            >
                                Iniciar Sesion
                            </Link>
                        )}
                        {canRegister && (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center px-8 py-3 bg-green-500/30 text-white font-semibold rounded-xl border border-white/20 hover:bg-green-500/50 transition-colors"
                            >
                                Registrarse
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mt-16 text-green-200/40 text-xs">
                    Agro-CJ &copy; {new Date().getFullYear()} - Sistema de Gestion Agricola
                </div>
            </div>
        </>
    );
}
