import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme, accent, setAccent, ACCENTS } = useTheme();
    const [currency, setCurrency] = useState('INR');
    const [notifications, setNotifications] = useState({ budget: true, weekly: true, tips: false });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Section = ({ title, children }) => (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>{title}</div>
            {children}
        </div>
    );

    const Row = ({ label, sub, children }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</div>
                {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
            </div>
            {children}
        </div>
    );

    const Toggle = ({ on, onToggle }) => (
        <div onClick={onToggle} style={{ width: '40px', height: '22px', borderRadius: '11px', background: on ? 'var(--accent-purple)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}/>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: '\'DM Sans\', sans-serif', padding: '24px 28px', maxWidth: '720px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}>←</button>
                <div>
                    <div style={{ fontFamily: '\'Syne\', sans-serif', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Settings</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Manage your preferences</div>
                </div>
            </div>

            {/* Profile Info */}
            <Section title="👤 Account">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#34d399,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
                        <span style={{ fontSize: '10px', background: 'rgba(52,211,153,0.12)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>● Active</span>
                    </div>
                </div>
                <button onClick={() => navigate('/profile')} style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
                    ✏️ View & Edit Profile →
                </button>
            </Section>

            {/* Appearance */}
            <Section title="🎨 Appearance">
                <Row label="Theme" sub="Switch between dark and light mode">
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {['dark', 'light'].map(t => (
                            <button key={t} onClick={() => { if (theme !== t) toggleTheme(); }}
                                style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: theme === t ? '2px solid var(--accent-purple)' : '1px solid var(--border)', background: theme === t ? 'var(--accent-soft)' : 'var(--bg-tertiary)', color: theme === t ? 'var(--accent-purple)' : 'var(--text-muted)' }}>
                                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                            </button>
                        ))}
                    </div>
                </Row>
                <div style={{ paddingTop: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>Accent Color</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {Object.entries(ACCENTS).map(([key, val]) => (
                            <div key={key} onClick={() => setAccent(key)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: val.primary, border: accent === key ? '3px solid white' : '3px solid transparent', boxShadow: accent === key ? `0 0 0 2px ${val.primary}` : 'none', transition: 'all 0.15s' }}/>
                                <span style={{ fontSize: '10px', color: accent === key ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: accent === key ? '700' : '400' }}>{val.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Currency */}
            <Section title="💱 Regional">
                <Row label="Currency" sub="Default currency for all values">
                    <select value={currency} onChange={e => setCurrency(e.target.value)}
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}>
                        <option value="INR">₹ INR — Indian Rupee</option>
                        <option value="USD">$ USD — US Dollar</option>
                        <option value="EUR">€ EUR — Euro</option>
                    </select>
                </Row>
            </Section>

            {/* Notifications */}
            <Section title="🔔 Notifications">
                <Row label="Budget Alerts" sub="Notify when spending exceeds 80% of budget">
                    <Toggle on={notifications.budget} onToggle={() => setNotifications(n => ({ ...n, budget: !n.budget }))}/>
                </Row>
                <Row label="Weekly Summary" sub="Get a weekly financial overview">
                    <Toggle on={notifications.weekly} onToggle={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))}/>
                </Row>
                <Row label="AI Tips" sub="Smart financial tips powered by AI">
                    <Toggle on={notifications.tips} onToggle={() => setNotifications(n => ({ ...n, tips: !n.tips }))}/>
                </Row>
            </Section>

            {/* Danger Zone */}
            <Section title="⚠️ Account Actions">
                <Row label="Sign Out" sub="Log out of your NiveshAI account">
                    <button onClick={logout} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: '#f43f5e', cursor: 'pointer' }}>Sign Out</button>
                </Row>
                <Row label="Onboarding Guide" sub="Walk through the platform setup again">
                    <button onClick={() => navigate('/onboarding')} style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-purple)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-purple)', cursor: 'pointer' }}>Start Guide</button>
                </Row>
            </Section>

            {/* Save */}
            <button onClick={handleSave} style={{ width: '100%', background: `linear-gradient(135deg, var(--accent-purple), var(--accent-secondary))`, border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px var(--purple-glow)', marginBottom: '32px', transition: 'opacity 0.2s' }}>
                {saved ? '✅ Saved!' : 'Save Settings'}
            </button>
        </div>
    );
}
