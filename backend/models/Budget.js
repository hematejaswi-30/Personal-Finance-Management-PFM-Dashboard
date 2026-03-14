 const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
            'Investment',
            'Other'
        ],
        required: true
    },
    monthlyLimit: {
        type: Number,
        required: [true, 'Monthly limit is required']
    },
    month: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);
