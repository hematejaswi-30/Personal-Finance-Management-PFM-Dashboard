import Sidebar from '../components/Sidebar';
import TransactionTable from '../components/TransactionTable';
import { useState, useEffect } from 'react';
import { getTransactions, addTransaction, getAccounts } from '../services/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        title: '', amount: '', type: 'expense',
        category: 'Food & Dining', accountId: '', description: ''
    });

    const fetchData = async () => {
        try {
            const [txnRes, accRes] = await Promise.all([
                getTransactions(), getAccounts()
            ]);
            setTransactions(txnRes.data);
            setAccounts(accRes.data);
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
            await addTransaction({
                ...form,
                amount: parseFloat(form.amount)
            });
            setShowAdd(false);
            setForm({
                title: '', amount: '', type: 'expense',
                category: 'Food & Dining', accountId: '', description: ''
            });
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
                        }}>Transactions</h1>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            {transactions.length} total transactions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
                    >
                        + Add Transaction
                    </button>
                </div>

                <div className="card fade-in">
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                            Loading...
                        </p>
                    ) : (
                        <TransactionTable transactions={transactions} />
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
                            }}>Add Transaction</h2>
                            <form onSubmit={handleAdd}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Title</label>
                                    <input className="input"
                                        placeholder="e.g. Swiggy Order"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                        <label className="label">Amount (₹)</label>
                                        <input className="input" type="number"
                                            placeholder="0"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Type</label>
                                        <select className="input"
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        >
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Category</label>
                                    <select className="input"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {['Food & Dining', 'Shopping', 'Transport',
                                            'Entertainment', 'Health', 'Education',
                                            'Bills & Utilities', 'Salary', 'Investment', 'Other'
                                        ].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label className="label">Account</label>
                                    <select className="input"
                                        value={form.accountId}
                                        onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select account</option>
                                        {accounts.map(a => (
                                            <option key={a._id} value={a._id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="label">Description</label>
                                    <input className="input"
                                        placeholder="Optional note"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-primary">
                                        Add Transaction
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

export default Transactions;