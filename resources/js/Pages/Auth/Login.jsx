import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fieldGroupStyle = { marginBottom: '1.25rem' };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: '0.45rem',
        letterSpacing: '0.01em',
    };

    const inputWrapStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    };

    const iconBaseStyle = {
        position: 'absolute',
        left: '0.85rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 2,
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 0.85rem 0.75rem 2.85rem',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '0.9rem',
        fontFamily: "'Figtree', sans-serif",
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        lineHeight: 1.4,
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesion" />

            {/* === USER AVATAR === */}
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '-70px',
                    marginBottom: '2rem',
                }}
            >
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        borderRadius: '60%',
                        overflow: 'hidden',

                        background: '#ffffff',
                        border: '6px solid rgba(255,255,255,.95)',

                        boxShadow:
                            '0 15px 40px rgba(0,0,0,.35), 0 0 30px rgba(16,185,129,.25)',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '5px solid white',
                        boxShadow:
                            '0 0 0 4px rgba(16,185,129,.25), 0 15px 35px rgba(0,0,0,.35)',
                    }}
                >
                    <img
                        src="/img/agrocj.png?v=3"
                        alt="Agro-CJ"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                <h2
                    style={{
                        marginTop: '1rem',
                        color: '#fff',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                    }}
                >
                    Bienvenido
                </h2>

                <p
                    style={{
                        color: 'rgba(255,255,255,.6)',
                        marginTop: '.35rem',
                        fontSize: '.85rem',
                    }}
                >
                    Ingrese sus credenciales
                </p>
            </div>

            {/* === STATUS MESSAGE === */}
            {status && (
                <div style={{
                    marginBottom: '1.25rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: '#34d399',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* === EMAIL FIELD === */}
                <div style={fieldGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>Correo Electronico</label>
                    <div style={inputWrapStyle}>
                        <div style={iconBaseStyle}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            autoFocus
                            placeholder="correo@ejemplo.com"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(16,185,129,0.6)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1), 0 0 24px rgba(16,185,129,0.06)';
                                e.target.style.background = 'rgba(0,0,0,0.35)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(16,185,129,0.3)';
                                e.target.style.boxShadow = 'none';
                                e.target.style.background = 'rgba(0,0,0,0.25)';
                            }}
                        />
                    </div>
                    <InputError message={errors.email} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                {/* === PASSWORD FIELD === */}
                <div style={fieldGroupStyle}>
                    <label htmlFor="password" style={labelStyle}>Contrasena</label>
                    <div style={inputWrapStyle}>
                        <div style={iconBaseStyle}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="current-password"
                            placeholder="Ingrese su contrasena"
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(16,185,129,0.6)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1), 0 0 24px rgba(16,185,129,0.06)';
                                e.target.style.background = 'rgba(0,0,0,0.35)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(16,185,129,0.3)';
                                e.target.style.boxShadow = 'none';
                                e.target.style.background = 'rgba(0,0,0,0.25)';
                            }}
                        />
                    </div>
                    <InputError message={errors.password} style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }} />
                </div>

                {/* === REMEMBER ME + FORGOT PASSWORD === */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.6)',
                        userSelect: 'none',
                    }}>
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '4px',
                                accentColor: '#10b981',
                                cursor: 'pointer',
                            }}
                        />
                        Recordarme
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            style={{
                                fontSize: '0.8rem',
                                color: 'rgba(16,185,129,0.9)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#6ee7b7'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(16,185,129,0.9)'}
                        >
                            Olvido su contrasena?
                        </Link>
                    )}
                </div>

                {/* === LOGIN BUTTON === */}
                <button
                    type="submit"
                    disabled={processing}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: 'none',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        fontFamily: "'Figtree', sans-serif",
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        opacity: processing ? 0.7 : 1,
                        boxShadow: '0 4px 24px rgba(6,95,70,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                        if (!processing) {
                            e.currentTarget.style.boxShadow = '0 6px 32px rgba(6,95,70,0.6), 0 0 48px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.filter = 'brightness(1.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(6,95,70,0.45), inset 0 1px 0 rgba(255,255,255,0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.filter = 'brightness(1)';
                    }}
                >
                    {processing ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                            Ingresando...
                        </span>
                    ) : 'Iniciar Sesion'}
                </button>
            </form>
        </GuestLayout>
    );
}
