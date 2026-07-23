import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        concepto: '',
        categoria: '',
        monto: '',
        fecha: '',
        descripcion: '',
        comprobante: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gastos.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Nuevo Gasto</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Registrar un nuevo gasto</p>
                </div>
            }
        >
            <Head title="Nuevo Gasto" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-1.5" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="concepto" value="Concepto" />
                                <TextInput
                                    id="concepto"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.concepto}
                                    onChange={(e) => setData('concepto', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.concepto} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="categoria" value="Categoría" />
                                    <select
                                        id="categoria"
                                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        value={data.categoria}
                                        onChange={(e) => setData('categoria', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="operativo">Operativo</option>
                                        <option value="administrativo">Administrativo</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                    <InputError message={errors.categoria} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="monto" value="Monto (Gs.)" />
                                    <TextInput
                                        id="monto"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.monto}
                                        onChange={(e) => setData('monto', e.target.value)}
                                        min="0"
                                        step="1"
                                        required
                                    />
                                    <InputError message={errors.monto} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="fecha" value="Fecha" />
                                <TextInput
                                    id="fecha"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.fecha}
                                    onChange={(e) => setData('fecha', e.target.value)}
                                    required
                                />
                                <InputError message={errors.fecha} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="descripcion" value="Descripción" />
                                <textarea
                                    id="descripcion"
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    rows={4}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                />
                                <InputError message={errors.descripcion} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="comprobante" value="Comprobante" />
                                <input
                                    id="comprobante"
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    onChange={(e) => setData('comprobante', e.target.files[0])}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <p className="mt-1 text-xs text-gray-400">PDF, JPG o PNG (máx. 5MB)</p>
                                <InputError message={errors.comprobante} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('gastos.index')}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton className="bg-green-600 hover:bg-green-700" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar Gasto'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
