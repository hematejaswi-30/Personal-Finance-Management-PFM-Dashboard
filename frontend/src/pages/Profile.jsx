import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [accounts, setAccounts]     = useState([]);
    const [transactions, setTx]       = useState([]);
    const [editing, setEditing]       = useState(false);
    const [name, setName]             = useState(user?.name || '');
    const [saving, setSaving]         = useState(false);
    const [healthScore, setHealth]    = useState(0);

    useEffect(() => {
        const headers = { Authorization: `Bearer ${token}` };
        axios.get(`${API}/accounts`, { headers }).then(r => setAccounts(r.data)).catch(() => {});
        axios.get(`${API}/transactions`, { headers }).then(r => { setTx(r.data); }).catch(() => {});
    }, [token]);

    useEffect(() => {
        if (transactions.length === 0) { setHealth(0); return; }
        const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const rate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
        setHealth(Math.min(100, Math.max(0, 40 + rate * 0.6)));
    }, [transactions]);

    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const savings      = totalIncome > 0 ? Math.round(((totalIncome - transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)) / totalIncome) * 100) : 0;
    const memberSince  = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently';

    const accentColors = ['#8b5cf6', '#0ea5e9', '#f97316', '#f43f5e', '#34d399'];
    const [avatarColor, setAvatarColor] = useState(0);

    const StatCard = ({ icon, label, value, color }) => (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</div>
            <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '18px', fontWeight: '800', color }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{label}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: '\'DM Sans\', sans-serif', padding: '24px 28px', maxWidth: '720px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}>←</button>
                <div>
                    <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>My Profile</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Member since {memberSince}</div>
                </div>
                <button onClick={() => setEditing(e => !e)} style={{ marginLeft: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    {editing ? '✕ Cancel' : '✏️ Edit'}
                </button>
            </div>

            {/* Avatar + Name */}
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '28px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${accentColors[avatarColor]}, #34d399)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', color: 'white', margin: '0 auto', boxShadow: `0 8px 24px ${accentColors[avatarColor]}50` }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
                        {accentColors.map((c, i) => (
                            <div key={i} onClick={() => setAvatarColor(i)} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, cursor: 'pointer', border: avatarColor === i ? '2px solid white' : '2px solid transparent', transition: 'border 0.15s' }}/>
                        ))}
                    </div>
                </div>

                {editing ? (
                    <div style={{ marginBottom: '12px' }}>
                        <input value={name} onChange={e => setName(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 16px', color: 'white', fontSize: '18px', fontWeight: '700', textAlign: 'center', width: '100%', fontFamily: '\'Syne\', sans-serif', outline: 'none' }}/>
                        <button onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setEditing(false); }, 800); }}
                            style={{ marginTop: '10px', background: 'linear-gradient(135deg,#8b5cf6,#34d399)', border: 'none', borderRadius: '10px', padding: '8px 20px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                            {saving ? 'Saving…' : 'Save Name'}
                        </button>
                    </div>
                ) : (
                    <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>{user?.name}</div>
                )}
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{user?.email}</div>
                <span style={{ fontSize: '11px', background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' }}>● Active Member</span>
            </div>

            {/* Financial Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
                <StatCard icon="💎" label="Net Worth"    value={`₹${(totalBalance/1000).toFixed(0)}k`}  color="#8b5cf6"/>
                <StatCard icon="🎯" label="Savings Rate" value={`${savings}%`}                           color="#34d399"/>
                <StatCard icon="❤️" label="Health Score"  value={`${Math.round(healthScore)}`}           color="#f59e0b"/>
            </div>

            {/* Accounts */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>Linked Accounts ({accounts.length})</div>
                {accounts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>No accounts linked yet</div>
                ) : accounts.map(acc => (
                    <div key={acc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🏦</div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{acc.name}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{acc.type} · {acc.institution || 'Bank'}</div>
                            </div>
                        </div>
                        <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '14px', fontWeight: '700', color: '#8b5cf6' }}>₹{acc.balance.toLocaleString('en-IN')}</div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {[
                    { label: '⚙️ Settings', path: '/settings', color: '#8b5cf6' },
                    { label: '🗺️ Onboarding Guide', path: '/onboarding', color: '#34d399' },
                    { label: '📊 Analytics', path: '/analytics', color: '#38bdf8' },
                    { label: '🤖 AI Advisor', path: '/ai-advisor', color: '#f59e0b' },
                ].map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
