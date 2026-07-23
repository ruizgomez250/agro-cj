import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ proveedores }) {
    const { data, setData, post, processing, errors } = useForm({
        fecha: new Date().toISOString().split('T')[0],
        proveedor_id: '',
        guia_remision: '',
        cantidad_galones: '',
        precio_galon: '',
        observaciones: '',
        comprobante: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gasoil.recepcion.store'), { forceFormData: true });
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const totalCalculado = (parseFloat(data.cantidad_galones) || 0) * (parseFloat(data.precio_galon) || 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Nueva Recepcion</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Registrar una nueva recepcion de gasoil</p>
                </div>
            }
        >
            <Head title="Nueva Recepcion de Gasoil" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                    <input type="date" value={data.fecha} onChange={(e) => setData('fecha', e.target.value)} className={inputClass('fecha')} />
                                    {errors.fecha && <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>}
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
                                    <label className="block text-sm font-medium text-gray-700">Guia de Remision</label>
                                    <input type="text" value={data.guia_remision} onChange={(e) => setData('guia_remision', e.target.value)} className={inputClass('guia_remision')} />
                                    {errors.guia_remision && <p className="mt-1 text-sm text-red-500">{errors.guia_remision}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad de Litros</label>
                                    <input type="number" step="0.01" value={data.cantidad_galones} onChange={(e) => setData('cantidad_galones', e.target.value)} className={inputClass('cantidad_galones')} />
                                    {errors.cantidad_galones && <p className="mt-1 text-sm text-red-500">{errors.cantidad_galones}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio por Litro (Gs.)</label>
                                    <input type="number" step="0.01" value={data.precio_galon} onChange={(e) => setData('precio_galon', e.target.value)} className={inputClass('precio_galon')} />
                                    {errors.precio_galon && <p className="mt-1 text-sm text-red-500">{errors.precio_galon}</p>}
                                </div>
                                <div className="flex items-end">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 w-full">
                                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Calculado</p>
                                        <p className="mt-1 text-xl font-bold text-emerald-700">
                                            {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(totalCalculado)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Comprobante</label>
                                    <input type="file" onChange={(e) => setData('comprobante', e.target.files[0])} className={inputClass('comprobante')} accept=".pdf,.jpg,.jpeg,.png" />
                                    {errors.comprobante && <p className="mt-1 text-sm text-red-500">{errors.comprobante}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        rows={4}
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        className={inputClass('observaciones')}
                                    />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('gasoil.recepcion.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Recepcion'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
