import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ lotes, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingLote, setEditingLote] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        hectareas: '',
        latitud: '',
        longitud: '',
    });

    const openCreate = () => {
        reset();
        setEditingLote(null);
        setShowModal(true);
    };

    const openEdit = (lote) => {
        setEditingLote(lote);
        setData({
            nombre: lote.nombre || '',
            descripcion: lote.descripcion || '',
            hectareas: lote.hectareas || '',
            latitud: lote.latitud || '',
            longitud: lote.longitud || '',
            activo: lote.activo,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingLote(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingLote) {
            put(route('lotes.update', editingLote.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('lotes.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (lote) => {
        if (confirm(`¿Está seguro de eliminar el lote "${lote.nombre}"?`)) {
            router.delete(route('lotes.destroy', lote.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('lotes.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Lotes</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Gestión de lotes y parcelas</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Lote
                    </button>
                </div>
            }
        >
            <Head title="Lotes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm w-full sm:w-64"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.activo || ''}
                                onChange={(e) => handleFilter('activo', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="1">Activos</option>
                                <option value="0">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Nombre', 'Descripcion', 'Hectareas', 'Coordenadas', 'Cultivos', 'Estado', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {lotes.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No se encontraron lotes.
                                            </td>
                                        </tr>
                                    ) : (
                                        lotes.data.map((lote) => (
                                            <tr key={lote.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm text-gray-500">{lote.id}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{lote.nombre}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{lote.descripcion || '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{lote.hectareas ? `${lote.hectareas} ha` : '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {lote.latitud && lote.longitud
                                                        ? `${lote.latitud}, ${lote.longitud}`
                                                        : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{lote.cultivos_count}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${lote.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {lote.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => openEdit(lote)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                            Editar
                                                        </button>
                                                        <button onClick={() => handleDelete(lote)} className="text-red-600 hover:text-red-800 font-medium">
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {lotes.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {lotes.from} a {lotes.to} de {lotes.total} lotes
                                </p>
                                <div className="flex items-center gap-1">
                                    {lotes.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                    : 'text-gray-300 cursor-default'
                                            }`}
                                            preserveState
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingLote ? 'Editar Lote' : 'Nuevo Lote'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} required autoFocus />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripcion</label>
                                    <textarea rows={2} value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={inputClass('descripcion')} />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hectareas</label>
                                    <input type="number" step="0.01" value={data.hectareas} onChange={(e) => setData('hectareas', e.target.value)} className={inputClass('hectareas')} />
                                    {errors.hectareas && <p className="mt-1 text-sm text-red-500">{errors.hectareas}</p>}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Coordenadas (opcional)</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Latitud</label>
                                            <input type="number" step="0.0000001" value={data.latitud} onChange={(e) => setData('latitud', e.target.value)} className={inputClass('latitud')} placeholder="-25.2637" />
                                            {errors.latitud && <p className="mt-1 text-sm text-red-500">{errors.latitud}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Longitud</label>
                                            <input type="number" step="0.0000001" value={data.longitud} onChange={(e) => setData('longitud', e.target.value)} className={inputClass('longitud')} placeholder="-57.5692" />
                                            {errors.longitud && <p className="mt-1 text-sm text-red-500">{errors.longitud}</p>}
                                        </div>
                                    </div>
                                </div>

                                {editingLote && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                                        <select value={data.activo ? '1' : '0'} onChange={(e) => setData('activo', e.target.value === '1')} className={inputClass('activo')}>
                                            <option value="1">Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                        {processing ? 'Guardando...' : editingLote ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
