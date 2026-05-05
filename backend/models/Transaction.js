 const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Transaction title is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'Food & Dining',
            'Shopping',
            'Transport',
            'Entertainment',
            'Health',
            'Education',
            'Bills & Utilities',
            'Salary',
            'Investment',
            'Business Sales',
            'Refunds',
            'Other'
        ],
        default: 'Other'
    },
    isBusiness: {
        type: Boolean,
        default: false
    },
    isRefund: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

