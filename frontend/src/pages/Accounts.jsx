import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { getAccounts, addAccount, deleteAccount } from '../services/api';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        name: '', type: 'savings', balance: '', institution: ''
    });

    const fetchAccounts = async () => {
        try {
            const res = await getAccounts();
            setAccounts(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAccounts(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addAccount({
                ...form,
                balance: parseFloat(form.balance)
            });
            setShowAdd(false);
            setForm({ name: '', type: 'savings', balance: '', institution: '' });
            fetchAccounts();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this account?')) return;
        try {
            await deleteAccount(id);
            fetchAccounts();
        } catch (err) {
            console.log(err);
        }
    };

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <div className="header-container fade-in" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '28px'
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: 'Syne, sans-serif',
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px'
                        }}>Accounts</h1>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            Total Balance: ₹{totalBalance.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
                    >
                        + Add Account
                    </button>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                        Loading...
                    </p>
                ) : accounts.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏦</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            No accounts yet
                        </p>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="btn-primary"
                            style={{ width: 'auto', padding: '8px 20px', marginTop: '16px' }}
                        >
                            Add Your First Account
                        </button>
                    </div>
                ) : (
                    <div className="grid-2 fade-in">
                        {accounts.map((account) => (
                            <div key={account._id} className="card">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'var(--bg-tertiary)',
                                        border: '0.5px solid var(--border-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>🏦</div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span className="badge badge-purple">
                                            {account.type}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(account._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >✕</button>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px'
                                }}>
                                    {account.name}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '16px'
                                }}>
                                    {account.institution}
                                </div>
                                <div style={{
                                    fontFamily: 'Syne, sans-serif',
                                    fontSize: '26px',
                                    fontWeight: '700',
                                    color: 'var(--accent-purple)'
                                }}>
                                    ₹{account.balance.toLocaleString()}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '4px'
                                }}>
                                    Current Balance
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showAdd && (
                    <div className="modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowAdd(false)
                        }}>
                        <div className="modal">
                            <h2 style={{
                                fontSize: '16px', fontWeight: '600',
                                color: 'var(--text-primary)', marginBottom: '20px'
                            }}>Add Bank Account</h2>
                            <form onSubmit={handleAdd}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Account Name</label>
                                    <input className="input"
                                        placeholder="e.g. SBI Savings"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid-2" style={{ marginBottom: '14px' }}>
                                    <div>
                                        <label className="label">Type</label>
                                        <select className="input"
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        >
                                            <option value="savings">Savings</option>
                                            <option value="checking">Checking</option>
                                            <option value="credit">Credit</option>
                                            <option value="investment">Investment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Balance (₹)</label>
                                        <input className="input" type="number"
                                            placeholder="0"
                                            value={form.balance}
                                            onChange={(e) => setForm({ ...form, balance: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="label">Bank Name</label>
                                    <input className="input"
                                        placeholder="e.g. State Bank of India"
                                        value={form.institution}
                                        onChange={(e) => setForm({ ...form, institution: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-primary">
                                        Add Account
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

export default Accounts;