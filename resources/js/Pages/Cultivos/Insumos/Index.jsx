import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const estadoBadge = (estado) => {
    const styles = {
        programado: 'bg-yellow-100 text-yellow-800',
        aplicado: 'bg-emerald-100 text-emerald-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[estado] || 'bg-gray-100 text-gray-800'}`}>
            {estado}
        </span>
    );
};

export default function Index({ aplicaciones, cultivos, insumos, stats, filters }) {
    const [showProgramar, setShowProgramar] = useState(false);
    const [showAplicar, setShowAplicar] = useState(null);
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [flash, setFlash] = useState({ type: null, message: null });

    const todayLocal = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const programarForm = useForm({
        cultivo_id: '',
        insumo_id: '',
        fecha_programada: '',
        cantidad_aplicada: '',
        observaciones: '',
    });

    const aplicarForm = useForm({
        fecha_aplicacion: todayLocal(),
        cantidad_aplicada: '',
    });

    const openProgramar = () => {
        programarForm.reset();
        setSelectedInsumo(null);
        setShowProgramar(true);
    };

    const submitProgramar = (e) => {
        e.preventDefault();
        programarForm.post(route('cultivo-insumos.store'), {
            onSuccess: () => setShowProgramar(false),
        });
    };

    const openAplicar = (aplicacion) => {
        setShowAplicar(aplicacion);
        aplicarForm.setData({
            fecha_aplicacion: todayLocal(),
            cantidad_aplicada: aplicacion.cantidad_aplicada,
        });
        setFlash({ type: null, message: null });
    };

    const submitAplicar = (e) => {
        e.preventDefault();
        aplicarForm.post(route('cultivo-insumos.apply', showAplicar.id), {
            onSuccess: () => {
                setShowAplicar(null);
                setFlash({ type: 'success', message: 'Aplicación registrada exitosamente.' });
            },
            onError: (errors) => {
                const msg = Object.values(errors).flat().join('. ');
                setFlash({ type: 'error', message: msg || 'Error al aplicar.' });
            },
        });
    };

    const handleDelete = (aplicacion) => {
        if (confirm('¿Está seguro de eliminar esta programación?')) {
            router.delete(route('cultivo-insumos.destroy', aplicacion.id));
        }
    };

    const handleFilter = (key, value) => {
        router.get(route('cultivo-insumos.index'), { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    const onInsumoChange = (e) => {
        const id = e.target.value;
        programarForm.setData('insumo_id', id);
        const ins = insumos.find((i) => i.id.toString() === id);
        setSelectedInsumo(ins || null);
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            programarForm.errors[field] || aplicarForm.errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('cultivos.index')} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Aplicación de Insumos</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Programar y registrar aplicaciones a cultivos</p>
                        </div>
                    </div>
                    <button
                        onClick={openProgramar}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Programación
                    </button>
                </div>
            }
        >
            <Head title="Aplicación de Insumos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-yellow-500 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Programados</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.programados}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-emerald-500 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Aplicados</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.aplicados}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-blue-500 h-1.5" />
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500">Costo Total</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.costo_total)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.cultivo_id || ''}
                                onChange={(e) => handleFilter('cultivo_id', e.target.value)}
                            >
                                <option value="">Todos los cultivos</option>
                                {cultivos?.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre} - {c.variedad}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.insumo_id || ''}
                                onChange={(e) => handleFilter('insumo_id', e.target.value)}
                            >
                                <option value="">Todos los insumos</option>
                                {insumos?.map((i) => (
                                    <option key={i.id} value={i.id}>{i.nombre}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                defaultValue={filters?.estado || ''}
                                onChange={(e) => handleFilter('estado', e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="programado">Programado</option>
                                <option value="aplicado">Aplicado</option>
                            </select>
                            <input type="date" className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm" defaultValue={filters?.fecha_desde || ''} onChange={(e) => handleFilter('fecha_desde', e.target.value)} title="Desde" />
                            <input type="date" className="border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm" defaultValue={filters?.fecha_hasta || ''} onChange={(e) => handleFilter('fecha_hasta', e.target.value)} title="Hasta" />
                        </div>
                    </div>

                    {flash.type && (
                        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${flash.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            {flash.message}
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Cultivo', 'Insumo', 'Cantidad', 'F. Programada', 'F. Aplicacion', 'Estado', 'Acciones'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {aplicaciones.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No hay aplicaciones registradas.
                                            </td>
                                        </tr>
                                    ) : (
                                        aplicaciones.data.map((ap) => (
                                            <tr key={ap.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {ap.cultivo?.nombre} <span className="text-gray-400">({ap.cultivo?.variedad})</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{ap.insumo?.nombre}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                    {ap.cantidad_aplicada} {ap.insumo?.unidad}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(ap.fecha_programada)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(ap.fecha_aplicacion)}</td>
                                                <td className="px-4 py-3">{estadoBadge(ap.estado)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {ap.estado === 'programado' && (
                                                            <>
                                                                <button onClick={() => openAplicar(ap)} className="text-emerald-600 hover:text-emerald-800 font-medium">
                                                                    Aplicar
                                                                </button>
                                                                <button onClick={() => handleDelete(ap)} className="text-red-600 hover:text-red-800 font-medium">
                                                                    Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {aplicaciones.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Mostrando {aplicaciones.from} a {aplicaciones.to} de {aplicaciones.total}
                                </p>
                                <div className="flex items-center gap-1">
                                    {aplicaciones.links.map((link, i) => (
                                        <Link key={i} href={link.url || '#'} className={`px-3 py-1 text-sm rounded-lg font-medium transition ${link.active ? 'bg-emerald-600 text-white shadow-sm' : link.url ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300' : 'text-gray-300 cursor-default'}`} preserveState>
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Programar */}
            {showProgramar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowProgramar(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">Nueva Programación</h3>
                                <button onClick={() => setShowProgramar(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={submitProgramar} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cultivo *</label>
                                    <select value={programarForm.data.cultivo_id} onChange={(e) => programarForm.setData('cultivo_id', e.target.value)} className={inputClass('cultivo_id')}>
                                        <option value="">Seleccionar cultivo</option>
                                        {cultivos?.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre} - {c.variedad}</option>
                                        ))}
                                    </select>
                                    {programarForm.errors.cultivo_id && <p className="mt-1 text-sm text-red-500">{programarForm.errors.cultivo_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Insumo *</label>
                                    <select value={programarForm.data.insumo_id} onChange={onInsumoChange} className={inputClass('insumo_id')}>
                                        <option value="">Seleccionar insumo</option>
                                        {insumos?.map((i) => (
                                            <option key={i.id} value={i.id}>{i.nombre} (Stock: {i.cantidad} {i.unidad})</option>
                                        ))}
                                    </select>
                                    {programarForm.errors.insumo_id && <p className="mt-1 text-sm text-red-500">{programarForm.errors.insumo_id}</p>}
                                </div>
                                {selectedInsumo && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-800">
                                        Stock disponible: <strong>{selectedInsumo.cantidad} {selectedInsumo.unidad}</strong> — Costo unitario: <strong>{formatCurrency(selectedInsumo.costo_unitario)}</strong>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Programada *</label>
                                    <input type="date" value={programarForm.data.fecha_programada} onChange={(e) => programarForm.setData('fecha_programada', e.target.value)} className={inputClass('fecha_programada')} />
                                    {programarForm.errors.fecha_programada && <p className="mt-1 text-sm text-red-500">{programarForm.errors.fecha_programada}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad a Aplicar *</label>
                                    <input type="number" step="0.01" value={programarForm.data.cantidad_aplicada} onChange={(e) => programarForm.setData('cantidad_aplicada', e.target.value)} className={inputClass('cantidad_aplicada')} />
                                    {programarForm.errors.cantidad_aplicada && <p className="mt-1 text-sm text-red-500">{programarForm.errors.cantidad_aplicada}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea rows={2} value={programarForm.data.observaciones} onChange={(e) => programarForm.setData('observaciones', e.target.value)} className={inputClass('observaciones')} />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button type="button" onClick={() => setShowProgramar(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={programarForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                        {programarForm.processing ? 'Guardando...' : 'Programar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Aplicar */}
            {showAplicar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAplicar(null)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">Aplicar Insumo</h3>
                                <button onClick={() => setShowAplicar(null)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1 text-sm">
                                <p><strong>Cultivo:</strong> {showAplicar.cultivo?.nombre}</p>
                                <p><strong>Insumo:</strong> {showAplicar.insumo?.nombre}</p>
                                <p><strong>Programado:</strong> {formatDate(showAplicar.fecha_programada)}</p>
                                <p><strong>Cantidad planificada:</strong> {showAplicar.cantidad_aplicada} {showAplicar.insumo?.unidad}</p>
                            </div>

                            <form onSubmit={submitAplicar} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Aplicacion *</label>
                                    <input type="date" value={aplicarForm.data.fecha_aplicacion} onChange={(e) => aplicarForm.setData('fecha_aplicacion', e.target.value)} className={`mt-1 block w-full rounded-lg shadow-sm border ${aplicarForm.errors.fecha_aplicacion ? 'border-red-400' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'} text-sm`} />
                                    {aplicarForm.errors.fecha_aplicacion && <p className="mt-1 text-sm text-red-500">{aplicarForm.errors.fecha_aplicacion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad Aplicada *</label>
                                    <input type="number" step="0.01" value={aplicarForm.data.cantidad_aplicada} onChange={(e) => aplicarForm.setData('cantidad_aplicada', e.target.value)} className={`mt-1 block w-full rounded-lg shadow-sm border ${aplicarForm.errors.cantidad_aplicada ? 'border-red-400' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'} text-sm`} />
                                    {aplicarForm.errors.cantidad_aplicada && <p className="mt-1 text-sm text-red-500">{aplicarForm.errors.cantidad_aplicada}</p>}
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
                                    Al confirmar, se descontará la cantidad del stock del insumo.
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button type="button" onClick={() => setShowAplicar(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={aplicarForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                        {aplicarForm.processing ? 'Procesando...' : 'Confirmar Aplicación'}
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
