import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Chart from '../components/Chart';
import TransactionTable from '../components/TransactionTable';
import {
    getAccounts, getTransactions, getByCategory,
    getMonthlySummary, getBudgetSummary,
    addTransaction, addAccount
} from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [budgetSummary, setBudgetSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        title: '', amount: '', type: 'expense',
        category: 'Food & Dining', accountId: '', description: ''
    });
    const [accountForm, setAccountForm] = useState({
        name: '', type: 'savings', balance: '', institution: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const currentMonth = new Date().toISOString().slice(0, 7);
            const [accountsRes, transactionsRes, categoryRes,
                monthlyRes, budgetRes] = await Promise.all([
                getAccounts(), getTransactions(),
                getByCategory(), getMonthlySummary(),
                getBudgetSummary(currentMonth)
            ]);
            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data);
            setCategoryData(categoryRes.data);
            setMonthlyData(monthlyRes.data);
            setBudgetSummary(budgetRes.data);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await addTransaction({
                ...transactionForm,
                amount: parseFloat(transactionForm.amount)
            });
            setShowAddTransaction(false);
            setTransactionForm({
                title: '', amount: '', type: 'expense',
                category: 'Food & Dining', accountId: '', description: ''
            });
            fetchData();
        } catch (err) {
            setError('Failed to add transaction');
        }
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            await addAccount({
                ...accountForm,
                balance: parseFloat(accountForm.balance)
            });
            setShowAddAccount(false);
            setAccountForm({
                name: '', type: 'savings', balance: '', institution: ''
            });
            fetchData();
        } catch (err) {
            setError('Failed to add account');
        }
    };

    if (loading) {
        return (
            <div className="page-layout">
                <Sidebar />
                <div className="main-content" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            border: '2px solid var(--border)',
                            borderTop: '2px solid var(--accent-purple)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }} />
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '13px'
                        }}>
                            Loading your finances...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">

                {/* Header */}
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
                        }}>
                            Good {new Date().getHours() < 12 ? 'Morning' :
                                new Date().getHours() < 17 ? 'Afternoon' :
                                'Evening'}, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="header-actions">
                        <button
                            onClick={() => setShowAddAccount(true)}
                            className="btn-secondary"
                            style={{ fontSize: '13px', padding: '8px 16px' }}
                        >
                            + Account
                        </button>
                        <button
                            onClick={() => setShowAddTransaction(true)}
                            className="btn-primary"
                            style={{ width: 'auto', fontSize: '13px', padding: '8px 16px' }}
                        >
                            + Transaction
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg">{error}</div>}

                {/* Stats Cards */}
                <div className="grid-4 fade-in" style={{ marginBottom: '20px' }}>
                    {[
                        {
                            label: 'Total Balance',
                            value: `₹${totalBalance.toLocaleString()}`,
                            color: 'var(--accent-purple)',
                            sub: `${accounts.length} accounts`
                        },
                        {
                            label: 'Total Income',
                            value: `₹${totalIncome.toLocaleString()}`,
                            color: 'var(--accent-green)',
                            sub: 'All time'
                        },
                        {
                            label: 'Total Expenses',
                            value: `₹${totalExpenses.toLocaleString()}`,
                            color: 'var(--accent-red)',
                            sub: 'All time'
                        },
                        {
                            label: 'Savings Rate',
                            value: `${savingsRate}%`,
                            color: 'var(--accent-yellow)',
                            sub: savingsRate > 20 ? '🎯 Great!' : '💡 Improve'
                        }
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{
                            animationDelay: `${i * 0.05}s`
                        }}>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                                marginBottom: '10px'
                            }}>
                                {stat.label}
                            </div>
                            <div style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '22px',
                                fontWeight: '700',
                                color: stat.color,
                                letterSpacing: '-0.5px',
                                marginBottom: '6px'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)'
                            }}>
                                {stat.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div style={{ marginBottom: '20px' }} className="fade-in">
                    <Chart
                        categoryData={categoryData}
                        monthlyData={monthlyData}
                    />
                </div>

                {/* Budget Summary */}
                {budgetSummary.length > 0 && (
                    <div className="card fade-in" style={{ marginBottom: '20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <h3 style={{
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'var(--text-primary)'
                            }}>Budget Overview</h3>
                            <span className="badge badge-blue">
                                This month
                            </span>
                        </div>
                        <div className="grid-2">
                            {budgetSummary.map((budget, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        marginBottom: '6px'
                                    }}>
                                        <span style={{
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {budget.category}
                                        </span>
                                        <span style={{
                                            color: 'var(--text-muted)'
                                        }}>
                                            ₹{budget.actualSpending} / ₹{budget.monthlyLimit}
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '5px',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${Math.min(budget.percentage, 100)}%`,
                                            background: budget.percentage > 90
                                                ? 'var(--accent-red)'
                                                : budget.percentage > 70
                                                ? 'var(--accent-yellow)'
                                                : 'var(--accent-green)',
                                            borderRadius: '3px',
                                            transition: 'width 0.6s ease'
                                        }} />
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        marginTop: '4px'
                                    }}>
                                        {budget.percentage}% used ·
                                        ₹{budget.remaining} left
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Accounts */}
                <div className="card fade-in" style={{ marginBottom: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--text-primary)'
                        }}>Bank Accounts</h3>
                        <button
                            onClick={() => setShowAddAccount(true)}
                            style={{
                                background: 'var(--bg-tertiary)',
                                border: '0.5px solid var(--border-light)',
                                borderRadius: '6px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            + Add
                        </button>
                    </div>
                    {accounts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '24px',
                            color: 'var(--text-muted)',
                            fontSize: '13px'
                        }}>
                            No accounts yet — add one to get started!
                        </div>
                    ) : (
                        <div className="grid-2">
                            {accounts.map((account) => (
                                <div key={account._id} style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '0.5px solid var(--border)',
                                    borderRadius: '10px',
                                    padding: '14px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '8px'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {account.name}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: 'var(--text-muted)',
                                                marginTop: '2px'
                                            }}>
                                                {account.institution}
                                            </div>
                                        </div>
                                        <span className="badge badge-purple"
                                            style={{ fontSize: '10px' }}>
                                            {account.type}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontFamily: 'Syne, sans-serif',
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: 'var(--accent-purple)'
                                    }}>
                                        ₹{account.balance.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transactions */}
                <div className="card fade-in">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--text-primary)'
                        }}>Recent Transactions</h3>
                        <button
                            onClick={() => setShowAddTransaction(true)}
                            style={{
                                background: 'var(--bg-tertiary)',
                                border: '0.5px solid var(--border-light)',
                                borderRadius: '6px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            + Add
                        </button>
                    </div>
                    <TransactionTable transactions={transactions} />
                </div>

            </div>

            {/* Add Transaction Modal */}
            {showAddTransaction && (
                <div className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowAddTransaction(false)
                    }}>
                    <div className="modal">
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '20px'
                        }}>Add Transaction</h2>
                        <form onSubmit={handleAddTransaction}>
                            <div style={{ marginBottom: '14px' }}>
                                <label className="label">Title</label>
                                <input className="input"
                                    placeholder="e.g. Swiggy Order"
                                    value={transactionForm.title}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="grid-2" style={{ marginBottom: '14px' }}>
                                <div>
                                    <label className="label">Amount (₹)</label>
                                    <input className="input" type="number"
                                        placeholder="0"
                                        value={transactionForm.amount}
                                        onChange={(e) => setTransactionForm({
                                            ...transactionForm,
                                            amount: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Type</label>
                                    <select className="input"
                                        value={transactionForm.type}
                                        onChange={(e) => setTransactionForm({
                                            ...transactionForm,
                                            type: e.target.value
                                        })}
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label className="label">Category</label>
                                <select className="input"
                                    value={transactionForm.category}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        category: e.target.value
                                    })}
                                >
                                    {['Food & Dining', 'Shopping', 'Transport',
                                        'Entertainment', 'Health', 'Education',
                                        'Bills & Utilities', 'Salary',
                                        'Investment', 'Other'].map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label className="label">Account</label>
                                <select className="input"
                                    value={transactionForm.accountId}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        accountId: e.target.value
                                    })}
                                    required
                                >
                                    <option value="">Select account</option>
                                    {accounts.map(a => (
                                        <option key={a._id} value={a._id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label className="label">Description</label>
                                <input className="input"
                                    placeholder="Optional note"
                                    value={transactionForm.description}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        description: e.target.value
                                    })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">
                                    Add Transaction
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowAddTransaction(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Account Modal */}
            {showAddAccount && (
                <div className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowAddAccount(false)
                    }}>
                    <div className="modal">
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '20px'
                        }}>Add Bank Account</h2>
                        <form onSubmit={handleAddAccount}>
                            <div style={{ marginBottom: '14px' }}>
                                <label className="label">Account Name</label>
                                <input className="input"
                                    placeholder="e.g. SBI Savings"
                                    value={accountForm.name}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        name: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="grid-2" style={{ marginBottom: '14px' }}>
                                <div>
                                    <label className="label">Type</label>
                                    <select className="input"
                                        value={accountForm.type}
                                        onChange={(e) => setAccountForm({
                                            ...accountForm,
                                            type: e.target.value
                                        })}
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
                                        value={accountForm.balance}
                                        onChange={(e) => setAccountForm({
                                            ...accountForm,
                                            balance: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label className="label">Bank Name</label>
                                <input className="input"
                                    placeholder="e.g. State Bank of India"
                                    value={accountForm.institution}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        institution: e.target.value
                                    })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">
                                    Add Account
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowAddAccount(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;