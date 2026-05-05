import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Icon helper ── */
const Icon = ({ d, size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
    </svg>
);

const ICONS = {
    overview:     'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    transactions: ['M7 16V4m0 0L3 8m4-4l4 4', 'M17 8v12m0 0l-4-4m4 4l4-4'],
    income:       'M12 19V5m0 0l-7 7m7-7l7 7',
    accounts:     ['M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z','M2 11h20'],
    budgets:      ['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6v6l4 2'],
    ai:           ['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5'],
    analytics:    'M18 20V10M12 20V4M6 20v-6',
    profile:      ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8z'],
    bell:         ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 01-3.46 0'],
    sun:          ['M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42','M12 17a5 5 0 100-10 5 5 0 000 10z'],
    moon:         'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
    lock:         ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z','M7 11V7a5 5 0 0110 0v4'],
    logout:       ['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4','M16 17l5-5-5-5','M21 12H9'],
    settings:     ['M12 15a3 3 0 100-6 3 3 0 000 6z','M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'],
};

const navItems = [
    { path: '/dashboard',    label: 'Overview',     iconKey: 'overview' },
    { path: '/transactions', label: 'Transactions', iconKey: 'transactions' },
    { path: '/income',       label: 'Income',       iconKey: 'income' },
    { path: '/accounts',     label: 'Accounts',     iconKey: 'accounts' },
    { path: '/budgets',      label: 'Budgets',      iconKey: 'budgets' },
    { path: '/ai-advisor',   label: 'AI Advisor',   iconKey: 'ai', badge: 'AI' },
    { path: '/analytics',    label: 'Analytics',    iconKey: 'analytics' },
];

/* ── Cube Card button ── */
const CubeCard = ({ iconKey, label, iconBg, iconColor, onClick, danger }) => (
    <div onClick={onClick} style={{
        background: danger ? 'rgba(244,63,94,0.08)' : 'var(--bg-tertiary)',
        border: `1px solid ${danger ? 'rgba(244,63,94,0.15)' : 'var(--border)'}`,
        borderRadius: '12px', padding: '12px 8px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'all 0.15s',
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = danger ? '#f43f5e' : '#8b5cf6'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = danger ? 'rgba(244,63,94,0.15)' : 'var(--border)'; }}
    >
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
            <Icon d={ICONS[iconKey]} size={13}/>
        </div>
        <span style={{ fontSize: '9px', fontWeight: '600', color: danger ? '#f43f5e' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
);

const Sidebar = () => {
    const { user, logout }     = useAuth();
    const location             = useLocation();
    const [open, setOpen]      = useState(false);
    const triggerRef           = useRef(null);
    const dropdownRef          = useRef(null);
    const [dropPos, setDropPos] = useState({ bottom: 0, left: 0, width: 0 });

    const isActive = (p) => location.pathname === p;

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const openDropdown = () => {
        if (triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            setDropPos({ bottom: window.innerHeight - r.top + 8, left: r.left, width: r.width });
        }
        setOpen(o => !o);
    };

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <>
            {/* ── Settings Cube Grid (fixed position) ── */}
            {open && (
                <div ref={dropdownRef} style={{
                    position: 'fixed',
                    bottom: dropPos.bottom,
                    left: dropPos.left,
                    width: Math.max(dropPos.width, 220),
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '16px',
                    padding: '14px',
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    animation: 'slideUp 0.2s ease',
                }}>
                    {/* User info header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 2px 12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#34d399,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white' }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '20px', padding: '2px 8px', fontSize: '9px', color: '#34d399', flexShrink: 0, fontWeight: '600' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#34d399' }} className="pulse"/>
                            Live
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)', marginBottom: '12px' }}/>

                    {/* ── Cube Grid ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <CubeCard iconKey="profile" label="Profile"      iconBg="rgba(139,92,246,0.12)" iconColor="#8b5cf6" onClick={() => setOpen(false)}/>
                        <CubeCard iconKey="bell"    label="Alerts"       iconBg="rgba(56,189,248,0.12)"  iconColor="#38bdf8" onClick={() => setOpen(false)}/>
                        <CubeCard iconKey="overview" label="Home"        iconBg="rgba(52,211,153,0.12)"  iconColor="#34d399" onClick={() => { setOpen(false); window.location.href='/welcome'; }}/>
                        <CubeCard iconKey="lock"    label="Security"     iconBg="rgba(245,158,11,0.12)"  iconColor="#f59e0b" onClick={() => setOpen(false)}/>
                        <CubeCard iconKey="settings" label="Preferences" iconBg="rgba(20,184,166,0.12)"  iconColor="#14b8a6" onClick={() => setOpen(false)}/>
                        <CubeCard iconKey="logout"  label="Sign Out"     iconBg="rgba(244,63,94,0.12)"   iconColor="#f43f5e" onClick={() => { setOpen(false); logout(); }} danger/>
                    </div>
                </div>
            )}

            {/* ── Sidebar ── */}
            <div className="sidebar-container" style={{
                width: '240px',
                background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                borderRight: '1px solid var(--border)',
                height: '100vh', position: 'fixed', top: 0, left: 0,
                display: 'flex', flexDirection: 'column', zIndex: 40,
                transition: 'background 0.3s',
            }}>
                {/* Logo */}
                <div className="sidebar-logo-section" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="30" height="30" viewBox="0 0 56 56">
                            <defs><linearGradient id="slg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
                            <circle cx="28" cy="28" r="26" fill="none" stroke="url(#slg3)" strokeWidth="2"/>
                            <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                            <circle cx="16" cy="34" r="3.5" fill="#34d399"/>
                            <circle cx="40" cy="34" r="3.5" fill="#8b5cf6"/>
                            <circle cx="28" cy="12" r="3"   fill="#38bdf8"/>
                        </svg>
                        <div>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>NiveshAI</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1.8px', textTransform: 'uppercase' }}>Finance AI</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav" style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
                    <div className="sidebar-section-title" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.4px', padding: '8px 20px 6px', fontWeight: '600' }}>Main</div>

                    {navItems.slice(0, 5).map(item => (
                        <Link key={item.path} to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '9px 18px', textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                                color: isActive(item.path) ? '#a78bfa' : 'var(--text-muted)',
                                background: isActive(item.path) ? 'rgba(139,92,246,0.08)' : 'transparent',
                                borderLeft: isActive(item.path) ? '2px solid #8b5cf6' : '2px solid transparent',
                                transition: 'all 0.15s', borderRadius: '0 8px 8px 0',
                            }}>
                            <span className="icon" style={{ flexShrink: 0 }}><Icon d={ICONS[item.iconKey]} size={14}/></span>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    ))}

                    <div className="sidebar-section-title" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.4px', padding: '14px 20px 6px', fontWeight: '600' }}>AI Features</div>

                    {navItems.slice(5).map(item => (
                        <Link key={item.path} to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '9px 18px', textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                                color: isActive(item.path) ? '#34d399' : 'var(--text-muted)',
                                background: isActive(item.path) ? 'rgba(52,211,153,0.08)' : 'transparent',
                                borderLeft: isActive(item.path) ? '2px solid #34d399' : '2px solid transparent',
                                transition: 'all 0.15s', borderRadius: '0 8px 8px 0',
                            }}>
                            <span className="icon" style={{ flexShrink: 0 }}><Icon d={ICONS[item.iconKey]} size={14}/></span>
                            <span className="sidebar-label">{item.label}</span>
                            {item.badge && <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: '700', background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '2px 7px', borderRadius: '10px' }}>{item.badge}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Profile + Settings trigger */}
                <div className="sidebar-profile-section" style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
                    <div ref={triggerRef} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '10px', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#34d399,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white' }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                        </div>
                        <button onClick={openDropdown} style={{
                            background: open ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border-light)', borderRadius: '8px',
                            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: open ? '#8b5cf6' : 'var(--text-muted)',
                            transition: 'all 0.2s', flexShrink: 0,
                        }}>
                            <Icon d={ICONS.settings} size={13}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;