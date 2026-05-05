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

    const isBusinessMode = localStorage.getItem('nivesh-mode') === 'business';
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    // 🛡 Filter data based on active mode
    const filteredTransactions = safeTransactions.filter(t => isBusinessMode ? t.isBusiness : !t.isBusiness);

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    const savingsRate = totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;

    // 📊 Mode-Aware Category Breakdown
    const modeAwareCategoryData = (() => {
        const filtered = filteredTransactions.filter(t => t.type === 'expense');
        const grouped = filtered.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
            return acc;
        }, {});
        return Object.entries(grouped)
            .map(([_id, total]) => ({ _id, total, name: _id, value: total }))
            .sort((a, b) => b.total - a.total);
    })();

    const topCategory = modeAwareCategoryData.length > 0 ? modeAwareCategoryData[0] : null;

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} className="fade-in">
                    <div>
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
                            Deep dive into your {isBusinessMode ? 'business' : 'personal'} spending patterns
                        </p>
                    </div>
                    {isBusinessMode && (
                        <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf2430', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px' }}>🏬</span>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.5px' }}>BUSINESS PRO</span>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid-3 fade-in" style={{ marginBottom: '20px' }}>
                    {[
                        {
                            label: isBusinessMode ? 'Business Income' : 'Total Income',
                            value: `₹${totalIncome.toLocaleString('en-IN')}`,
                            color: '#34d399',
                            icon: '📥'
                        },
                        {
                            label: isBusinessMode ? 'Operational Costs' : 'Total Expenses',
                            value: `₹${totalExpenses.toLocaleString('en-IN')}`,
                            color: '#f43f5e',
                            icon: '📤'
                        },
                        {
                            label: isBusinessMode ? 'Profit Margin' : 'Savings Rate',
                            value: `${savingsRate}%`,
                            color: '#fbbf24',
                            icon: '🎯'
                        }
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px',
                                }}>{stat.label}</div>
                                <span style={{ fontSize: '16px' }}>{stat.icon}</span>
                            </div>
                            <div style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '24px',
                                fontWeight: '800',
                                color: stat.color,
                                letterSpacing: '-0.5px'
                            }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Top Category */}
                {topCategory && (
                    <div className="card fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'rgba(244,63,94,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>🔥</div>
                            <div>
                                <div style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>Top Category ({isBusinessMode ? 'Business' : 'Personal'})</div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    marginTop: '2px'
                                }}>
                                    {topCategory._id} — ₹{topCategory.total.toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ width: '40px', height: '40px', border: '2px solid var(--border)', borderTop: '2px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Analyzing your data...</p>
                    </div>
                ) : (
                    <div className="fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Monthly Overview</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Comparison of Income vs Expenses over time</div>
                        </div>
                        <Chart
                            categoryData={modeAwareCategoryData}
                            monthlyData={monthlyData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;

