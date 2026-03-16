import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { getBudgets, addBudget, deleteBudget, getBudgetSummary } from '../services/api';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        category: 'Food & Dining',
        monthlyLimit: '',
        month: new Date().toISOString().slice(0, 7)
    });

    const fetchData = async () => {
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const [budgetRes, summaryRes] = await Promise.all([
                getBudgets(),
                getBudgetSummary(currentMonth)
            ]);
            setBudgets(budgetRes.data);
            setSummary(summaryRes.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addBudget({
                ...form,
                monthlyLimit: parseFloat(form.monthlyLimit)
            });
            setShowAdd(false);
            setForm({
                category: 'Food & Dining',
                monthlyLimit: '',
                month: new Date().toISOString().slice(0, 7)
            });
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this budget?')) return;
        try {
            await deleteBudget(id);
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '28px'
                }} className="fade-in">
                    <div>
                        <h1 style={{
                            fontFamily: 'Syne, sans-serif',
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px'
                        }}>Budgets</h1>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            {new Date().toLocaleDateString('en-IN', {
                                month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
                    >
                        + Set Budget
                    </button>
                </div>

                {/* Budget Summary */}
                {summary.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '14px',
                        marginBottom: '20px'
                    }} className="fade-in">
                        {summary.map((b, i) => (
                            <div key={i} className="card">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {b.category}
                                    </span>
                                    <span className={
                                        b.percentage > 90 ? 'badge badge-red' :
                                        b.percentage > 70 ? 'badge badge-yellow' :
                                        'badge badge-green'
                                    }>
                                        {b.percentage}%
                                    </span>
                                </div>
                                <div style={{
                                    height: '6px',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(b.percentage, 100)}%`,
                                        background: b.percentage > 90
                                            ? 'var(--accent-red)'
                                            : b.percentage > 70
                                            ? 'var(--accent-yellow)'
                                            : 'var(--accent-green)',
                                        borderRadius: '3px',
                                        transition: 'width 0.6s ease'
                                    }} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)'
                                }}>
                                    <span>Spent: ₹{b.actualSpending.toLocaleString()}</span>
                                    <span>Limit: ₹{b.monthlyLimit.toLocaleString()}</span>
                                </div>
                                <div style={{
                                    marginTop: '6px',
                                    fontSize: '12px',
                                    color: b.remaining < 0
                                        ? 'var(--accent-red)'
                                        : 'var(--accent-green)'
                                }}>
                                    {b.remaining < 0
                                        ? `⚠️ Over by ₹${Math.abs(b.remaining).toLocaleString()}`
                                        : `✅ ₹${b.remaining.toLocaleString()} remaining`
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* All Budgets */}
                <div className="card fade-in">
                    <h3 style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        marginBottom: '16px'
                    }}>All Budgets</h3>
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                            Loading...
                        </p>
                    ) : budgets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px' }}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎯</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                No budgets set yet
                            </p>
                        </div>
                    ) : (
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '13px'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
                                    {['Category', 'Month', 'Limit', 'Action'].map(h => (
                                        <th key={h} style={{
                                            textAlign: 'left',
                                            padding: '8px 12px',
                                            fontSize: '11px',
                                            color: 'var(--text-muted)',
                                            fontWeight: '500',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.8px'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((b) => (
                                    <tr key={b._id} style={{
                                        borderBottom: '0.5px solid var(--border)'
                                    }}>
                                        <td style={{ padding: '12px' }}>
                                            <span className="badge badge-purple">
                                                {b.category}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '12px',
                                            color: 'var(--text-secondary)'
                                        }}>{b.month}</td>
                                        <td style={{
                                            padding: '12px',
                                            color: 'var(--accent-green)',
                                            fontWeight: '500'
                                        }}>
                                            ₹{b.monthlyLimit.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleDelete(b._id)}
                                                className="btn-danger"
                                                style={{ padding: '4px 12px', fontSize: '12px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {showAdd && (
                    <div className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowAdd(false)
                        }}>
                        <div className="modal">
                            <h2 style={{
                                fontSize: '16px', fontWeight: '600',
                                color: 'var(--text-primary)', marginBottom: '20px'
                            }}>Set Budget</h2>
                            <form onSubmit={handleAdd}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Category</label>
                                    <select className="input"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {['Food & Dining', 'Shopping', 'Transport',
                                            'Entertainment', 'Health', 'Education',
                                            'Bills & Utilities', 'Investment', 'Other'
                                        ].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Monthly Limit (₹)</label>
                                    <input className="input" type="number"
                                        placeholder="e.g. 5000"
                                        value={form.monthlyLimit}
                                        onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="label">Month</label>
                                    <input className="input" type="month"
                                        value={form.month}
                                        onChange={(e) => setForm({ ...form, month: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-primary">
                                        Set Budget
                                    </button>
                                    <button type="button" className="btn-secondary"
                                        onClick={() => setShowAdd(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budgets;