 const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['checking', 'savings', 'credit', 'investment', 'business'],
        required: true
    },
    purpose: {
        type: String,
        enum: ['personal', 'business'],
        default: 'personal'
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    institution: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', AccountSchema);

