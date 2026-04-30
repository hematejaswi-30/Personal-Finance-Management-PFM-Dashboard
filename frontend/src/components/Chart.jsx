import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = [
    '#818cf8', '#34d399', '#38bdf8',
    '#fbbf24', '#f87171', '#a78bfa',
    '#fb923c', '#2dd4bf'
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#161922',
                border: '0.5px solid #2a2d3a',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px'
            }}>
                {label && (
                    <p style={{
                        color: '#9ca3af',
                        marginBottom: '6px'
                    }}>{label}</p>
                )}
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value?.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Chart = ({ categoryData, monthlyData }) => {
    return (
        <div className="grid-2">
            {/* Bar Chart — Monthly Summary */}
            <div className="card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)'
                    }}>Monthly Overview</h3>
                    <span className="badge badge-purple">
                        Last 6 months
                    </span>
                </div>
                {monthlyData.length === 0 ? (
                    <div style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                    }}>
                        No data yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData}
                            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#1e2130"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#4b5563', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#4b5563', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{
                                    fontSize: '11px',
                                    color: '#9ca3af'
                                }}
                            />
                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="#34d399"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="expenses"
                                name="Expenses"
                                fill="#f87171"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Pie Chart — Spending by Category */}
            <div className="card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)'
                    }}>Spending Breakdown</h3>
                    <span className="badge badge-green">
                        By category
                    </span>
                </div>
                {categoryData.length === 0 ? (
                    <div style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                    }}>
                        No expenses yet
                    </div>
                ) : (
                    <div className="header-container" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <ResponsiveContainer width="50%" height={180}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={75}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1 }}>
                            {categoryData.slice(0, 5).map((entry, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '2px',
                                            background: COLORS[index % COLORS.length],
                                            flexShrink: 0
                                        }} />
                                        <span style={{
                                            fontSize: '11px',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {entry.name.length > 12
                                                ? entry.name.slice(0, 12) + '...'
                                                : entry.name}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--text-primary)',
                                        fontWeight: '500'
                                    }}>
                                        ₹{entry.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chart;