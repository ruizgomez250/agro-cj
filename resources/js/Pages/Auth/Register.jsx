import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: '0.45rem',
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 0.85rem',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '0.9rem',
        fontFamily: "'Figtree', sans-serif",
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'rgba(16,185,129,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1), 0 0 24px rgba(16,185,129,0.06)';
        e.target.style.background = 'rgba(0,0,0,0.35)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(16,185,129,0.3)';
        e.target.style.boxShadow = 'none';
        e.target.style.background = 'rgba(0,0,0,0.25)';
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(4,120,87,0.15) 100%)',
                    border: '2px solid rgba(16,185,129,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 40px rgba(16,185,129,0.08)',
                }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </div>
                <h2 style={{ marginTop: '1rem', fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>Crear Cuenta</h2>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.35rem' }}>
                    Registre un nuevo usuario
                </p>
            </div>

            <form onSubmit={submit}>
                <div style={{ marginBottom: '1.15rem' }}>
                    <label htmlFor="name" style={labelStyle}>Nombre</label>
                    <input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoComplete="name" autoFocus placeholder="Nombre completo" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                    <InputError message={errors.name} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                <div style={{ marginBottom: '1.15rem' }}>
                    <label htmlFor="email" style={labelStyle}>Correo Electronico</label>
                    <input id="email" type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="username" placeholder="correo@ejemplo.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                    <InputError message={errors.email} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                <div style={{ marginBottom: '1.15rem' }}>
                    <label htmlFor="password" style={labelStyle}>Contrasena</label>
                    <input id="password" type="password" name="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="new-password" placeholder="Minimo 8 caracteres" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                    <InputError message={errors.password} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="password_confirmation" style={labelStyle}>Confirmar Contrasena</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} autoComplete="new-password" placeholder="Repita la contrasena" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                    <InputError message={errors.password_confirmation} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={route('login')} style={{ fontSize: '0.8rem', color: 'rgba(16,185,129,0.9)', textDecoration: 'none', fontWeight: 500 }}>
                        Ya tengo cuenta
                    </Link>
                    <button type="submit" disabled={processing} style={{
                        padding: '0.7rem 1.5rem', border: 'none', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)',
                        color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1,
                        boxShadow: '0 4px 24px rgba(6,95,70,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                        transition: 'all 0.3s ease',
                    }}>
                        {processing ? 'Registrando...' : 'Registrar'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
