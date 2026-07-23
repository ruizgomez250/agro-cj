import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ proveedores, cultivos, tiposInsumo, unidades, productos }) {
    const { data, setData, post, processing, errors } = useForm({
        fecha: '',
        tipo: 'general',
        proveedor_id: '',
        descripcion: '',
        monto: '',
        factura: '',
        estado: 'pendiente',
        observaciones: '',
        insumo_nombre: '',
        insumo_tipo: '',
        insumo_cantidad: '',
        insumo_unidad: '',
        insumo_costo_unitario: '',
        insumo_cultivo_id: '',
        gasoil_guia_remision: '',
        gasoil_cantidad_galones: '',
        gasoil_precio_galon: '',
        producto_id: '',
        producto_cantidad: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('compras.store'));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const autoCalcMonto = (campo, valor) => {
        setData(campo, valor);
        if (data.tipo === 'insumo') {
            const c = parseFloat(campo === 'insumo_cantidad' ? valor : data.insumo_cantidad) || 0;
            const u = parseFloat(campo === 'insumo_costo_unitario' ? valor : data.insumo_costo_unitario) || 0;
            if (c > 0 && u > 0) setData('monto', (c * u).toString());
        }
        if (data.tipo === 'gasoil') {
            const g = parseFloat(campo === 'gasoil_cantidad_galones' ? valor : data.gasoil_cantidad_galones) || 0;
            const p = parseFloat(campo === 'gasoil_precio_galon' ? valor : data.gasoil_precio_galon) || 0;
            if (g > 0 && p > 0) setData('monto', (g * p).toString());
        }
        if (data.tipo === 'producto') {
            const prod = productos?.find((pr) => pr.id.toString() === (campo === 'producto_id' ? valor : data.producto_id)?.toString());
            const q = parseFloat(campo === 'producto_cantidad' ? valor : data.producto_cantidad) || 0;
            const precio = prod?.precio_unitario || 0;
            if (q > 0 && precio > 0) setData('monto', (q * precio).toString());
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Nueva Compra</h2>}
        >
            <Head title="Crear Compra" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Compra *</label>
                                    <select value={data.tipo} onChange={(e) => setData('tipo', e.target.value)} className={inputClass('tipo')}>
                                        <option value="general">General</option>
                                        <option value="insumo">Insumo</option>
                                        <option value="gasoil">Gasoil</option>
                                        <option value="producto">Producto</option>
                                    </select>
                                    {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                                    <input type="date" value={data.fecha} onChange={(e) => setData('fecha', e.target.value)} className={inputClass('fecha')} />
                                    {errors.fecha && <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Proveedor *</label>
                                    <select value={data.proveedor_id} onChange={(e) => setData('proveedor_id', e.target.value)} className={inputClass('proveedor_id')}>
                                        <option value="">Seleccionar proveedor</option>
                                        {proveedores.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.proveedor_id && <p className="mt-1 text-sm text-red-500">{errors.proveedor_id}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Descripcion *</label>
                                    <input type="text" value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={inputClass('descripcion')} placeholder="Descripcion de la compra" />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Monto (Gs.) *</label>
                                    <input type="number" value={data.monto} onChange={(e) => setData('monto', e.target.value)} className={inputClass('monto')} />
                                    {errors.monto && <p className="mt-1 text-sm text-red-500">{errors.monto}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">N Factura</label>
                                    <input type="text" value={data.factura} onChange={(e) => setData('factura', e.target.value)} className={inputClass('factura')} />
                                    {errors.factura && <p className="mt-1 text-sm text-red-500">{errors.factura}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado *</label>
                                    <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className={inputClass('estado')}>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="pagada">Pagada</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                    {errors.estado && <p className="mt-1 text-sm text-red-500">{errors.estado}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea rows={3} value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className={inputClass('observaciones')} />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            {data.tipo === 'insumo' && (
                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Datos del Insumo</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Nombre del Insumo *</label>
                                            <input type="text" value={data.insumo_nombre} onChange={(e) => setData('insumo_nombre', e.target.value)} className={inputClass('insumo_nombre')} placeholder="Ej: Fertilizante NPK" />
                                            {errors.insumo_nombre && <p className="mt-1 text-sm text-red-500">{errors.insumo_nombre}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                            <select value={data.insumo_tipo} onChange={(e) => setData('insumo_tipo', e.target.value)} className={inputClass('insumo_tipo')}>
                                                <option value="">Seleccionar tipo</option>
                                                {tiposInsumo?.map((t) => (
                                                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cultivo</label>
                                            <select value={data.insumo_cultivo_id} onChange={(e) => setData('insumo_cultivo_id', e.target.value)} className={inputClass('insumo_cultivo_id')}>
                                                <option value="">Sin cultivo</option>
                                                {cultivos?.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
                                            <input type="number" step="0.01" value={data.insumo_cantidad} onChange={(e) => autoCalcMonto('insumo_cantidad', e.target.value)} className={inputClass('insumo_cantidad')} />
                                            {errors.insumo_cantidad && <p className="mt-1 text-sm text-red-500">{errors.insumo_cantidad}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Unidad</label>
                                            <select value={data.insumo_unidad} onChange={(e) => setData('insumo_unidad', e.target.value)} className={inputClass('insumo_unidad')}>
                                                <option value="">Seleccionar unidad</option>
                                                {unidades?.map((u) => (
                                                    <option key={u.id} value={u.abreviatura}>{u.nombre} ({u.abreviatura})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Costo Unitario (Gs.)</label>
                                            <input type="number" value={data.insumo_costo_unitario} onChange={(e) => autoCalcMonto('insumo_costo_unitario', e.target.value)} className={inputClass('insumo_costo_unitario')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.tipo === 'gasoil' && (
                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Datos del Gasoil</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Guia de Remision *</label>
                                            <input type="text" value={data.gasoil_guia_remision} onChange={(e) => setData('gasoil_guia_remision', e.target.value)} className={inputClass('gasoil_guia_remision')} />
                                            {errors.gasoil_guia_remision && <p className="mt-1 text-sm text-red-500">{errors.gasoil_guia_remision}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cantidad Galones *</label>
                                            <input type="number" step="0.01" value={data.gasoil_cantidad_galones} onChange={(e) => autoCalcMonto('gasoil_cantidad_galones', e.target.value)} className={inputClass('gasoil_cantidad_galones')} />
                                            {errors.gasoil_cantidad_galones && <p className="mt-1 text-sm text-red-500">{errors.gasoil_cantidad_galones}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Precio por Galon (Gs.)</label>
                                            <input type="number" value={data.gasoil_precio_galon} onChange={(e) => autoCalcMonto('gasoil_precio_galon', e.target.value)} className={inputClass('gasoil_precio_galon')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.tipo === 'producto' && (
                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Datos del Producto</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Producto *</label>
                                            <select value={data.producto_id} onChange={(e) => { setData('producto_id', e.target.value); autoCalcMonto('producto_id', e.target.value); }} className={inputClass('producto_id')}>
                                                <option value="">Seleccionar producto</option>
                                                {productos?.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock} {p.unidad})</option>
                                                ))}
                                            </select>
                                            {errors.producto_id && <p className="mt-1 text-sm text-red-500">{errors.producto_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
                                            <input type="number" step="0.01" value={data.producto_cantidad} onChange={(e) => autoCalcMonto('producto_cantidad', e.target.value)} className={inputClass('producto_cantidad')} />
                                            {errors.producto_cantidad && <p className="mt-1 text-sm text-red-500">{errors.producto_cantidad}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('compras.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                    {processing ? 'Guardando...' : 'Guardar Compra'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
