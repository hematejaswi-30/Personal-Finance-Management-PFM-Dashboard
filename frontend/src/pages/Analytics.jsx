import Sidebar from '../components/Sidebar';
import Chart from '../components/Chart';
import { useState, useEffect } from 'react';
import { getByCategory, getMonthlySummary, getTransactions } from '../services/api';

const Analytics = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, monthRes, txnRes] = await Promise.all([
                    getByCategory(),
                    getMonthlySummary(),
                    getTransactions()
                ]);
                setCategoryData(catRes.data);
                setMonthlyData(monthRes.data);
                setTransactions(txnRes.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;
    const topCategory = categoryData.length > 0
        ? categoryData.reduce((a, b) => a.value > b.value ? a : b)
        : null;

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <div style={{ marginBottom: '28px' }} className="fade-in">
                    <h1 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.3px'
                    }}>Analytics</h1>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginTop: '4px'
                    }}>
                        Deep dive into your spending patterns
                    </p>
                </div>

                {/* Summary Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '14px',
                    marginBottom: '20px'
                }} className="fade-in">
                    {[
                        {
                            label: 'Total Income',
                            value: `₹${totalIncome.toLocaleString()}`,
                            color: 'var(--accent-green)'
                        },
                        {
                            label: 'Total Expenses',
                            value: `₹${totalExpenses.toLocaleString()}`,
                            color: 'var(--accent-red)'
                        },
                        {
                            label: 'Savings Rate',
                            value: `${savingsRate}%`,
                            color: 'var(--accent-yellow)'
                        }
                    ].map((stat, i) => (
                        <div key={i} className="card">
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                                marginBottom: '8px'
                            }}>{stat.label}</div>
                            <div style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '24px',
                                fontWeight: '700',
                                color: stat.color,
                                letterSpacing: '-0.5px'
                            }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Top Category */}
                {topCategory && (
                    <div className="card fade-in" style={{ marginBottom: '20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: '#f8717122',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>🏆</div>
                            <div>
                                <div style={{
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px'
                                }}>Top Spending Category</div>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginTop: '2px'
                                }}>
                                    {topCategory.name} — ₹{topCategory.value.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts */}
                {loading ? (
                    <p style={{
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        padding: '40px'
                    }}>Loading analytics...</p>
                ) : (
                    <div className="fade-in">
                        <Chart
                            categoryData={categoryData}
                            monthlyData={monthlyData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;

