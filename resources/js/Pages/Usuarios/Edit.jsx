import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'operador',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const inputClass = (field) =>
        `mt-1 block w-full rounded-lg shadow-sm border ${
            errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'
        } text-sm`;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Usuario</h2>}
        >
            <Head title={`Editar - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-1.5 bg-emerald-600" />
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass('name')} />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass('email')} />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                                    <select value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass('role')}>
                                        <option value="admin">Administrador</option>
                                        <option value="operador">Operador</option>
                                        <option value="consulta">Consulta</option>
                                    </select>
                                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nueva Contrasena (dejar vacio para mantener)</label>
                                    <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass('password')} />
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmar Contrasena</label>
                                    <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass('password_confirmation')} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('users.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Actualizando...' : 'Actualizar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
