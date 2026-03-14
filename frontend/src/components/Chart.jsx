import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const COLORS = [
    '#6366f1', '#22c55e', '#f59e0b',
    '#ef4444', '#3b82f6', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316'
];

const Chart = ({ categoryData, monthlyData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Pie Chart - Spending by Category */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Spending by Category
                </h2>
                {categoryData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                        No spending data yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`₹${value}`, 'Amount']}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Bar Chart - Monthly Income vs Expenses */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Monthly Income vs Expenses
                </h2>
                {monthlyData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                        No monthly data yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                formatter={(value) => [`₹${value}`]}
                            />
                            <Legend />
                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="#22c55e"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="expenses"
                                name="Expenses"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default Chart;
