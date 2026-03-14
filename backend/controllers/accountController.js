 const Account = require('../models/Account');

// GET ALL ACCOUNTS
// GET /api/accounts
const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// ADD ACCOUNT
// POST /api/accounts
const addAccount = async (req, res) => {
    const { name, type, balance, currency, institution } = req.body;
    try {
        if (!name || !type) {
            return res.status(400).json({
                message: '❌ Please fill all required fields'
            });
        }
        const account = await Account.create({
            userId: req.user._id,
            name,
            type,
            balance: balance || 0,
            currency: currency || 'INR',
            institution
        });
        res.status(201).json({
            account,
            message: '✅ Account added successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// UPDATE ACCOUNT
// PUT /api/accounts/:id
const updateAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({
                message: '❌ Account not found'
            });
        }
        if (account.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            account: updatedAccount,
            message: '✅ Account updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// DELETE ACCOUNT
// DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({
                message: '❌ Account not found'
            });
        }
        if (account.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        await Account.findByIdAndDelete(req.params.id);
        res.json({
            message: '✅ Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

module.exports = { getAccounts, addAccount, updateAccount, deleteAccount };

