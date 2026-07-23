import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ empleados, insumos, productos }) {
    const { data, setData, post, processing, errors } = useForm({
        empleado_id: '',
        tipo: 'insumo',
        referencia_id: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('entregas.store'));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    const referentes = data.tipo === 'insumo' ? insumos : productos;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Nueva Entrega</h2>}
        >
            <Head title="Crear Entrega" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Empleado *</label>
                                    <select value={data.empleado_id} onChange={(e) => setData('empleado_id', e.target.value)} className={inputClass('empleado_id')}>
                                        <option value="">Seleccionar empleado</option>
                                        {empleados?.map((emp) => (
                                            <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido} (CI: {emp.cedula})</option>
                                        ))}
                                    </select>
                                    {errors.empleado_id && <p className="mt-1 text-sm text-red-500">{errors.empleado_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                                    <select value={data.tipo} onChange={(e) => { setData('tipo', e.target.value); setData('referencia_id', ''); }} className={inputClass('tipo')}>
                                        <option value="insumo">Insumo</option>
                                        <option value="producto">Producto</option>
                                    </select>
                                    {errors.tipo && <p className="mt-1 text-sm text-red-500">{errors.tipo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {data.tipo === 'insumo' ? 'Insumo *' : 'Producto *'}
                                    </label>
                                    <select value={data.referencia_id} onChange={(e) => setData('referencia_id', e.target.value)} className={inputClass('referencia_id')}>
                                        <option value="">
                                            {data.tipo === 'insumo' ? 'Seleccionar insumo' : 'Seleccionar producto'}
                                        </option>
                                        {referentes?.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.nombre} (Disponible: {data.tipo === 'insumo' ? r.cantidad : r.stock} {r.unidad})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.referencia_id && <p className="mt-1 text-sm text-red-500">{errors.referencia_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
                                    <input type="number" step="0.01" value={data.cantidad} onChange={(e) => setData('cantidad', e.target.value)} className={inputClass('cantidad')} />
                                    {errors.cantidad && <p className="mt-1 text-sm text-red-500">{errors.cantidad}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                                    <input type="date" value={data.fecha} onChange={(e) => setData('fecha', e.target.value)} className={inputClass('fecha')} />
                                    {errors.fecha && <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea rows={3} value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className={inputClass('observaciones')} />
                                    {errors.observaciones && <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('entregas.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50">
                                    {processing ? 'Guardando...' : 'Registrar Entrega'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
