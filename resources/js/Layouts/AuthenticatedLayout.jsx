import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const navItems = [
    {
        label: 'Socios',
        items: [
            { label: 'Listar Socios', href: 'socios.index' },
            { label: 'Nuevo Socio', href: 'socios.create' },
            { label: 'Aportes', href: 'socios.aportes' },
        ],
    },
    { label: 'Lotes', single: { href: 'lotes.index' } },
    {
        label: 'Cultivos',
        items: [
            { label: 'Listar Cultivos', href: 'cultivos.index' },
            { label: 'Nuevo Cultivo', href: 'cultivos.create' },
            { label: 'Aplicación de Insumos', href: 'cultivo-insumos.index' },
        ],
    },
    {
        label: 'Caja',
        items: [
            { label: 'Gastos', href: 'gastos.index' },
            { label: 'Nuevo Gasto', href: 'gastos.create' },
            { label: 'Resumen', href: 'gastos.resumen' },
        ],
    },
    { label: 'Contratistas', single: { href: 'contratistas.index' } },
    { label: 'Proveedores', single: { href: 'proveedores.index' } },
    { label: 'Empleados', single: { href: 'empleados.index' } },
    {
        label: 'Entregas',
        items: [
            { label: 'Listar', href: 'entregas.index' },
            { label: 'Nueva', href: 'entregas.create' },
        ],
    },
    {
        label: 'Compras',
        items: [
            { label: 'Listar', href: 'compras.index' },
            { label: 'Nueva', href: 'compras.create' },
        ],
    },
    {
        label: 'Almacén',
        items: [
            { label: 'Insumos', href: 'insumos.index' },
            { label: 'Productos', href: 'productos.index' },
            { label: 'Gasoil', href: 'gasoil.stock' },
        ],
    },
    { label: 'Usuarios', adminOnly: true, single: { href: 'users.index' } },
    {
        label: 'Reportes',
        items: [
            { label: 'Todos', href: 'reportes.index' },
            { label: 'Aportes Socios', href: 'reportes.aportes-socios' },
            { label: 'Gastos', href: 'reportes.gastos' },
            { label: 'Gasoil', href: 'reportes.gasoil' },
            { label: 'Contratistas', href: 'reportes.contratistas' },
            { label: 'Cultivos', href: 'reportes.cultivos' },
            { label: 'Insumos', href: 'reportes.insumos' },
        ],
    },
];

function NavDropdown({ item, isActive, isAdmin }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const visibleSubItems = item.items.filter((sub) => !sub.adminOnly || isAdmin);

    if (visibleSubItems.length === 0) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                        ? 'bg-green-700 text-white'
                        : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                }`}
            >
                {item.label}
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {visibleSubItems.map((sub) => (
                        <Link
                            key={sub.href}
                            href={route(sub.href)}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                            {sub.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.role === 'admin';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSection, setMobileSection] = useState(null);

    const currentRoute = route().current();

    const visibleItems = navItems;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 shadow-lg">
                <div className="px-3 sm:px-4 lg:px-6">
                    <div className="flex h-14 items-center justify-between gap-3">
                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0 flex-wrap justify-center">
                            <Link
                                href={route('dashboard')}
                                className={`inline-flex items-center px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                                    currentRoute === 'dashboard'
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                                }`}
                                title="Inicio"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                                </svg>
                            </Link>

                            {visibleItems.map((item) => {
                                if (item.single) {
                                    const isActive = currentRoute.startsWith(item.single.href.split('.')[0]);
                                    return (
                                        <Link
                                            key={item.single.href}
                                            href={route(item.single.href)}
                                            className={`whitespace-nowrap inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-green-700 text-white'
                                                    : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                }

                                const isActive = item.items.some((sub) => currentRoute.startsWith(sub.href.split('.').slice(0, -1).join('.')));
                                return <NavDropdown key={item.label} item={item} isActive={isActive} isAdmin={isAdmin} />;
                            })}
                        </div>

                        {/* User menu - hover */}
                        <div className="hidden sm:flex items-center shrink-0 relative group">
                            <button className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium text-green-100 hover:bg-green-700/50 hover:text-white transition-all duration-150">
                                <div className="w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center text-white text-xs font-bold">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                                <a href={route('profile.edit')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Perfil
                                </a>
                                <div className="border-t border-gray-100 my-1" />
                                <form method="POST" action={route('logout')}>
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
                                    <button type="submit" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar Sesion
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Mobile hamburger */}
                        <div className="lg:hidden flex items-center shrink-0">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="inline-flex items-center justify-center p-1.5 rounded-md text-green-100 hover:bg-green-700/50 hover:text-white transition-colors"
                            >
                                {mobileOpen ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-green-600 bg-green-800/50">
                        <div className="px-3 py-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
                            <Link
                                href={route('dashboard')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    currentRoute === 'dashboard' ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700/50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                                </svg>
                                Inicio
                            </Link>

                            {visibleItems.map((item) => {
                                const isExpanded = mobileSection === item.label;
                                const mobileSubItems = item.items ? item.items.filter((sub) => !sub.adminOnly || isAdmin) : [];
                                if (item.single) {
                                    return (
                                        <Link
                                            key={item.single.href}
                                            href={route(item.single.href)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:bg-green-700/50 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                }
                                if (mobileSubItems.length === 0) return null;
                                return (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => setMobileSection(isExpanded ? null : item.label)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:bg-green-700/50 transition-colors"
                                        >
                                            <span>{item.label}</span>
                                            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-green-600 pl-3">
                                                {mobileSubItems.map((sub) => (
                                                    <Link
                                                        key={sub.href}
                                                        href={route(sub.href)}
                                                        className="block px-2 py-1.5 rounded-md text-sm text-green-200 hover:bg-green-700/50 hover:text-white transition-colors"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <div className="border-t border-green-600 pt-2 mt-2">
                                <div className="flex items-center gap-2 px-3 py-1.5">
                                    <div className="w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center text-white text-xs font-bold">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-green-300 truncate">{user.email}</div>
                                    </div>
                                </div>
                                <Link href={route('profile.edit')} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-100 hover:bg-green-700/50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Mi Perfil
                                </Link>
                                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-300 hover:bg-green-700/50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesion
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
