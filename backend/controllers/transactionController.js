const Transaction = require('../models/Transaction');

// GET ALL TRANSACTIONS
// GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .populate('accountId', 'name type')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// GET SINGLE TRANSACTION
// GET /api/transactions/:id
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('accountId', 'name type');
        if (!transaction) {
            return res.status(404).json({
                message: '❌ Transaction not found'
            });
        }
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// ADD TRANSACTION
// POST /api/transactions
const addTransaction = async (req, res) => {
    const { title, amount, type, category, accountId, description, date } = req.body;
    try {
        if (!title || !amount || !type || !accountId) {
            return res.status(400).json({
                message: '❌ Please fill all required fields'
            });
        }
        const transaction = await Transaction.create({
            userId: req.user._id,
            accountId,
            title,
            amount,
            type,
            category: category || 'Other',
            description,
            date: date || Date.now()
        });
        res.status(201).json({
            transaction,
            message: '✅ Transaction added successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// UPDATE TRANSACTION
// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                message: '❌ Transaction not found'
            });
        }
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            transaction: updatedTransaction,
            message: '✅ Transaction updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// DELETE TRANSACTION
// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                message: '❌ Transaction not found'
            });
        }
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({
            message: '✅ Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// GET SPENDING BY CATEGORY
// GET /api/transactions/by-category
const getByCategory = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user._id,
            type: 'expense'
        });
        const summary = {};
        transactions.forEach(txn => {
            const cat = txn.category || 'Other';
            summary[cat] = (summary[cat] || 0) + txn.amount;
        });
        const result = Object.entries(summary).map(([name, value]) => ({
            name,
            value: +value.toFixed(2)
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// GET MONTHLY SUMMARY
// GET /api/transactions/monthly-summary
const getMonthlySummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user._id
        });
        const monthly = {};
        transactions.forEach(txn => {
            const month = new Date(txn.date).toISOString().slice(0, 7);
            if (!monthly[month]) monthly[month] = { income: 0, expenses: 0 };
            if (txn.type === 'income') {
                monthly[month].income += txn.amount;
            } else {
                monthly[month].expenses += txn.amount;
            }
        });
        const result = Object.entries(monthly)
            .sort()
            .map(([month, data]) => ({
                month,
                income: +data.income.toFixed(2),
                expenses: +data.expenses.toFixed(2)
            }));
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

module.exports = {
    getTransactions,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getByCategory,
    getMonthlySummary
};
