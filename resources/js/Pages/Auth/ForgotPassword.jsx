import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
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
            <Head title="Olvido su Contrasena" />

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{
                    width: '68px', height: '68px', borderRadius: '50%', margin: '0 auto',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(4,120,87,0.15) 100%)',
                    border: '2px solid rgba(16,185,129,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 40px rgba(16,185,129,0.08)',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h2 style={{ marginTop: '1rem', fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>Recuperar Contrasena</h2>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    Ingrese su correo y le enviaremos un enlace para restablecer su contrasena.
                </p>
            </div>

            {status && (
                <div style={{ marginBottom: '1.25rem', padding: '0.65rem 1rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 500, color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '0.45rem' }}>Correo Electronico</label>
                    <input id="email" type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoFocus placeholder="correo@ejemplo.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    <InputError message={errors.email} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={route('login')} style={{ fontSize: '0.8rem', color: 'rgba(16,185,129,0.9)', textDecoration: 'none', fontWeight: 500 }}>
                        Volver al login
                    </Link>
                    <button type="submit" disabled={processing} style={{
                        padding: '0.7rem 1.5rem', border: 'none', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)',
                        color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                        cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1,
                        boxShadow: '0 4px 24px rgba(6,95,70,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                        transition: 'all 0.3s ease',
                    }}>
                        {processing ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
