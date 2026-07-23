import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ despacho, recepciones }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        fecha: despacho.fecha || '',
        destino: despacho.destino || '',
        responsable: despacho.responsable || '',
        equipo_vehiculo: despacho.equipo_vehiculo || '',
        cantidad_galones: despacho.cantidad_galones || '',
        kilometraje: despacho.kilometraje || '',
        observaciones: despacho.observaciones || '',
        recepcion_id: despacho.recepcion_id || '',
    });

    const [selectedRecepcion, setSelectedRecepcion] = useState(() => {
        if (despacho.recepcion_id) {
            return recepciones.find((r) => r.id === despacho.recepcion_id) || null;
        }
        return null;
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gasoil.despacho.update', despacho.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const handleRecepcionChange = (e) => {
        const id = e.target.value;
        setData('recepcion_id', id);
        const rec = recepciones.find((r) => String(r.id) === String(id));
        setSelectedRecepcion(rec || null);
    };

    const stockDisponible = selectedRecepcion ? (selectedRecepcion.stock_disponible ?? 0) : null;
    const galonesSolicitados = parseFloat(data.cantidad_galones) || 0;
    const excedeStock = stockDisponible !== null && galonesSolicitados > stockDisponible;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Editar Despacho</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Modificar despacho #{despacho.id}</p>
                </div>
            }
        >
            <Head title={`Editar Despacho #${despacho.id}`} />

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
                                    <label className="block text-sm font-medium text-gray-700">Destino</label>
                                    <input type="text" value={data.destino} onChange={(e) => setData('destino', e.target.value)} className={inputClass('destino')} />
                                    {errors.destino && <p className="mt-1 text-sm text-red-500">{errors.destino}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Responsable</label>
                                    <input type="text" value={data.responsable} onChange={(e) => setData('responsable', e.target.value)} className={inputClass('responsable')} />
                                    {errors.responsable && <p className="mt-1 text-sm text-red-500">{errors.responsable}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipo / Vehiculo</label>
                                    <input type="text" value={data.equipo_vehiculo} onChange={(e) => setData('equipo_vehiculo', e.target.value)} className={inputClass('equipo_vehiculo')} />
                                    {errors.equipo_vehiculo && <p className="mt-1 text-sm text-red-500">{errors.equipo_vehiculo}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Recepcion de Origen</label>
                                    <select value={data.recepcion_id} onChange={handleRecepcionChange} className={inputClass('recepcion_id')}>
                                        <option value="">Seleccionar recepcion...</option>
                                        {recepciones.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                #{r.id} — {r.fecha} — {r.proveedor} — Guia: {r.guia_remision} — Stock: {r.stock_disponible ?? '?'} L
                                            </option>
                                        ))}
                                    </select>
                                    {errors.recepcion_id && <p className="mt-1 text-sm text-red-500">{errors.recepcion_id}</p>}
                                </div>

                                {selectedRecepcion && (
                                    <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Stock Disponible</p>
                                                <p className="text-xl font-bold text-emerald-700">{selectedRecepcion.stock_disponible} L</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Proveedor</p>
                                                <p className="text-sm font-medium text-emerald-700">{selectedRecepcion.proveedor}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad de Litros</label>
                                    <input type="number" step="0.01" value={data.cantidad_galones} onChange={(e) => setData('cantidad_galones', e.target.value)} className={inputClass('cantidad_galones')} />
                                    {errors.cantidad_galones && <p className="mt-1 text-sm text-red-500">{errors.cantidad_galones}</p>}
                                    {excedeStock && (
                                        <p className="mt-1 text-sm text-red-500 font-medium">
                                            La cantidad ({galonesSolicitados} L) excede el stock disponible ({stockDisponible} L).
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
                                    <input type="number" step="0.01" value={data.kilometraje} onChange={(e) => setData('kilometraje', e.target.value)} className={inputClass('kilometraje')} />
                                    {errors.kilometraje && <p className="mt-1 text-sm text-red-500">{errors.kilometraje}</p>}
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
                                    href={route('gasoil.despacho.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || excedeStock}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Actualizando...' : 'Actualizar Despacho'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
