import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: '◈' },
        { path: '/transactions', label: 'Transactions', icon: '⇄' },
        { path: '/income', label: 'Income', icon: '↓' },
        { path: '/accounts', label: 'Accounts', icon: '◻' },
        { path: '/budgets', label: 'Budgets', icon: '◎' },
        { path: '/ai-advisor', label: 'AI Advisor', icon: '✦', badge: 'AI' },
        { path: '/reviews', label: 'ReviewSync', icon: '✉', badge: 'NEW' },
        { path: '/analytics', label: 'Analytics', icon: '⬡' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{
            width: '240px',
            background: 'var(--bg-secondary)',
            borderRight: '0.5px solid var(--border)',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40
        }}>
            {/* Logo */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '0.5px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="32" height="32" viewBox="0 0 56 56">
                        <defs>
                            <linearGradient id="slg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399"/>
                                <stop offset="100%" stopColor="#818cf8"/>
                            </linearGradient>
                        </defs>
                        <circle cx="28" cy="28" r="26" fill="none" stroke="url(#slg)" strokeWidth="2"/>
                        <circle cx="28" cy="28" r="17" fill="#34d39911"/>
                        <circle cx="28" cy="28" r="8" fill="#818cf822"/>
                        <path d="M16 34 Q28 12 40 34" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="16" cy="34" r="3.5" fill="#34d399"/>
                        <circle cx="40" cy="34" r="3.5" fill="#818cf8"/>
                        <circle cx="28" cy="12" r="3" fill="#38bdf8"/>
                    </svg>
                    <div>
                        <div style={{
                            fontFamily: 'Syne, sans-serif',
                            fontSize: '18px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px'
                        }}>NiveshAI</div>
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase'
                        }}>Finance AI</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
                <div style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    padding: '8px 20px 6px'
                }}>Main</div>

                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            color: isActive(item.path)
                                ? 'var(--accent-purple)'
                                : 'var(--text-muted)',
                            background: isActive(item.path)
                                ? 'var(--bg-hover)'
                                : 'transparent',
                            borderLeft: isActive(item.path)
                                ? '2px solid var(--accent-purple)'
                                : '2px solid transparent',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '14px', width: '18px' }}>
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}

                <div style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    padding: '16px 20px 6px'
                }}>AI Features</div>

                {navItems.slice(5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            color: isActive(item.path)
                                ? 'var(--accent-green)'
                                : 'var(--text-muted)',
                            background: isActive(item.path)
                                ? 'var(--bg-hover)'
                                : 'transparent',
                            borderLeft: isActive(item.path)
                                ? '2px solid var(--accent-green)'
                                : '2px solid transparent',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '14px', width: '18px' }}>
                            {item.icon}
                        </span>
                        {item.label}
                        {item.badge && (
                            <span className="badge badge-green" style={{
                                fontSize: '9px',
                                padding: '2px 6px',
                                marginLeft: 'auto'
                            }}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Profile */}
            <div style={{
                padding: '16px 20px',
                borderTop: '0.5px solid var(--border)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #34d399, #818cf8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {user?.name}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {user?.email}
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="btn-danger"
                    style={{ width: '100%', fontSize: '13px', padding: '8px' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;