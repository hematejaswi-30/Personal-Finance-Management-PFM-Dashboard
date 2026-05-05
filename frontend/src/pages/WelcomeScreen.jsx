import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccounts, getTransactions } from '../services/api';

const WelcomeScreen = () => {
    const { user } = useAuth();
    const navigate  = useNavigate();
    const [accounts,     setAccounts]     = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading,      setLoading]      = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [aR, tR] = await Promise.all([getAccounts(), getTransactions()]);
                setAccounts(aR.data || []);
                setTransactions(tR.data || []);
            } catch (_) {}
            finally { setLoading(false); }
        })();
    }, []);

    const totalBalance  = accounts.reduce((s, a) => s + a.balance, 0);
    const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate   = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0.0';


    const hour      = new Date().getHours();
    const cubes = [
        { label: 'Income',     emoji: '📈', path: '/income',     bg: 'linear-gradient(135deg,#34d399,#059669)', glow: 'rgba(52,211,153,0.35)' },
        { label: 'Accounts',   emoji: '🏦', path: '/accounts',   bg: 'linear-gradient(135deg,#38bdf8,#0284c7)', glow: 'rgba(56,189,248,0.35)' },
        { label: 'AI Insights',emoji: '✦',  path: '/ai-advisor', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: 'rgba(245,158,11,0.35)' },
    ];

    /* Insight badge based on real data */
    const insight = savingsRate > 20
        ? { icon: '🎯', text: `Savings rate ${savingsRate}% — Great!`, color: '#34d399' }
        : totalExpenses > totalIncome
        ? { icon: '⚠️', text: 'Expenses exceed income this period', color: '#f43f5e' }
        : { icon: '💡', text: 'Ask AI Advisor for personalised tips', color: '#8b5cf6' };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--text-primary)',
            transition: 'background 0.3s',
        }}>
            {/* ── Top Bar ── */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '0 36px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 20,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="30" height="30" viewBox="0 0 56 56">
                        <defs><linearGradient id="wlg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
                        <circle cx="28" cy="28" r="26" fill="none" stroke="url(#wlg2)" strokeWidth="2"/>
                        <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="16" cy="34" r="3.5" fill="#34d399"/>
                        <circle cx="40" cy="34" r="3.5" fill="#8b5cf6"/>
                        <circle cx="28" cy="12" r="3"   fill="#38bdf8"/>
                    </svg>
                    <div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px' }}>NiveshView</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1.8px', textTransform: 'uppercase' }}>Finance AI</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#34d399', fontWeight: '600' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} className="pulse"/>
                        Session Active
                    </div>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#34d399,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

                {/* ── Brand Description ── */}
                <div className="fade-in" style={{
                    background: 'linear-gradient(135deg,#3b0764 0%,#6d28d9 55%,#4c1d95 100%)',
                    borderRadius: '20px', padding: '32px 36px', marginBottom: '20px',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
                    <div style={{ position: 'absolute', bottom: '-30px', left: '35%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}/>

                    {/* Brand header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <svg width="44" height="44" viewBox="0 0 56 56">
                            <defs><linearGradient id="hlg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
                            <circle cx="28" cy="28" r="26" fill="none" stroke="url(#hlg)" strokeWidth="2"/>
                            <circle cx="28" cy="28" r="17" fill="#34d39912"/>
                            <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                            <circle cx="16" cy="34" r="3.5" fill="#34d399"/>
                            <circle cx="40" cy="34" r="3.5" fill="#8b5cf6"/>
                            <circle cx="28" cy="12" r="3"   fill="#38bdf8"/>
                        </svg>
                        <div>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.4px' }}>NiveshView</div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '2px', textTransform: 'uppercase' }}>Your Finance Intelligence</div>
                        </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '20px' }}>
                        NiveshView is your all-in-one AI-powered personal finance dashboard. Track income and expenses, monitor budgets, analyse spending patterns, and get personalised financial advice — all in real time.
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {[
                            { l: '↑ Income',   v: loading ? '…' : `₹${totalIncome.toLocaleString('en-IN')}`,   c: '#34d399', bg: 'rgba(52,211,153,0.12)' },
                            { l: '↓ Expenses', v: loading ? '…' : `₹${totalExpenses.toLocaleString('en-IN')}`, c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
                            { l: '⬡ Net Worth', v: loading ? '…' : `₹${totalBalance.toLocaleString('en-IN')}`,  c: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
                            { l: '◎ Savings',  v: loading ? '…' : `${savingsRate}%`,                             c: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
                        ].map(c => (
                            <div key={c.l} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: c.bg, border: `1px solid ${c.c}30`, fontSize: '12px', fontWeight: '600', color: c.c }}>
                                {c.l} {c.v}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Mini Analytics Strip ── */}
                <div className="fade-in" style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '14px', marginBottom: '20px',
                }}>
                    {/* Sparkline Card */}
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600' }}>Cash Flow</div>
                        <svg width="100%" height="52" viewBox="0 0 160 52" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/>
                                    <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <polygon points="0,48 26,38 52,42 78,22 104,16 130,8 160,4 160,52 0,52" fill="url(#sg1)"/>
                            <polyline points="0,48 26,38 52,42 78,22 104,16 130,8 160,4" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            {[[26,38],[78,22],[160,4]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#34d399"/>)}
                        </svg>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#34d399', marginTop: '6px' }}>↑ Trending up</div>
                    </div>

                    {/* Savings Arc Card */}
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: '600', alignSelf: 'flex-start' }}>Savings Health</div>
                        <svg width="80" height="48" viewBox="0 0 80 48">
                            <path d="M8 44 A32 32 0 0 1 72 44" fill="none" stroke="var(--border-light)" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M8 44 A32 32 0 0 1 72 44" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${Math.min(parseFloat(savingsRate)/100*100.5, 100.5)} 100.5`}
                                style={{ filter: 'drop-shadow(0 0 4px #8b5cf6)' }}/>
                            <text x="40" y="42" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="800" fontFamily="Syne,sans-serif">{savingsRate}%</text>
                        </svg>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>of income saved</div>
                    </div>

                    {/* Feature Pillars */}
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: '600' }}>Platform Features</div>
                        {[
                            { icon: '🔒', text: 'Bank-grade security',    color: '#34d399' },
                            { icon: '🧠', text: 'AI-powered insights',    color: '#8b5cf6' },
                            { icon: '📊', text: 'Real-time analytics',    color: '#38bdf8' },
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < 2 ? '8px' : 0 }}>
                                <span style={{ fontSize: '14px' }}>{f.icon}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>{f.text}</span>
                                <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: f.color }}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Quick Action Cubes ── */}
                <div className="fade-in" style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '20px 24px', marginBottom: '20px',
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: '600', marginBottom: '16px' }}>Quick Access</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {cubes.map(c => (
                            <div key={c.path} onClick={() => navigate(c.path)}
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    background: c.bg,
                                    borderRadius: '14px', padding: '18px 12px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: '8px',
                                    boxShadow: `0 4px 16px ${c.glow}`,
                                }}>
                                    <span style={{ fontSize: '24px', color: 'white' }}>{c.emoji}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'white', textAlign: 'center' }}>{c.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 2 Feature Highlights ── */}
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                    {[
                        { icon: '📈', title: 'Income Tracker', desc: 'Monitor all income sources, view monthly trends and total earnings at a glance.', color: '#34d399', path: '/income', cta: 'View Income' },
                        { icon: '🏦', title: 'Account Overview', desc: 'See all your bank accounts, balances, and account types in one unified view.', color: '#38bdf8', path: '/accounts', cta: 'View Accounts' },
                    ].map(f => (
                        <div key={f.title} onClick={() => navigate(f.path)} style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            borderLeft: `4px solid ${f.color}`,
                            borderRadius: '14px', padding: '20px',
                            cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 24px rgba(0,0,0,0.1)`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ fontSize: '26px', marginBottom: '10px' }}>{f.icon}</div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{f.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>{f.desc}</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: f.color }}>{f.cta} →</div>
                        </div>
                    ))}
                </div>

                {/* ── Mode Selection Section ── */}
                <div className="fade-in" style={{ marginTop: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '8px' }}>Step 1: Choose Your Experience</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Syne,sans-serif', color: 'var(--text-primary)' }}>How will you use NiveshView?</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Select a mode to customise your dashboard tools.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        {/* Personal Mode */}
                        <div 
                            onClick={() => { localStorage.setItem('nivesh-mode', 'personal'); navigate('/dashboard'); }}
                            style={{ 
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', 
                                padding: '32px 20px', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'center', position: 'relative', overflow: 'hidden'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(139,92,246,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👤</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Personal Mode</h3>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Track personal wealth, set budgets, and grow your savings.</p>
                        </div>

                        {/* Business Mode */}
                        <div 
                            onClick={() => { localStorage.setItem('nivesh-mode', 'business'); navigate('/dashboard'); }}
                            style={{ 
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', 
                                padding: '32px 20px', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'center', position: 'relative', overflow: 'hidden'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.borderColor = '#34d399'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(52,211,153,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏬</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Business Pro</h3>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Manage brand ROI, analyze thousands of reviews, and track revenue.</p>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#34d399', color: '#064e3b', fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px' }}>PRO</div>
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '32px', letterSpacing: '0.3px' }}>
                    You can switch between modes anytime in the Settings menu.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
