import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = ({ show }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {show
            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
        }
    </svg>
);

const Login = () => {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPw,   setShowPw]   = useState(false);
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) navigate('/welcome');
        else setError(result.message);
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.06) 0%, transparent 50%), #080a10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
            padding: '24px',
        }}>
            <div style={{ width: '100%', maxWidth: '380px' }} className="fade-in">

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <svg width="36" height="36" viewBox="0 0 56 56">
                            <defs><linearGradient id="llg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399"/>
                                <stop offset="100%" stopColor="#8b5cf6"/>
                            </linearGradient></defs>
                            <circle cx="28" cy="28" r="26" fill="none" stroke="url(#llg)" strokeWidth="1.5"/>
                            <circle cx="28" cy="28" r="17" fill="#34d39908"/>
                            <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round"/>
                            <circle cx="16" cy="34" r="3"   fill="#34d399"/>
                            <circle cx="40" cy="34" r="3"   fill="#8b5cf6"/>
                            <circle cx="28" cy="12" r="2.5" fill="#38bdf8"/>
                        </svg>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.3px' }}>NiveshView</div>
                            <div style={{ fontSize: '9px', color: '#334155', letterSpacing: '2px', textTransform: 'uppercase' }}>Finance Intelligence</div>
                        </div>
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.4px', marginBottom: '6px' }}>
                        Welcome back
                    </h1>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                        Your intelligent finance companion.<br/>Sign in to continue.
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(13,16,23,0.9)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '18px',
                    padding: '28px',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.06)',
                }}>
                    {error && <div className="error-msg" style={{ fontSize: '12px' }}>{error}</div>}

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', paddingLeft: '38px', paddingRight: '14px',
                                        paddingTop: '10px', paddingBottom: '10px',
                                        background: '#0d1017', border: '1px solid #1c2133',
                                        borderRadius: '10px', fontSize: '13px', color: '#e2e8f0',
                                        outline: 'none', fontFamily: 'DM Sans, sans-serif',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#1c2133'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                                    </svg>
                                </div>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', paddingLeft: '38px', paddingRight: '40px',
                                        paddingTop: '10px', paddingBottom: '10px',
                                        background: '#0d1017', border: '1px solid #1c2133',
                                        borderRadius: '10px', fontSize: '13px', color: '#e2e8f0',
                                        outline: 'none', fontFamily: 'DM Sans, sans-serif',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#1c2133'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#334155', padding: 0,
                                }}>
                                    <EyeIcon show={showPw}/>
                                </button>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '22px' }}>
                            <span style={{ fontSize: '11px', color: '#8b5cf6', cursor: 'pointer', fontWeight: '600' }}>Forgot password?</span>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '12px',
                            background: loading ? '#4c1d95' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                            color: 'white', border: 'none', borderRadius: '10px',
                            fontSize: '13px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.3px',
                            boxShadow: loading ? 'none' : '0 4px 18px rgba(139,92,246,0.35)',
                            transition: 'all 0.2s',
                        }}>
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#1c2133' }}/>
                        <span style={{ fontSize: '10px', color: '#334155', fontWeight: '500', letterSpacing: '0.5px' }}>OR CONTINUE WITH</span>
                        <div style={{ flex: 1, height: '1px', background: '#1c2133' }}/>
                    </div>

                    <button disabled style={{
                        width: '100%', padding: '11px',
                        background: 'transparent', border: '1px solid #1c2133',
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px', cursor: 'not-allowed',
                        fontSize: '12px', fontWeight: '500', color: '#475569',
                        fontFamily: 'DM Sans, sans-serif', opacity: 0.5,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.2-2.7-.4-4z"/>
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5L31.8 34c-2 1.4-4.5 2-7.8 2-5.2 0-9.7-3.5-11.3-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.7 2.1-2 3.9-3.8 5l5.7 5c3.4-3.1 5.8-7.8 5.8-14 0-1.3-.2-2.7-.4-4z"/>
                        </svg>
                        Continue with Google  <span style={{ fontSize: '10px' }}>(Coming soon)</span>
                    </button>
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#334155', marginTop: '20px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: '600' }}>
                        Create account
                    </Link>
                </p>
                <p style={{ textAlign: 'center', fontSize: '10px', color: '#1e2130', marginTop: '12px', letterSpacing: '0.5px' }}>
                    Your finances. Your control. Powered by AI.
                </p>
            </div>
        </div>
    );
};

export default Login;
