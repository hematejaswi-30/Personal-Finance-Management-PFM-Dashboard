import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
    { id: 1, emoji: '🎉', title: 'Welcome to NiveshView', sub: 'Your smart personal finance companion' },
    { id: 2, emoji: '💳', title: 'Link Your Accounts',   sub: 'Connect your bank accounts to track balances' },
    { id: 3, emoji: '🎯', title: 'Set Budget Goals',     sub: 'Define spending limits by category' },
    { id: 4, emoji: '🚀', title: 'You\'re All Set!',      sub: 'Your financial dashboard is ready' },
];

const BUDGET_CATS = [
    { cat: 'Food & Dining',     emoji: '🍱', default: 5000  },
    { cat: 'Transport',         emoji: '🚗', default: 3000  },
    { cat: 'Shopping',          emoji: '🛍️', default: 4000  },
    { cat: 'Entertainment',     emoji: '🎬', default: 2000  },
    { cat: 'Health',            emoji: '💊', default: 2000  },
    { cat: 'Bills & Utilities', emoji: '🏠', default: 6000  },
];

export default function Onboarding() {
    const navigate = useNavigate();
    const { user }  = useAuth();
    const [step, setStep]       = useState(1);
    const [budgets, setBudgets] = useState(
        BUDGET_CATS.reduce((acc, b) => ({ ...acc, [b.cat]: { enabled: false, limit: b.default } }), {})
    );

    const next = () => step < 4 ? setStep(s => s + 1) : navigate('/dashboard');
    const back = () => step > 1 && setStep(s => s - 1);

    const stepData = STEPS[step - 1];

    const Card = ({ children, style = {} }) => (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', ...style }}>
            {children}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: '\'DM Sans\', sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

            {/* Step Dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {STEPS.map(s => (
                    <div key={s.id} style={{ width: s.id === step ? '28px' : '8px', height: '8px', borderRadius: '4px', background: s.id <= step ? 'var(--accent-purple)' : 'var(--border)', transition: 'all 0.3s' }}/>
                ))}
            </div>

            {/* Main Card */}
            <div style={{ width: '100%', maxWidth: '520px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '52px', marginBottom: '12px' }}>{stepData.emoji}</div>
                    <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{stepData.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stepData.sub}</div>
                </div>

                {/* Step Content */}
                {step === 1 && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#34d399,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: 'white', margin: '0 auto 16px' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>Hello, {user?.name?.split(' ')[0]}! 👋</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>NiveshView helps you track your income, manage budgets, analyze spending patterns, and get AI-powered financial insights — all in one place.</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '20px' }}>
                                {[['📈','Track Income'],['💸','Manage Budgets'],['🤖','AI Insights']].map(([e,l]) => (
                                    <div key={l} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{e}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {step === 2 && (
                    <Card>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Your Connected Accounts</div>
                        {[['💳','Add Bank Account','e.g. SBI Savings'],['📱','Add UPI Wallet','e.g. PhonePe, GPay'],['📊','Add Investment','e.g. Zerodha, Groww']].map(([emoji, title, sub]) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer' }}
                                onClick={() => navigate('/accounts')}>
                                <span style={{ fontSize: '22px' }}>{emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>
                                </div>
                                <span style={{ color: 'var(--accent-purple)', fontSize: '16px' }}>+</span>
                            </div>
                        ))}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>You can always add accounts later from the dashboard</div>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Monthly Spending Limits</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                            {BUDGET_CATS.map(({ cat, emoji, default: def }) => (
                                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: budgets[cat].enabled ? 'rgba(139,92,246,0.06)' : 'var(--bg-tertiary)', border: `1px solid ${budgets[cat].enabled ? 'rgba(139,92,246,0.25)' : 'var(--border)'}`, borderRadius: '12px', transition: 'all 0.2s' }}>
                                    <div onClick={() => setBudgets(b => ({ ...b, [cat]: { ...b[cat], enabled: !b[cat].enabled } }))}
                                        style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${budgets[cat].enabled ? 'var(--accent-purple)' : 'var(--border)'}`, background: budgets[cat].enabled ? 'var(--accent-purple)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'white', fontSize: '11px' }}>
                                        {budgets[cat].enabled ? '✓' : ''}
                                    </div>
                                    <span style={{ fontSize: '18px' }}>{emoji}</span>
                                    <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{cat}</div>
                                    {budgets[cat].enabled && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>₹</span>
                                            <input type="number" value={budgets[cat].limit}
                                                onChange={e => setBudgets(b => ({ ...b, [cat]: { ...b[cat], limit: +e.target.value } }))}
                                                style={{ width: '70px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 6px', color: 'var(--text-primary)', fontSize: '12px', textAlign: 'right' }}/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {step === 4 && (
                    <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎊</div>
                        <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>You're ready to go!</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>Your NiveshView dashboard is configured and ready. Start by adding your first transaction or exploring the AI Advisor for smart financial tips.</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {[
                                { label: '+ Add Transaction', path: '/dashboard', color: 'var(--accent-purple)' },
                                { label: '🤖 Ask AI Advisor', path: '/ai-advisor', color: '#34d399'              },
                                { label: '📊 View Analytics', path: '/analytics',  color: '#38bdf8'              },
                                { label: '⚙️ Settings',       path: '/settings',   color: '#f59e0b'              },
                            ].map(item => (
                                <button key={item.path} onClick={() => navigate(item.path)}
                                    style={{ background: 'var(--bg-tertiary)', border: `1px solid ${item.color}30`, borderRadius: '10px', padding: '11px', fontSize: '12px', fontWeight: '600', color: item.color, cursor: 'pointer' }}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {step > 1 && (
                        <button onClick={back} style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', cursor: 'pointer' }}>← Back</button>
                    )}
                    <button onClick={next}
                        style={{ flex: 2, background: `linear-gradient(135deg, var(--accent-purple), var(--accent-secondary))`, border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: '700', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px var(--purple-glow)' }}>
                        {step === 4 ? '🚀 Go to Dashboard' : step === 3 ? 'Save & Continue →' : 'Continue →'}
                    </button>
                    {step < 4 && (
                        <button onClick={next} style={{ padding: '12px 16px', background: 'transparent', border: 'none', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>Skip</button>
                    )}
                </div>
            </div>

            {/* Logo watermark */}
            <div style={{ marginTop: '32px', fontSize: '11px', color: 'var(--text-muted)' }}>Powered by <span style={{ color: 'var(--accent-purple)', fontWeight: '700' }}>NiveshView</span></div>
        </div>
    );
}
