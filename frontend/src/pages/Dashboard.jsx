import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Chart from '../components/Chart';
import TransactionTable from '../components/TransactionTable';
import { getAccounts, getTransactions, getByCategory, getMonthlySummary, getBudgetSummary, addTransaction, addAccount } from '../services/api';

/* ── Health Score Ring ── */
const HealthRing = ({ score }) => {
    const r = 58, cx = 72, cy = 72, circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color  = score >= 80 ? '#34d399' : score >= 60 ? '#f59e0b' : '#f43f5e';
    const label  = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Improve';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="144" height="144" viewBox="0 0 144 144">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12"/>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                    transform="rotate(-90 72 72)" style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease' }}/>
                <text x={cx} y={cy - 8}  textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Syne,sans-serif">{score}</text>
                <text x={cx} y={cy + 8}  textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">/100</text>
                <text x={cx} y={cy + 24} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{label}</text>
            </svg>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Score</div>
        </div>
    );
};

/* ── Spending Rings ── */
const SpendingRings = ({ data }) => {
    const radii  = [86, 68, 50, 32];
    // Dynamic colors based on accent
    const colors = [
        'var(--accent-primary)', 
        'rgba(244,63,94,0.8)', // Soft Red
        'rgba(56,189,248,0.8)', // Soft Blue
        'rgba(52,211,153,0.8)'  // Soft Green
    ];
    if (!data || !Array.isArray(data)) return null;
    const top4   = data.slice(0, 4);
    
    return (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <svg width="180" height="180" viewBox="0 0 200 200">
                    {top4.map((item, i) => {
                        const r    = radii[i], circ = 2 * Math.PI * r;
                        const firstTotal = top4[0]?.total || 1;
                        const pct  = Math.min(((item?.total || 0) / firstTotal) * 100, 100);
                        const dash = `${(pct / 100) * circ} ${circ}`;
                        return (
                            <g key={i}>
                                <circle cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeWidth="12" style={{ opacity: 0.3 }}/>
                                <circle cx="100" cy="100" r={r} fill="none" stroke={colors[i]} strokeWidth="12"
                                    strokeLinecap="round" strokeDasharray={dash} transform="rotate(-90 100 100)"
                                    style={{ filter: `drop-shadow(0 0 6px ${colors[i]}40)`, transition: 'stroke-dasharray 0.8s ease' }}/>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '140px' }}>
                {top4.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i], flexShrink: 0, boxShadow: `0 0 8px ${colors[i]}` }}/>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item._id || 'Other'}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Syne,sans-serif' }}>₹{item.total?.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Insight Cards ── */
const makeInsights = (savingsRate, budgets, totalIncome, totalExpenses) => {
    const ins = [];
    const overBudget = budgets.find(b => b.percentage >= 90);
    if (overBudget) ins.push({ emoji: '⚠️', title: `${overBudget.category} budget ${overBudget.percentage}% used!`, sub: 'Action needed', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', cta: 'View Budget' });
    if (savingsRate > 20) ins.push({ emoji: '🎯', title: `Savings rate ${savingsRate}% — Great job!`, sub: 'Keep it up', bg: 'linear-gradient(135deg,#059669,#34d399)', cta: 'View Income' });
    if (totalIncome > totalExpenses) ins.push({ emoji: '📈', title: 'Income exceeds expenses', sub: 'Positive cash flow', bg: 'linear-gradient(135deg,#0284c7,#38bdf8)', cta: 'Analytics' });
    ins.push({ emoji: '💡', title: 'Try the AI Advisor for insights', sub: 'Powered by Gemini', bg: 'linear-gradient(135deg,#d97706,#f59e0b)', cta: 'Ask AI' });
    return ins;
};

/* ── Stat Card ── */
const StatCard = ({ label, value, sub, color, icon, trend }) => (
    <div className="stat-card" style={{ '--card-accent': color }}>
        <div className="stat-icon" style={{ background: `${color}18` }}>{icon}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-trend" style={{ color: trend?.startsWith('+') ? '#34d399' : trend?.startsWith('-') ? '#f43f5e' : '#94a3b8' }}>
            {trend} <span style={{ color: '#475569', fontWeight: '400' }}>{sub}</span>
        </div>
    </div>
);

/* ── Main ── */
const Dashboard = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [accounts,     setAccounts]     = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData,  setMonthlyData]  = useState([]);
    const [budgetData,   setBudgetData]   = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState('');
    const [showAddTx,    setShowAddTx]    = useState(false);
    const [showAddAcc,   setShowAddAcc]   = useState(false);
    const [txForm,       setTxForm]       = useState({ title:'', amount:'', type:'expense', category:'Food & Dining', accountId:'', description:'' });
    const [accForm,      setAccForm]      = useState({ name:'', type:'savings', balance:'', institution:'' });
    const [expanded,     setExpanded]     = useState(null); // 'transactions'|'income'|'expenses'|'accounts'|'insights'
    const [txFilter,     setTxFilter]     = useState('all'); // 'all'|'income'|'expense'

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const month = new Date().toISOString().slice(0,7);
            const [aR, tR, cR, mR, bR] = await Promise.all([
                getAccounts(), getTransactions(), getByCategory(), getMonthlySummary(), getBudgetSummary(month)
            ]);
            setAccounts(aR.data); setTransactions(tR.data);
            setCategoryData(cR.data); setMonthlyData(mR.data); setBudgetData(bR.data);
        } catch(err) {
            // 401 is handled by API interceptor (auto-redirect to login)
            if (err.response?.status !== 401) {
                const msg = err.response?.status === 500
                    ? 'Server error — please check if the backend is running'
                    : err.message?.includes('Network')
                        ? 'Cannot reach server — is the backend running on port 5000?'
                        : 'Failed to load data';
                setError(msg);
            }
        }
        finally  { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const totalBalance  = accounts.reduce((s,a) => s + a.balance, 0);
    const totalIncome   = transactions.filter(t => t.type==='income').reduce((s,t) => s+t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type==='expense').reduce((s,t) => s+t.amount, 0);
    const savingsRate   = totalIncome > 0 ? +((( totalIncome - totalExpenses)/totalIncome)*100).toFixed(1) : 0;
    const healthScore   = Math.min(100, Math.round(Math.min(savingsRate*1.5,40) + (totalIncome>totalExpenses?40:(totalIncome/Math.max(totalExpenses,1))*40) + 20));
    const insights      = makeInsights(savingsRate, budgetData, totalIncome, totalExpenses);
    const hour          = new Date().getHours();
    const greeting      = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    const handleAddTx = async (e) => {
        e.preventDefault();
        try { await addTransaction({...txForm, amount: parseFloat(txForm.amount)}); setShowAddTx(false); setTxForm({title:'',amount:'',type:'expense',category:'Food & Dining',accountId:'',description:''}); fetchData(); }
        catch { setError('Failed to add transaction'); }
    };
    const handleAddAcc = async (e) => {
        e.preventDefault();
        try { await addAccount({...accForm, balance: parseFloat(accForm.balance)}); setShowAddAcc(false); setAccForm({name:'',type:'savings',balance:'',institution:''}); fetchData(); }
        catch { setError('Failed to add account'); }
    };

    const quickActions = [
        { label:'Transactions', emoji:'⇄', path:'/transactions', bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)', sh:'rgba(139,92,246,0.4)' },
        { label:'AI Advisor',   emoji:'✦', path:'/ai-advisor',   bg:'linear-gradient(135deg,#34d399,#059669)', sh:'rgba(52,211,153,0.4)' },
        { label:'Analytics',    emoji:'⬡', path:'/analytics',    bg:'linear-gradient(135deg,#38bdf8,#0284c7)', sh:'rgba(56,189,248,0.4)' },
        { label:'Budgets',      emoji:'◎', path:'/budgets',      bg:'linear-gradient(135deg,#f59e0b,#d97706)', sh:'rgba(245,158,11,0.4)' },
        { label:'Accounts',     emoji:'◻', path:'/accounts',     bg:'linear-gradient(135deg,#14b8a6,#0f766e)', sh:'rgba(20,184,166,0.4)' },
    ];

    if (loading) return (
        <div style={{minHeight:'100vh',background:'var(--bg-primary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{textAlign:'center'}}>
                <div style={{width:'40px',height:'40px',border:'2px solid #1c2133',borderTop:'2px solid #8b5cf6',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}/>
                <p style={{color:'#475569',fontSize:'13px'}}>Loading your finances…</p>
            </div>
        </div>
    );


    return (
        <div className="dash-page" style={{padding:'24px 28px',minHeight:'100%',fontFamily:'DM Sans,sans-serif'}}>
            {error && (
                <div style={{background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.25)',borderRadius:'14px',padding:'16px 20px',marginBottom:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <span style={{fontSize:'20px'}}>⚠️</span>
                        <div>
                            <div style={{fontSize:'13px',fontWeight:'700',color:'#f43f5e'}}>Data Load Error</div>
                            <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{error}</div>
                        </div>
                    </div>
                    <div style={{display:'flex',gap:'8px',flexShrink:0}}>
                        <button onClick={fetchData} style={{background:'rgba(244,63,94,0.1)',border:'1px solid rgba(244,63,94,0.3)',borderRadius:'8px',padding:'6px 14px',fontSize:'12px',fontWeight:'700',color:'#f43f5e',cursor:'pointer'}}>↺ Retry</button>
                        <button onClick={()=>window.location.href='/login'} style={{background:'var(--bg-tertiary)',border:'1px solid var(--border)',borderRadius:'8px',padding:'6px 14px',fontSize:'12px',fontWeight:'600',color:'var(--text-muted)',cursor:'pointer'}}>Re-login</button>
                    </div>
                </div>
            )}

            {/* Welcome Strip */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'22px'}}>
                <div>
                    <div style={{fontSize:'11px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:'3px'}}>{greeting} 👋</div>
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:'22px',fontWeight:'800',color:'var(--text-primary)',letterSpacing:'-0.3px'}}>
                        Welcome back, <span style={{background:'linear-gradient(90deg,#8b5cf6,#34d399)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{user?.name?.split(' ')[0]}</span>
                    </div>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                    <button onClick={()=>setShowAddAcc(true)} style={{background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:'600',color:'var(--text-secondary)',cursor:'pointer'}}>+ Account</button>
                    <button onClick={()=>setShowAddTx(true)} style={{background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',border:'none',borderRadius:'10px',padding:'8px 18px',fontSize:'12px',fontWeight:'700',color:'white',cursor:'pointer',boxShadow:'0 4px 14px rgba(139,92,246,0.35)'}}>+ Transaction</button>
                </div>
            </div>


            {/* ── Expandable KPI Cards ── */}
            <div className="dash-kpi-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'20px'}}>

                {/* Net Worth / Accounts Card */}
                {[
                    { key:'accounts', icon:'💎', label:'Net Worth',    val:`₹${totalBalance.toLocaleString('en-IN')}`,  color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', trend:'+12%',  up:true  },
                    { key:'income',   icon:'📥', label:'Total Income',  val:`₹${totalIncome.toLocaleString('en-IN')}`,   color:'#34d399', bg:'rgba(52,211,153,0.08)',  trend:'+8.2%', up:true  },
                    { key:'expenses', icon:'📤', label:'Total Expenses',val:`₹${totalExpenses.toLocaleString('en-IN')}`, color:'#f43f5e', bg:'rgba(244,63,94,0.08)',   trend:'-3.1%', up:false },
                    { key:'insights', icon:'🎯', label:'Savings Rate',  val:`${savingsRate}%`,                            color:'#f59e0b', bg:'rgba(245,158,11,0.08)',  trend:savingsRate>20?'Excellent':'Improve', up:savingsRate>20 },
                ].map((k)=>{
                    const isOpen = expanded === k.key;
                    return (
                        <div key={k.key}
                            style={{background:'var(--bg-secondary)',border:`1px solid ${isOpen?k.color+'40':'var(--border)'}`,borderRadius:'14px',overflow:'hidden',transition:'border 0.2s',cursor:'pointer',boxShadow:isOpen?`0 0 0 1px ${k.color}30`:''}}
                            onClick={()=>setExpanded(isOpen?null:k.key)}>
                            {/* Header */}
                            <div style={{padding:'16px 18px'}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                                    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:k.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>{k.icon}</div>
                                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                                        <span style={{fontSize:'10px',fontWeight:'700',color:k.up?'#34d399':'#f43f5e',background:k.up?'rgba(52,211,153,0.1)':'rgba(244,63,94,0.1)',padding:'2px 8px',borderRadius:'20px'}}>{k.trend}</span>
                                        <span style={{fontSize:'12px',color:'var(--text-muted)',transition:'transform 0.2s',display:'inline-block',transform:isOpen?'rotate(180deg)':'none'}}>▾</span>
                                    </div>
                                </div>
                                <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.8px'}}>{k.label}</div>
                                <div style={{fontFamily:'Syne,sans-serif',fontSize:'20px',fontWeight:'800',color:k.color,letterSpacing:'-0.3px'}}>{k.val}</div>
                            </div>

                            {/* Expanded Content */}
                            <div style={{maxHeight:isOpen?'400px':'0',overflow:'hidden',transition:'max-height 0.35s ease'}}>
                                <div style={{padding:'0 18px 16px',borderTop:`1px solid ${k.color}20`}} onClick={e=>e.stopPropagation()}>

                                    {/* Income Expanded */}
                                    {k.key==='income' && (
                                        <div style={{paddingTop:'12px'}}>
                                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'10px',fontWeight:'600',textTransform:'uppercase'}}>Income Sources</div>
                                            {transactions.filter(t=>t.type==='income').slice(0,5).map((tx,i)=>(
                                                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                                                    <div style={{fontSize:'12px',color:'var(--text-primary)',fontWeight:'500'}}>{tx.title}</div>
                                                    <div style={{fontSize:'12px',fontWeight:'700',color:'#34d399'}}>+₹{tx.amount?.toLocaleString('en-IN')}</div>
                                                </div>
                                            ))}
                                            {transactions.filter(t=>t.type==='income').length===0&&<div style={{fontSize:'12px',color:'var(--text-muted)',textAlign:'center',padding:'12px 0'}}>No income recorded yet</div>}
                                            <button onClick={()=>navigate('/income')} style={{marginTop:'10px',width:'100%',background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.2)',borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',color:'#34d399',cursor:'pointer'}}>View Income Page →</button>
                                        </div>
                                    )}

                                    {/* Expenses Expanded */}
                                    {k.key==='expenses' && (
                                        <div style={{paddingTop:'12px'}}>
                                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'10px',fontWeight:'600',textTransform:'uppercase'}}>Top Spending Categories</div>
                                            {(categoryData || []).slice(0,5).map((cat,i)=>{
                                                const pct=Math.round((cat.total/Math.max(totalExpenses,1))*100);
                                                return(
                                                    <div key={i} style={{marginBottom:'8px'}}>
                                                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',marginBottom:'4px'}}>
                                                            <span style={{color:'var(--text-primary)',fontWeight:'600'}}>{cat._id||cat.category}</span>
                                                            <span style={{color:'var(--text-muted)'}}>₹{cat.total?.toLocaleString('en-IN')} · {pct}%</span>
                                                        </div>
                                                        <div style={{height:'4px',background:'var(--border)',borderRadius:'2px',overflow:'hidden'}}>
                                                            <div style={{height:'100%',width:`${pct}%`,background:'#f43f5e',borderRadius:'2px',transition:'width 0.5s ease'}}/>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <button onClick={()=>navigate('/transactions')} style={{marginTop:'8px',width:'100%',background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',color:'#f43f5e',cursor:'pointer'}}>View Transactions →</button>
                                        </div>
                                    )}

                                    {/* Accounts / Net Worth Expanded */}
                                    {k.key==='accounts' && (
                                        <div style={{paddingTop:'12px'}}>
                                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'10px',fontWeight:'600',textTransform:'uppercase'}}>All Accounts</div>
                                            {accounts.length===0
                                                ? <div style={{fontSize:'12px',color:'var(--text-muted)',textAlign:'center',padding:'12px 0'}}>No accounts yet</div>
                                                : accounts.map(acc=>(
                                                    <div key={acc._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--border)'}}>
                                                        <div>
                                                            <div style={{fontSize:'12px',fontWeight:'600',color:'var(--text-primary)'}}>{acc.name}</div>
                                                            <div style={{fontSize:'10px',color:'var(--text-muted)',textTransform:'capitalize'}}>{acc.type}</div>
                                                        </div>
                                                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'13px',fontWeight:'700',color:'#8b5cf6'}}>₹{acc.balance.toLocaleString('en-IN')}</div>
                                                    </div>
                                                ))
                                            }
                                            <button onClick={()=>setShowAddAcc(true)} style={{marginTop:'10px',width:'100%',background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',color:'#8b5cf6',cursor:'pointer'}}>+ Add Account</button>
                                        </div>
                                    )}

                                    {/* Savings / AI Insights Expanded */}
                                    {k.key==='insights' && (
                                        <div style={{paddingTop:'12px'}}>
                                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'10px',fontWeight:'600',textTransform:'uppercase'}}>AI Insights</div>
                                            {insights.map((ins,i)=>(
                                                <div key={i} style={{background:ins.bg,borderRadius:'10px',padding:'10px 12px',marginBottom:'8px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
                                                    <span style={{fontSize:'16px',flexShrink:0}}>{ins.emoji}</span>
                                                    <div>
                                                        <div style={{fontSize:'12px',fontWeight:'700',color:'white'}}>{ins.title}</div>
                                                        <div style={{fontSize:'11px',color:'rgba(255,255,255,0.65)',marginTop:'2px'}}>{ins.sub}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={()=>navigate('/ai-advisor')} style={{marginTop:'4px',width:'100%',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',color:'#f59e0b',cursor:'pointer'}}>Full AI Advisor →</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Charts Row */}
            <div className="dash-row" style={{display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'16px'}}>
                <div style={{flex:'1.4', minWidth:'300px', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                        <div>
                            <div style={{fontSize:'13px',fontWeight:'700',color:'var(--text-primary)'}}>Cash Flow</div>
                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>Income vs Expenses</div>
                        </div>
                        <span style={{fontSize:'10px',background:'rgba(139,92,246,0.1)',color:'#8b5cf6',padding:'3px 10px',borderRadius:'20px',fontWeight:'600'}}>Monthly</span>
                    </div>
                    <Chart categoryData={categoryData} monthlyData={monthlyData}/>
                </div>
                <div style={{flex:'1', minWidth:'300px', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px'}}>
                    <div style={{marginBottom:'16px'}}>
                        <div style={{fontSize:'13px',fontWeight:'700',color:'var(--text-primary)'}}>Spending Breakdown</div>
                        <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>By category</div>
                    </div>
                    {categoryData.length>0
                        ? <SpendingRings data={categoryData}/>
                        : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'180px',color:'var(--text-muted)',fontSize:'13px',gap:'8px'}}><span style={{fontSize:'32px'}}>📊</span>Add transactions to see spending</div>
                    }
                </div>
            </div>

            {/* Activity + Accounts Row */}
            <div className="dash-row" style={{display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'16px'}}>
                <div style={{flex:'1.4', minWidth:'300px', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                        <div>
                            <div style={{fontSize:'13px',fontWeight:'700',color:'var(--text-primary)'}}>Recent Activity</div>
                            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>Latest transactions</div>
                        </div>
                        <button onClick={()=>setShowAddTx(true)} style={{background:'var(--bg-tertiary)',border:'1px solid var(--border)',borderRadius:'8px',padding:'4px 12px',fontSize:'11px',color:'var(--text-muted)',cursor:'pointer',fontWeight:'600'}}>+ Add</button>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                        {transactions.length===0
                            ? <div style={{textAlign:'center',padding:'32px',color:'var(--text-muted)',fontSize:'13px'}}><div style={{fontSize:'28px',marginBottom:'8px'}}>💸</div>No transactions yet</div>
                            : transactions.slice(0,7).map((tx,i)=>(
                                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'9px 10px',borderRadius:'10px',cursor:'default',transition:'background 0.15s'}}
                                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg-tertiary)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                    <div style={{width:'34px',height:'34px',borderRadius:'9px',background:tx.type==='income'?'rgba(52,211,153,0.12)':'rgba(244,63,94,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>{tx.type==='income'?'📥':'📤'}</div>
                                    <div style={{flex:1,overflow:'hidden'}}>
                                        <div style={{fontSize:'12px',fontWeight:'600',color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tx.title}</div>
                                        <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'1px'}}>{tx.category}</div>
                                    </div>
                                    <div style={{fontSize:'13px',fontWeight:'700',color:tx.type==='income'?'#34d399':'#f43f5e',flexShrink:0}}>{tx.type==='income'?'+':'-'}₹{tx.amount?.toLocaleString('en-IN')}</div>
                                </div>
                            ))
                        }
                    </div>
                    {transactions.length>0&&(<div style={{borderTop:'1px solid var(--border)',marginTop:'8px',paddingTop:'10px',textAlign:'center'}}><span onClick={()=>navigate('/transactions')} style={{fontSize:'12px',color:'#8b5cf6',fontWeight:'600',cursor:'pointer'}}>View all transactions â†’</span></div>)}
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                    <div style={{background:'linear-gradient(135deg,#0f172a,#1e1b4b)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'16px',padding:'18px',textAlign:'center'}}>
                        <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px'}}>Financial Health</div>
                        <HealthRing score={healthScore}/>
                    </div>
                    <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:'16px',padding:'18px',flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                            <div style={{fontSize:'13px',fontWeight:'700',color:'var(--text-primary)'}}>Accounts</div>
                            <button onClick={()=>setShowAddAcc(true)} style={{background:'var(--bg-tertiary)',border:'1px solid var(--border)',borderRadius:'8px',padding:'4px 10px',fontSize:'11px',color:'var(--text-muted)',cursor:'pointer',fontWeight:'600'}}>+ Add</button>
                        </div>
                        {accounts.length===0
                            ? <div style={{textAlign:'center',padding:'14px',color:'var(--text-muted)',fontSize:'12px'}}>No accounts yet</div>
                            : accounts.slice(0,4).map(acc=>(
                                <div key={acc._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                        <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(139,92,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px'}}>🏦</div>
                                        <div>
                                            <div style={{fontSize:'12px',fontWeight:'600',color:'var(--text-primary)'}}>{acc.name}</div>
                                            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>{acc.type}</div>
                                        </div>
                                    </div>
                                    <div style={{fontFamily:'Syne,sans-serif',fontSize:'13px',fontWeight:'700',color:'#8b5cf6'}}>₹{acc.balance.toLocaleString('en-IN')}</div>
                                </div>
                            ))
                        }
                        {accounts.length>4&&(<div style={{paddingTop:'8px',textAlign:'center'}}><span onClick={()=>navigate('/accounts')} style={{fontSize:'11px',color:'#8b5cf6',fontWeight:'600',cursor:'pointer'}}>+{accounts.length-4} more â†’</span></div>)}
                    </div>
                </div>
            </div>

            {/* Budget Tracker */}
            {budgetData.length>0&&(
                <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:'16px',padding:'20px',marginBottom:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                        <div><div style={{fontSize:'13px',fontWeight:'700',color:'var(--text-primary)'}}>Budget Tracker</div><div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>Spending limits this month</div></div>
                        <span style={{fontSize:'10px',background:'rgba(56,189,248,0.1)',color:'#38bdf8',padding:'3px 10px',borderRadius:'20px',fontWeight:'600'}}>{budgetData.length} active</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'12px'}}>
                        {budgetData.map((b,i)=>{const bc=b.percentage>90?'#f43f5e':b.percentage>70?'#f59e0b':'#34d399';return(
                            <div key={i} style={{padding:'12px 14px',background:'var(--bg-tertiary)',borderRadius:'12px',border:'1px solid var(--border)'}}>
                                <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'8px'}}><span style={{color:'var(--text-primary)',fontWeight:'600'}}>{b.category}</span><span style={{color:bc,fontWeight:'700'}}>{b.percentage}%</span></div>
                                <div style={{height:'5px',background:'var(--border)',borderRadius:'3px',overflow:'hidden',marginBottom:'6px'}}><div style={{height:'100%',width:`${Math.min(b.percentage,100)}%`,background:bc,borderRadius:'3px',transition:'width 0.6s ease'}}/></div>
                                <div style={{fontSize:'10px',color:'var(--text-muted)'}}>₹{b.actualSpending} of ₹{b.monthlyLimit} Â· ₹{b.remaining} left</div>
                            </div>
                        );})}
                    </div>
                </div>
            )}

            {/* AI Insights */}
            {insights.length>0&&(
                <div style={{marginBottom:'16px'}}>
                    <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'10px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.8px'}}>âœ¦ AI Insights</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'}}>
                        {insights.map((ins,i)=>(<div key={i} style={{background:ins.bg,borderRadius:'14px',padding:'16px',cursor:'pointer'}} onClick={e=>e.preventDefault()}><div style={{fontSize:'18px',marginBottom:'6px'}}>{ins.emoji}</div><div style={{fontSize:'12px',fontWeight:'700',color:'white',marginBottom:'3px'}}>{ins.title}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.65)'}}>{ins.sub}</div></div>))}
                    </div>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showAddTx&&(<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddTx(false)}}><div className="modal"><h2 style={{fontSize:'16px',fontWeight:'700',color:'#f1f5f9',marginBottom:'20px'}}>Add Transaction</h2><form onSubmit={handleAddTx}><div style={{marginBottom:'14px'}}><label className="label">Title</label><input className="input" placeholder="e.g. Swiggy Order" value={txForm.title} onChange={e=>setTxForm({...txForm,title:e.target.value})} required/></div><div className="grid-2" style={{marginBottom:'14px'}}><div><label className="label">Amount (₹)</label><input className="input" type="number" placeholder="0" value={txForm.amount} onChange={e=>setTxForm({...txForm,amount:e.target.value})} required/></div><div><label className="label">Type</label><select className="input" value={txForm.type} onChange={e=>setTxForm({...txForm,type:e.target.value})}><option value="expense">Expense</option><option value="income">Income</option></select></div></div><div style={{marginBottom:'14px'}}><label className="label">Category</label><select className="input" value={txForm.category} onChange={e=>setTxForm({...txForm,category:e.target.value})}>{['Food & Dining','Shopping','Transport','Entertainment','Health','Education','Bills & Utilities','Salary','Investment','Other'].map(c=><option key={c}>{c}</option>)}</select></div><div style={{marginBottom:'14px'}}><label className="label">Account</label><select className="input" value={txForm.accountId} onChange={e=>setTxForm({...txForm,accountId:e.target.value})} required><option value="">Select account</option>{accounts.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}</select></div><div style={{marginBottom:'20px'}}><label className="label">Note</label><input className="input" placeholder="Optional" value={txForm.description} onChange={e=>setTxForm({...txForm,description:e.target.value})}/></div><div style={{display:'flex',gap:'10px'}}><button type="submit" className="btn-primary">Add Transaction</button><button type="button" className="btn-secondary" onClick={()=>setShowAddTx(false)}>Cancel</button></div></form></div></div>)}

            {/* Add Account Modal */}
            {showAddAcc&&(<div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddAcc(false)}}><div className="modal"><h2 style={{fontSize:'16px',fontWeight:'700',color:'#f1f5f9',marginBottom:'20px'}}>Add Bank Account</h2><form onSubmit={handleAddAcc}><div style={{marginBottom:'14px'}}><label className="label">Account Name</label><input className="input" placeholder="e.g. SBI Savings" value={accForm.name} onChange={e=>setAccForm({...accForm,name:e.target.value})} required/></div><div className="grid-2" style={{marginBottom:'14px'}}><div><label className="label">Type</label><select className="input" value={accForm.type} onChange={e=>setAccForm({...accForm,type:e.target.value})}><option value="savings">Savings</option><option value="checking">Checking</option><option value="credit">Credit</option><option value="investment">Investment</option></select></div><div><label className="label">Balance (₹)</label><input className="input" type="number" placeholder="0" value={accForm.balance} onChange={e=>setAccForm({...accForm,balance:e.target.value})} required/></div></div><div style={{marginBottom:'20px'}}><label className="label">Bank Name</label><input className="input" placeholder="e.g. State Bank of India" value={accForm.institution} onChange={e=>setAccForm({...accForm,institution:e.target.value})}/></div><div style={{display:'flex',gap:'10px'}}><button type="submit" className="btn-primary">Add Account</button><button type="button" className="btn-secondary" onClick={()=>setShowAddAcc(false)}>Cancel</button></div></form></div></div>)}

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default Dashboard;
