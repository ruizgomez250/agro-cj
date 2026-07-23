import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(amount);

export default function Edit({ insumo, proveedores, unidades, tipos }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: insumo.nombre || '',
        tipo: insumo.tipo || '',
        proveedor_id: insumo.proveedor_id || '',
        cantidad: insumo.cantidad || '',
        unidad: insumo.unidad || '',
        costo_unitario: insumo.costo_unitario || '',
        fecha_recepcion: insumo.fecha_recepcion || '',
        factura: insumo.factura || '',
        observaciones: insumo.observaciones || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('insumos.update', insumo.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const totalCalculado = (parseFloat(data.cantidad) || 0) * (parseFloat(data.costo_unitario) || 0);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Insumo</h2>}
        >
            <Head title={`Editar - ${insumo.nombre}`} />

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
                                    <select value={data.tipo} onChange={(e) => setData('tipo', e.target.value)} className={inputClass('tipo')}>
                                        <option value="">Seleccionar tipo</option>
                                        {tipos?.map((t) => (
                                            <option key={t.id} value={t.nombre}>{t.nombre}</option>
                                        ))}
                                    </select>
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
                                    <label className="block text-sm font-medium text-gray-700">Unidad</label>
                                    <select value={data.unidad} onChange={(e) => setData('unidad', e.target.value)} className={inputClass('unidad')}>
                                        <option value="">Seleccionar unidad</option>
                                        {unidades?.map((u) => (
                                            <option key={u.id} value={u.abreviatura}>{u.nombre} ({u.abreviatura})</option>
                                        ))}
                                    </select>
                                    {errors.unidad && <p className="mt-1 text-sm text-red-500">{errors.unidad}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Costo Unitario (Gs.)</label>
                                    <input type="number" value={data.costo_unitario} onChange={(e) => setData('costo_unitario', e.target.value)} className={inputClass('costo_unitario')} />
                                    {errors.costo_unitario && <p className="mt-1 text-sm text-red-500">{errors.costo_unitario}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Recepción</label>
                                    <input type="date" value={data.fecha_recepcion} onChange={(e) => setData('fecha_recepcion', e.target.value)} className={inputClass('fecha_recepcion')} />
                                    {errors.fecha_recepcion && <p className="mt-1 text-sm text-red-500">{errors.fecha_recepcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nº Factura (opcional)</label>
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

                            {/* Total Calculado */}
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
                                    {processing ? 'Actualizando...' : 'Actualizar Insumo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
