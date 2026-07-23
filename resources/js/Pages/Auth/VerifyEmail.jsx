import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar Email" />

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', margin: '0 auto', background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(4,120,87,0.15) 100%)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 40px rgba(16,185,129,0.08)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <h2 style={{ marginTop: '1rem', fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>Verificar Correo</h2>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    Verifique su correo electronico haciendo clic en el enlace que le enviamos.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div style={{ marginBottom: '1.25rem', padding: '0.65rem 1rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 500, color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    Se envio un nuevo enlace de verificacion a su correo.
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button type="submit" disabled={processing} style={{ padding: '0.7rem 1.5rem', border: 'none', borderRadius: '14px', background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, boxShadow: '0 4px 24px rgba(6,95,70,0.45), inset 0 1px 0 rgba(255,255,255,0.15)', transition: 'all 0.3s ease' }}>
                        {processing ? 'Enviando...' : 'Reenviar correo'}
                    </button>
                    <Link href={route('logout')} method="post" as="button" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Figtree', sans-serif" }}>
                        Cerrar sesion
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
