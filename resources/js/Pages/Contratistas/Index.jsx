import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const especialidadColors = {
    'Cosecha': 'bg-amber-100 text-amber-800',
    'Siembra': 'bg-green-100 text-green-800',
    'Fumigación': 'bg-red-100 text-red-800',
    'Mecanización': 'bg-blue-100 text-blue-800',
    'Riego': 'bg-cyan-100 text-cyan-800',
    'Poda': 'bg-purple-100 text-purple-800',
    'Fertilización': 'bg-lime-100 text-lime-800',
    'General': 'bg-gray-100 text-gray-800',
};

const getEspecialidadColor = (especialidad) =>
    especialidadColors[especialidad] || 'bg-emerald-100 text-emerald-800';

export default function Index({ contratistas, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [especialidad, setEspecialidad] = useState(filters?.especialidad || '');
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('contratistas.index'), { search, especialidad }, { preserveState: true, replace: true });
    };

    const handleEspecialidadFilter = (value) => {
        setEspecialidad(value);
        router.get(route('contratistas.index'), { search, especialidad: value }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        router.delete(route('contratistas.destroy', id), {
            onFinish: () => setShowDeleteModal(null),
        });
    };

    const uniqueEspecialidades = [...new Set(contratistas.data?.map((c) => c.especialidad).filter(Boolean))];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Contratistas</h2>
                    <Link
                        href={route('contratistas.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Contratista
                    </Link>
                </div>
            }
        >
            <Head title="Contratistas" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100">
                                    <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Contratistas</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Especialidades</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total_especialidades || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Saldo Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.saldo_total || 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Buscar</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nombre, cédula o especialidad..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Especialidad</label>
                                <select
                                    value={especialidad}
                                    onChange={(e) => handleEspecialidadFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">Todas</option>
                                    {uniqueEspecialidades.map((esp) => (
                                        <option key={esp} value={esp}>{esp}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Buscar
                            </button>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-emerald-100 bg-emerald-50">
                                        <th className="px-4 py-3 font-medium text-emerald-800">ID</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Nombre</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Cédula</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Teléfono</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Especialidad</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Tarifa/Hora</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Saldo Actual</th>
                                        <th className="px-4 py-3 font-medium text-emerald-800">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contratistas.data?.length > 0 ? (
                                        contratistas.data.map((contratista) => (
                                            <tr key={contratista.id} className="transition hover:bg-emerald-50/30">
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-500">#{contratista.id}</td>
                                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">{contratista.nombre}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{contratista.cedula}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{contratista.telefono}</td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEspecialidadColor(contratista.especialidad)}`}>
                                                        {contratista.especialidad}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatCurrency(contratista.tarifa_hora)}</td>
                                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">{formatCurrency(contratista.saldo_actual)}</td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={route('contratistas.show', contratista.id)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-100"
                                                            title="Ver"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={route('contratistas.edit', contratista.id)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-100"
                                                            title="Editar"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => setShowDeleteModal(contratista)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-100"
                                                            title="Eliminar"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                                                No se encontraron contratistas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {contratistas.links && contratistas.links.length > 3 && (
                            <div className="flex items-center justify-between border-t border-emerald-100 bg-emerald-50/30 px-4 py-3">
                                <p className="text-sm text-gray-600">
                                    Mostrando {contratistas.from} a {contratistas.to} de {contratistas.total} resultados
                                </p>
                                <div className="flex items-center gap-1">
                                    {contratistas.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : link.url
                                                    ? 'text-gray-600 hover:bg-emerald-100'
                                                    : 'cursor-not-allowed text-gray-300'
                                            }`}
                                            preserveState={link.url ? true : false}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-800">Eliminar Contratista</h3>
                        <p className="mb-6 text-sm text-gray-600">
                            ¿Estás seguro de que deseas eliminar a <strong>{showDeleteModal.nombre}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal.id)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
