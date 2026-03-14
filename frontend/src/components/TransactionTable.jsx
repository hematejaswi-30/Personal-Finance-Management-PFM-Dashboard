 
const TransactionTable = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <p className="text-gray-400 text-center py-8">
                No transactions yet — add one!
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">
                            Title
                        </th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">
                            Category
                        </th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">
                            Date
                        </th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">
                            Type
                        </th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.slice(0, 10).map((txn) => (
                        <tr
                            key={txn._id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                        >
                            <td className="py-3 px-2 font-medium text-gray-800">
                                {txn.title}
                            </td>
                            <td className="py-3 px-2">
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                    {txn.category}
                                </span>
                            </td>
                            <td className="py-3 px-2 text-gray-500">
                                {new Date(txn.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </td>
                            <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    txn.type === 'income'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                }`}>
                                    {txn.type}
                                </span>
                            </td>
                            <td className={`py-3 px-2 text-right font-bold ${
                                txn.type === 'income'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                {txn.type === 'income' ? '+' : '-'}
                                ₹{txn.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {transactions.length > 10 && (
                <p className="text-center text-gray-400 text-sm mt-4">
                    Showing 10 of {transactions.length} transactions
                </p>
            )}
        </div>
    );
};

export default TransactionTable;
