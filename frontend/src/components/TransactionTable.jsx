const CATEGORY_COLORS = {
    'Food & Dining': '#f87171',
    'Shopping': '#818cf8',
    'Transport': '#38bdf8',
    'Entertainment': '#fbbf24',
    'Health': '#34d399',
    'Education': '#a78bfa',
    'Bills & Utilities': '#fb923c',
    'Salary': '#34d399',
    'Investment': '#2dd4bf',
    'Other': '#9ca3af'
};

const TransactionTable = ({ transactions, onDelete }) => {
    if (transactions.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                    No transactions yet
                </p>
                <p style={{ fontSize: '12px' }}>
                    Add your first transaction to get started
                </p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
            }}>
                <thead>
                    <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
                        {['Transaction', 'Category', 'Date', 'Type', 'Amount'].map((h) => (
                            <th key={h} style={{
                                textAlign: h === 'Amount' ? 'right' : 'left',
                                padding: '10px 12px',
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
                    {transactions.slice(0, 10).map((txn) => (
                        <tr
                            key={txn._id}
                            style={{
                                borderBottom: '0.5px solid var(--border)',
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {/* Title */}
                            <td style={{ padding: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: txn.type === 'income'
                                            ? '#34d39922'
                                            : '#f8717122',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        flexShrink: 0
                                    }}>
                                        {txn.type === 'income' ? '💰' : '💸'}
                                    </div>
                                    <div>
                                        <div style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: '400'
                                        }}>
                                            {txn.title}
                                        </div>
                                        {txn.description && (
                                            <div style={{
                                                fontSize: '11px',
                                                color: 'var(--text-muted)',
                                                marginTop: '1px'
                                            }}>
                                                {txn.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>

                            {/* Category */}
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    background: `${CATEGORY_COLORS[txn.category] || '#9ca3af'}22`,
                                    color: CATEGORY_COLORS[txn.category] || '#9ca3af'
                                }}>
                                    {txn.category}
                                </span>
                            </td>

                            {/* Date */}
                            <td style={{
                                padding: '12px',
                                color: 'var(--text-muted)',
                                fontSize: '12px'
                            }}>
                                {new Date(txn.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </td>

                            {/* Type */}
                            <td style={{ padding: '12px' }}>
                                <span className={
                                    txn.type === 'income'
                                        ? 'badge badge-green'
                                        : 'badge badge-red'
                                }>
                                    {txn.type}
                                </span>
                            </td>

                            {/* Amount */}
                            <td style={{
                                padding: '12px',
                                textAlign: 'right',
                                fontWeight: '500',
                                color: txn.type === 'income'
                                    ? 'var(--accent-green)'
                                    : 'var(--accent-red)'
                            }}>
                                {txn.type === 'income' ? '+' : '-'}
                                ₹{txn.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {transactions.length > 10 && (
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    padding: '16px'
                }}>
                    Showing 10 of {transactions.length} transactions
                </p>
            )}
        </div>
    );
};

export default TransactionTable;