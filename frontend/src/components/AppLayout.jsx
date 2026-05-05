import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
    { label: 'Dashboard',    path: '/dashboard',    emoji: '🏠' },
    { label: 'Transactions', path: '/transactions', emoji: '⇄'  },
    { label: 'Income',       path: '/income',       emoji: '📈' },
    { label: 'Accounts',     path: '/accounts',     emoji: '💳' },
    { label: 'Budgets',      path: '/budgets',      emoji: '◎'  },
    { label: 'Analytics',    path: '/analytics',    emoji: '⬡'  },
    { label: 'AI Advisor',   path: '/ai-advisor',   emoji: '✦'  },
];

const QUICK_ACTIONS = [
    { label:'Dashboard',    emoji:'🏠', path:'/dashboard',    bg:'linear-gradient(135deg,#6366f1,#4f46e5)', sh:'rgba(99,102,241,0.4)'  },
    { label:'Transactions', emoji:'⇄', path:'/transactions', bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)', sh:'rgba(139,92,246,0.4)' },
    { label:'AI Advisor',   emoji:'✦', path:'/ai-advisor',   bg:'linear-gradient(135deg,#34d399,#059669)', sh:'rgba(52,211,153,0.4)'  },
    { label:'Analytics',    emoji:'⬡', path:'/analytics',    bg:'linear-gradient(135deg,#38bdf8,#0284c7)', sh:'rgba(56,189,248,0.4)'  },
    { label:'Budgets',      emoji:'◎', path:'/budgets',      bg:'linear-gradient(135deg,#f59e0b,#d97706)', sh:'rgba(245,158,11,0.4)'  },
    { label:'Accounts',     emoji:'◻', path:'/accounts',     bg:'linear-gradient(135deg,#14b8a6,#0f766e)', sh:'rgba(20,184,166,0.4)'  },
];

