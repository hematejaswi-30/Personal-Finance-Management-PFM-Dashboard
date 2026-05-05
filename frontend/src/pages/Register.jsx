import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('❌ Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('❌ Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}
                    className="fade-in">
                    <div style={{ marginBottom: '16px' }}>
                        <svg width="48" height="48" viewBox="0 0 56 56">
                            <defs>
                                <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#34d399"/>
                                    <stop offset="100%" stopColor="#818cf8"/>
                                </linearGradient>
                            </defs>
                            <circle cx="28" cy="28" r="26" fill="none" stroke="url(#lg2)" strokeWidth="1.5"/>
                            <circle cx="28" cy="28" r="17" fill="#34d39911"/>
                            <circle cx="28" cy="28" r="8" fill="#818cf822"/>
                            <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round"/>
                            <circle cx="16" cy="34" r="3" fill="#34d399"/>
                            <circle cx="40" cy="34" r="3" fill="#818cf8"/>
                            <circle cx="28" cy="12" r="2.5" fill="#38bdf8"/>
                        </svg>
                    </div>
                    <h1 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '26px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.5px'
                    }}>NiveshView</h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        marginTop: '4px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}>Finance AI</p>
                </div>

                {/* Card */}
                <div className="card fade-in" style={{
                    animationDelay: '0.1s',
                    opacity: 0
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '6px'
                    }}>Create account</h2>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginBottom: '24px'
                    }}>Start managing your finances with AI</p>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="label">Confirm Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="divider" />

                    <p style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        color: 'var(--text-muted)'
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{
                            color: 'var(--accent-purple)',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '24px',
                    letterSpacing: '0.5px'
                }}>
                    Your finances. Your control. Powered by AI.
                </p>
            </div>
        </div>
    );
};

export default Register;
