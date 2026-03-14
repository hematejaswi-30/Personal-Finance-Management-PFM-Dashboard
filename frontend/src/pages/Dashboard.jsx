import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Chart from '../components/Chart';
import TransactionTable from '../components/TransactionTable';
import {
    getAccounts,
    getTransactions,
    getByCategory,
    getMonthlySummary,
    getBudgetSummary,
    addTransaction,
    addAccount
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

    // Add Transaction Form
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        accountId: '',
        description: ''
    });

    // Add Account Form
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [accountForm, setAccountForm] = useState({
        name: '',
        type: 'savings',
        balance: '',
        institution: ''
    });

    // Fetch all data
    const fetchData = async () => {
        try {
            setLoading(true);
            const currentMonth = new Date().toISOString().slice(0, 7);
            const [
                accountsRes,
                transactionsRes,
                categoryRes,
                monthlyRes,
                budgetRes
            ] = await Promise.all([
                getAccounts(),
                getTransactions(),
                getByCategory(),
                getMonthlySummary(),
                getBudgetSummary(currentMonth)
            ]);
            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data);
            setCategoryData(categoryRes.data);
            setMonthlyData(monthlyRes.data);
            setBudgetSummary(budgetRes.data);
        } catch (error) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Calculate total income and expenses
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Handle Add Transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await addTransaction({
                ...transactionForm,
                amount: parseFloat(transactionForm.amount)
            });
            setShowAddTransaction(false);
            setTransactionForm({
                title: '',
                amount: '',
                type: 'expense',
                category: 'Food & Dining',
                accountId: '',
                description: ''
            });
            fetchData();
        } catch (error) {
            setError('Failed to add transaction');
        }
    };

    // Handle Add Account
    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            await addAccount({
                ...accountForm,
                balance: parseFloat(accountForm.balance)
            });
            setShowAddAccount(false);
            setAccountForm({
                name: '',
                type: 'savings',
                balance: '',
                institution: ''
            });
            fetchData();
        } catch (error) {
            setError('Failed to add account');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <p className="text-gray-600 text-lg">Loading your finances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Welcome Message */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-500">
                        Here is your financial overview
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500 text-sm">Total Balance</p>
                        <p className="text-3xl font-bold text-blue-600">
                            ₹{totalBalance.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Across {accounts.length} accounts
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500 text-sm">Total Income</p>
                        <p className="text-3xl font-bold text-green-600">
                            ₹{totalIncome.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            All time
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500 text-sm">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-600">
                            ₹{totalExpenses.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            All time
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="mb-6">
                    <Chart
                        categoryData={categoryData}
                        monthlyData={monthlyData}
                    />
                </div>

                {/* Budget Summary */}
                {budgetSummary.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Budget Overview
                        </h2>
                        <div className="space-y-4">
                            {budgetSummary.map((budget, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">
                                            {budget.category}
                                        </span>
                                        <span className="text-gray-500">
                                            ₹{budget.actualSpending} / ₹{budget.monthlyLimit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${budget.percentage > 90 ? 'bg-red-500' : budget.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {budget.percentage}% used —
                                        ₹{budget.remaining} remaining
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Accounts Section */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Bank Accounts
                        </h2>
                        <button
                            onClick={() => setShowAddAccount(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                            + Add Account
                        </button>
                    </div>
                    {accounts.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                            No accounts yet — add one!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {accounts.map(account => (
                                <div
                                    key={account._id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <p className="font-medium text-gray-800">
                                        {account.name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {account.institution}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">
                                        ₹{account.balance.toLocaleString()}
                                    </p>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                        {account.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transactions Section */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Recent Transactions
                        </h2>
                        <button
                            onClick={() => setShowAddTransaction(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            + Add Transaction
                        </button>
                    </div>
                    <TransactionTable transactions={transactions} />
                </div>

            </div>

            {/* Add Transaction Modal */}
            {showAddTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Add Transaction
                        </h2>
                        <form onSubmit={handleAddTransaction}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={transactionForm.title}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        title: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={transactionForm.amount}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        amount: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={transactionForm.type}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        type: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={transactionForm.category}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        category: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>Food & Dining</option>
                                    <option>Shopping</option>
                                    <option>Transport</option>
                                    <option>Entertainment</option>
                                    <option>Health</option>
                                    <option>Education</option>
                                    <option>Bills & Utilities</option>
                                    <option>Salary</option>
                                    <option>Investment</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account
                                </label>
                                <select
                                    value={transactionForm.accountId}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        accountId: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={transactionForm.description}
                                    onChange={(e) => setTransactionForm({
                                        ...transactionForm,
                                        description: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                >
                                    Add Transaction
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddTransaction(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Add Bank Account
                        </h2>
                        <form onSubmit={handleAddAccount}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    value={accountForm.name}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        name: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Type
                                </label>
                                <select
                                    value={accountForm.type}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        type: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>
                                    <option value="credit">Credit</option>
                                    <option value="investment">Investment</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Balance (₹)
                                </label>
                                <input
                                    type="number"
                                    value={accountForm.balance}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        balance: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={accountForm.institution}
                                    onChange={(e) => setAccountForm({
                                        ...accountForm,
                                        institution: e.target.value
                                    })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Add Account
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddAccount(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;