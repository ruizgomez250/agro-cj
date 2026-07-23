import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Create({ proveedores, unidades, tipos }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        tipo: '',
        proveedor_id: '',
        cantidad: '',
        unidad: '',
        costo_unitario: '',
        fecha_recepcion: new Date().toISOString().split('T')[0],
        factura: '',
        observaciones: '',
    });

    const unidadForm = useForm({ nombre: '', abreviatura: '' });
    const [showModal, setShowModal] = useState(false);
    const tipoForm = useForm({ nombre: '' });
    const [showModalTipo, setShowModalTipo] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('insumos.store'));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const totalCalculado = (parseFloat(data.cantidad) || 0) * (parseFloat(data.costo_unitario) || 0);

    const handleGuardarUnidad = (e) => {
        e.preventDefault();
        unidadForm.post(route('unidades-medida.store'), {
            preserveState: true,
            onSuccess: (page) => {
                const nueva = page.props.unidades?.find(u => u.abreviatura === unidadForm.data.abreviatura);
                if (nueva) setData('unidad', nueva.abreviatura);
                unidadForm.reset();
                setShowModal(false);
            },
            onError: (err) => {
                const first = Object.values(err)[0];
                unidadForm.setError('general', Array.isArray(first) ? first[0] : first);
            },
        });
    };

    const handleGuardarTipo = (e) => {
        e.preventDefault();
        tipoForm.post(route('tipo-insumos.store'), {
            preserveState: true,
            onSuccess: (page) => {
                const nuevo = page.props.tipos?.find(t => t.nombre === tipoForm.data.nombre);
                if (nuevo) setData('tipo', nuevo.nombre);
                tipoForm.reset();
                setShowModalTipo(false);
            },
            onError: (err) => {
                const first = Object.values(err)[0];
                tipoForm.setError('general', Array.isArray(first) ? first[0] : first);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Nuevo Insumo</h2>}
        >
            <Head title="Crear Insumo" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass('nombre')} />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={data.tipo}
                                            onChange={(e) => setData('tipo', e.target.value)}
                                            className={`mt-1 block flex-1 rounded-lg shadow-sm border ${
                                                errors.tipo ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                                            } text-sm`}
                                        >
                                            <option value="">Seleccionar tipo</option>
                                            {tipos?.map((t) => (
                                                <option key={t.id} value={t.nombre}>{t.nombre}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowModalTipo(true)}
                                            className="mt-1 inline-flex items-center justify-center w-10 h-[38px] rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-colors"
                                            title="Agregar nuevo tipo"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                                    <select value={data.proveedor_id} onChange={(e) => setData('proveedor_id', e.target.value)} className={inputClass('proveedor_id')}>
                                        <option value="">Seleccionar proveedor</option>
                                        {proveedores?.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.proveedor_id && <p className="mt-1 text-sm text-red-500">{errors.proveedor_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                                    <input type="number" step="0.01" value={data.cantidad} onChange={(e) => setData('cantidad', e.target.value)} className={inputClass('cantidad')} />
                                    {errors.cantidad && <p className="mt-1 text-sm text-red-500">{errors.cantidad}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={data.unidad}
                                            onChange={(e) => setData('unidad', e.target.value)}
                                            className={`mt-1 block flex-1 rounded-lg shadow-sm border ${
                                                errors.unidad ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
                                            } text-sm`}
                                        >
                                            <option value="">Seleccionar unidad</option>
                                            {unidades?.map((u) => (
                                                <option key={u.id} value={u.abreviatura}>{u.nombre} ({u.abreviatura})</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(true)}
                                            className="mt-1 inline-flex items-center justify-center w-10 h-[38px] rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-colors"
                                            title="Agregar nueva unidad"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.unidad && <p className="mt-1 text-sm text-red-500">{errors.unidad}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Costo Unitario (Gs.)</label>
                                    <input type="number" value={data.costo_unitario} onChange={(e) => setData('costo_unitario', e.target.value)} className={inputClass('costo_unitario')} />
                                    {errors.costo_unitario && <p className="mt-1 text-sm text-red-500">{errors.costo_unitario}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Recepcion</label>
                                    <input type="date" value={data.fecha_recepcion} onChange={(e) => setData('fecha_recepcion', e.target.value)} className={inputClass('fecha_recepcion')} />
                                    {errors.fecha_recepcion && <p className="mt-1 text-sm text-red-500">{errors.fecha_recepcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">N Factura (opcional)</label>
                                    <input type="text" value={data.factura} onChange={(e) => setData('factura', e.target.value)} className={inputClass('factura')} />
                                    {errors.factura && <p className="mt-1 text-sm text-red-500">{errors.factura}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        rows={3}
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        className={inputClass('observaciones')}
                                    />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-emerald-800">Total Calculado:</span>
                                    <span className="text-xl font-bold text-emerald-900">{formatCurrency(totalCalculado)}</span>
                                </div>
                                <p className="text-xs text-emerald-600 mt-1">
                                    {data.cantidad || 0} x {formatCurrency(parseFloat(data.costo_unitario) || 0)}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('insumos.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Insumo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Nueva Unidad */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { setShowModal(false); unidadForm.clearErrors(); }} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">Nueva Unidad de Medida</h3>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); unidadForm.clearErrors(); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleGuardarUnidad} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={unidadForm.data.nombre}
                                    onChange={(e) => unidadForm.setData('nombre', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    placeholder="Ej: Kilogramo"
                                    required
                                    autoFocus
                                />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input
                                    type="text"
                                    value={unidadForm.data.abreviatura}
                                    onChange={(e) => unidadForm.setData('abreviatura', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    placeholder="Ej: kg"
                                    required
                                />
                                </div>

                                {unidadForm.errors.general && (
                                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{unidadForm.errors.general}</p>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                    onClick={() => { setShowModal(false); unidadForm.clearErrors(); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={unidadForm.processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                    >
                                        {unidadForm.processing ? 'Guardando...' : 'Guardar Unidad'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nuevo Tipo */}
            {showModalTipo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { setShowModalTipo(false); tipoForm.clearErrors(); }} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">Nuevo Tipo de Insumo</h3>
                                <button
                                    type="button"
                                    onClick={() => { setShowModalTipo(false); tipoForm.clearErrors(); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleGuardarTipo} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={tipoForm.data.nombre}
                                        onChange={(e) => tipoForm.setData('nombre', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        placeholder="Ej: Fertilizante"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {tipoForm.errors.general && (
                                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{tipoForm.errors.general}</p>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModalTipo(false); tipoForm.clearErrors(); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={tipoForm.processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                    >
                                        {tipoForm.processing ? 'Guardando...' : 'Guardar Tipo'}
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