export default function AppLayout({ children }) {
    const navigate   = useNavigate();
    const location   = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showProfile,  setShowProfile]  = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const active = location.pathname;

    // Close profile popout on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

    return (
        <div style={{ minHeight:'100vh', background:'var(--bg-primary)',
                      fontFamily:'\'DM Sans\', sans-serif', color:'var(--text-primary)',
                      display:'flex', flexDirection:'column' }}>

            {/* ── Top Navigation Bar ── */}
            <div style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)',
                          padding:'0 20px', height:'56px', display:'flex', alignItems:'center',
                          justifyContent:'space-between', position:'sticky', top:0, zIndex:50,
                          flexShrink:0 }}>

                {/* Logo */}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', flexShrink:0 }}
                     onClick={() => navigate('/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 56 56">
                        <defs><linearGradient id="tlg2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#8b5cf6"/>
                        </linearGradient></defs>
                        <circle cx="28" cy="28" r="26" fill="none" stroke="url(#tlg2)" strokeWidth="2.5"/>
                        <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="16" cy="34" r="3" fill="#34d399"/>
                        <circle cx="40" cy="34" r="3" fill="#8b5cf6"/>
                        <circle cx="28" cy="12" r="2.5" fill="#38bdf8"/>
                    </svg>
                    <span style={{ fontFamily:'\'Syne\', sans-serif', fontSize:'15px', fontWeight:'800',
                                   color:'var(--text-primary)', letterSpacing:'-0.3px' }}>NiveshAI</span>
                </div>

                {/* Desktop Nav Links — hidden on mobile */}
                <div className="nav-desktop" style={{ display:'flex', alignItems:'center', gap:'2px', flex:1, justifyContent:'center' }}>
                    {NAV_LINKS.map(({ label, path }) => {
                        const isActive = active === path;
                        return (
                            <button key={path} onClick={() => navigate(path)}
                                style={{ background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                                         border:'none', borderRadius:'8px', padding:'6px 10px',
                                         fontSize:'11.5px', fontWeight: isActive ? '700' : '500',
                                         color: isActive ? '#8b5cf6' : 'var(--text-muted)',
                                         cursor:'pointer', position:'relative', transition:'all 0.15s',
                                         fontFamily:'\'DM Sans\', sans-serif', whiteSpace:'nowrap' }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.background='rgba(139,92,246,0.06)'; }}}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color=''; e.currentTarget.style.background='transparent'; }}}
                            >
                                {label}
                                {isActive && <div style={{ position:'absolute', bottom:'-2px', left:'10px', right:'10px',
                                                            height:'2px', borderRadius:'2px',
                                                            background:'linear-gradient(90deg,#8b5cf6,#34d399)' }}/>}
                            </button>
                        );
                    })}
                </div>

                {/* Right Controls */}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="theme-btn"
                        style={{ display:'flex', alignItems:'center', gap:'5px',
                                 background: theme==='dark' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                                 border:`1px solid ${theme==='dark' ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)'}`,
                                 borderRadius:'20px', padding:'5px 12px', cursor:'pointer',
                                 color: theme==='dark' ? '#f59e0b' : '#6366f1',
                                 fontSize:'11px', fontWeight:'600', fontFamily:'\'DM Sans\', sans-serif' }}>
                        <span>{theme==='dark' ? '☀️' : '🌙'}</span>
                        <span className="theme-label">{theme==='dark' ? 'Light' : 'Dark'}</span>
                    </button>

                    {/* Avatar / Profile */}
                    <div ref={profileRef} style={{ position:'relative' }}>
                        <div onClick={() => setShowProfile(p => !p)}
                             style={{ width:'32px', height:'32px', borderRadius:'50%',
                                      background:'linear-gradient(135deg,#34d399,#8b5cf6)',
                                      display:'flex', alignItems:'center', justifyContent:'center',
                                      fontSize:'13px', fontWeight:'800', color:'white', cursor:'pointer',
                                      border:'2px solid var(--border)', flexShrink:0 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Profile Popout */}
                        {showProfile && (
                            <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0,
                                          width:'230px', background:'var(--bg-secondary)',
                                          border:'1px solid var(--border)', borderRadius:'16px',
                                          padding:'18px', zIndex:200,
                                          boxShadow:'0 16px 48px rgba(0,0,0,0.3)',
                                          animation:'fadeSlideIn 0.18s ease' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'10px',
                                              marginBottom:'14px', paddingBottom:'14px',
                                              borderBottom:'1px solid var(--border)' }}>
                                    <div style={{ width:'40px', height:'40px', borderRadius:'50%',
                                                  background:'linear-gradient(135deg,#34d399,#8b5cf6)',
                                                  display:'flex', alignItems:'center', justifyContent:'center',
                                                  fontSize:'16px', fontWeight:'800', color:'white', flexShrink:0 }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ overflow:'hidden' }}>
                                        <div style={{ fontSize:'13px', fontWeight:'700', color:'var(--text-primary)',
                                                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                                        <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'2px',
                                                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</div>
                                        <span style={{ fontSize:'10px', background:'rgba(52,211,153,0.15)',
                                                       color:'#34d399', padding:'1px 7px', borderRadius:'10px', fontWeight:'600' }}>● Active</span>
                                    </div>
                                </div>
                                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                                    <button onClick={() => { setShowProfile(false); navigate('/profile'); }}
                                        style={{ flex:1, minWidth:'90px', background:'var(--bg-tertiary)', border:'1px solid var(--border)',
                                                 borderRadius:'8px', padding:'7px', fontSize:'11px',
                                                 color:'var(--text-secondary)', cursor:'pointer', fontWeight:'600',
                                                 fontFamily:'\'DM Sans\', sans-serif' }}>👤 Profile</button>
                                    <button onClick={() => { setShowProfile(false); navigate('/settings'); }}
                                        style={{ flex:1, minWidth:'90px', background:'var(--bg-tertiary)', border:'1px solid var(--border)',
                                                 borderRadius:'8px', padding:'7px', fontSize:'11px',
                                                 color:'var(--text-secondary)', cursor:'pointer', fontWeight:'600',
                                                 fontFamily:'\'DM Sans\', sans-serif' }}>⚙️ Settings</button>
                                    <button onClick={() => { setShowProfile(false); navigate('/onboarding'); }}
                                        style={{ flex:1, minWidth:'90px', background:'var(--bg-tertiary)', border:'1px solid var(--border)',
                                                 borderRadius:'8px', padding:'7px', fontSize:'11px',
                                                 color:'var(--text-secondary)', cursor:'pointer', fontWeight:'600',
                                                 fontFamily:'\'DM Sans\', sans-serif' }}>🗺️ Guide</button>
                                    <button onClick={() => { setShowProfile(false); logout(); }}
                                        style={{ flex:1, minWidth:'90px', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)',
                                                 borderRadius:'8px', padding:'7px', fontSize:'11px',
                                                 color:'#f43f5e', cursor:'pointer', fontWeight:'600',
                                                 fontFamily:'\'DM Sans\', sans-serif' }}>Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger — mobile only */}
                    <button className="hamburger-btn" onClick={() => setMobileMenuOpen(o => !o)}
                        style={{ background:'transparent', border:'none', cursor:'pointer',
                                 color:'var(--text-primary)', padding:'4px', display:'none',
                                 flexDirection:'column', gap:'5px', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ display:'block', width:'20px', height:'2px', background:'var(--text-primary)',
                                       borderRadius:'2px', transition:'all 0.2s',
                                       transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}/>
                        <span style={{ display:'block', width:'20px', height:'2px', background:'var(--text-primary)',
                                       borderRadius:'2px', opacity: mobileMenuOpen ? 0 : 1, transition:'opacity 0.2s' }}/>
                        <span style={{ display:'block', width:'20px', height:'2px', background:'var(--text-primary)',
                                       borderRadius:'2px', transition:'all 0.2s',
                                       transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}/>
                    </button>
                </div>
            </div>

            {/* Mobile Slide-down Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu" style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)',
                                                       padding:'12px 20px 16px', zIndex:45, display:'none',
                                                       flexDirection:'column', gap:'4px' }}>
                    {NAV_LINKS.map(({ label, path, emoji }) => {
                        const isActive = active === path;
                        return (
                            <button key={path} onClick={() => { navigate(path); setMobileMenuOpen(false); }}
                                style={{ display:'flex', alignItems:'center', gap:'12px',
                                         background: isActive ? 'rgba(139,92,246,0.1)' : 'transparent',
                                         border:'none', borderRadius:'10px', padding:'10px 14px',
                                         fontSize:'13px', fontWeight: isActive ? '700' : '500',
                                         color: isActive ? '#8b5cf6' : 'var(--text-secondary)',
                                         cursor:'pointer', textAlign:'left', width:'100%',
                                         fontFamily:'\'DM Sans\', sans-serif' }}>
                                <span style={{ fontSize:'16px' }}>{emoji}</span>{label}
                            </button>
                        );
                    })}
                    <div style={{ borderTop:'1px solid var(--border)', marginTop:'8px', paddingTop:'10px', display:'flex', gap:'8px' }}>
                        <button onClick={toggleTheme}
                            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                                     background: theme==='dark' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                                     border:`1px solid ${theme==='dark'?'rgba(245,158,11,0.3)':'rgba(99,102,241,0.3)'}`,
                                     borderRadius:'10px', padding:'9px', fontSize:'12px', fontWeight:'600',
                                     color: theme==='dark' ? '#f59e0b' : '#6366f1', cursor:'pointer',
                                     fontFamily:'\'DM Sans\', sans-serif' }}>
                            {theme==='dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <button onClick={() => { setMobileMenuOpen(false); logout(); }}
                            style={{ flex:1, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)',
                                     borderRadius:'10px', padding:'9px', fontSize:'12px', fontWeight:'600',
                                     color:'#f43f5e', cursor:'pointer', fontFamily:'\'DM Sans\', sans-serif' }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* ── Body: sidebar + content ── */}
            <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

                {/* Left Quick-Action Sidebar — desktop only */}
                <div className="sidebar-desktop"
                     style={{ width:'68px', background:'var(--bg-secondary)', borderRight:'1px solid var(--border)',
                               display:'flex', flexDirection:'column', alignItems:'center',
                               padding:'18px 0', gap:'10px', flexShrink:0, overflowY:'auto' }}>
                    {QUICK_ACTIONS.map(a => (
                        <div key={a.path} title={a.label} onClick={() => navigate(a.path)}
                             style={{ width:'40px', height:'40px', borderRadius:'50%', background:a.bg,
                                      boxShadow: active===a.path ? `0 0 0 3px ${a.sh}, 0 4px 14px ${a.sh}` : `0 4px 12px ${a.sh}`,
                                      display:'flex', alignItems:'center', justifyContent:'center',
                                      cursor:'pointer', transition:'transform 0.15s',
                                      fontSize:'16px', color:'white', flexShrink:0 }}
                             onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; }}
                             onMouseLeave={e => { e.currentTarget.style.transform=''; }}>
                            {a.emoji}
                        </div>
                    ))}
                </div>

                {/* Page Content */}
                <div style={{ flex:1, minWidth:0, overflowY:'auto' }}>
                    {children}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-bottom-nav"
                 style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, zIndex:50,
                          background:'var(--bg-secondary)', borderTop:'1px solid var(--border)',
                          padding:'8px 4px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                    {[
                        {label:'Home',    path:'/dashboard',    emoji:'🏠'},
                        {label:'Transact',path:'/transactions', emoji:'⇄'},
                        {label:'Budgets', path:'/budgets',      emoji:'◎'},
                        {label:'AI',      path:'/ai-advisor',   emoji:'✦'},
                        {label:'More',    path:null,            emoji:'☰', action:() => setMobileMenuOpen(o=>!o)},
                    ].map(item => {
                        const isActive = item.path && active === item.path;
                        return (
                            <button key={item.label}
                                onClick={() => item.action ? item.action() : navigate(item.path)}
                                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
                                         background:'transparent', border:'none', cursor:'pointer',
                                         padding:'4px 8px', borderRadius:'8px',
                                         color: isActive ? '#8b5cf6' : 'var(--text-muted)',
                                         fontFamily:'\'DM Sans\', sans-serif', minWidth:'48px' }}>
                                <span style={{ fontSize:'18px' }}>{item.emoji}</span>
                                <span style={{ fontSize:'10px', fontWeight: isActive ? '700':'500' }}>{item.label}</span>
                                {isActive && <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#8b5cf6' }}/>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity:0; transform:translateY(-6px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                /* ── Mobile Responsive ── */
                @media (max-width: 768px) {
                    .nav-desktop      { display: none !important; }
                    .hamburger-btn    { display: flex !important; }
                    .mobile-menu      { display: flex !important; }
                    .sidebar-desktop  { display: none !important; }
                    .mobile-bottom-nav{ display: block !important; }
                    .theme-label      { display: none !important; }
                    .theme-btn        { padding: 5px 8px !important; }
                }

                /* ── Dashboard responsive grids ── */
                @media (max-width: 900px) {
                    .dash-kpi-grid    { grid-template-columns: repeat(2,1fr) !important; }
                    .dash-chart-grid  { grid-template-columns: 1fr !important; }
                    .dash-bottom-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 560px) {
                    .dash-kpi-grid    { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
                    .dash-page        { padding: 14px 14px 80px !important; }
                }
            `}</style>
        </div>
    );
}
