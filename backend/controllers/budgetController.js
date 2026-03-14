 
const Budget = require('../models/Budget');

// GET ALL BUDGETS
// GET /api/budgets
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// ADD BUDGET
// POST /api/budgets
const addBudget = async (req, res) => {
    const { category, monthlyLimit, month } = req.body;
    try {
        if (!category || !monthlyLimit || !month) {
            return res.status(400).json({
                message: '❌ Please fill all required fields'
            });
        }
        // Check if budget already exists for this category and month
        const budgetExists = await Budget.findOne({
            userId: req.user._id,
            category,
            month
        });
        if (budgetExists) {
            return res.status(400).json({
                message: '❌ Budget already exists for this category and month'
            });
        }
        const budget = await Budget.create({
            userId: req.user._id,
            category,
            monthlyLimit,
            month
        });
        res.status(201).json({
            budget,
            message: '✅ Budget added successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// UPDATE BUDGET
// PUT /api/budgets/:id
const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({
                message: '❌ Budget not found'
            });
        }
        if (budget.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            budget: updatedBudget,
            message: '✅ Budget updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// DELETE BUDGET
// DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({
                message: '❌ Budget not found'
            });
        }
        if (budget.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: '❌ Not authorized'
            });
        }
        await Budget.findByIdAndDelete(req.params.id);
        res.json({
            message: '✅ Budget deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

// GET BUDGET VS ACTUAL SPENDING
// GET /api/budgets/summary
const getBudgetSummary = async (req, res) => {
    try {
        const { month } = req.query;
        const Transaction = require('../models/Transaction');

        // Get all budgets for the month
        const budgets = await Budget.find({
            userId: req.user._id,
            month: month
        });

        // Get actual spending for the month
        const transactions = await Transaction.find({
            userId: req.user._id,
            type: 'expense',
            date: {
                $gte: new Date(`${month}-01`),
                $lte: new Date(`${month}-31`)
            }
        });

        // Calculate actual spending per category
        const actualSpending = {};
        transactions.forEach(txn => {
            const cat = txn.category || 'Other';
            actualSpending[cat] = (actualSpending[cat] || 0) + txn.amount;
        });

        // Compare budget vs actual
        const summary = budgets.map(budget => ({
            category: budget.category,
            monthlyLimit: budget.monthlyLimit,
            actualSpending: actualSpending[budget.category] || 0,
            remaining: budget.monthlyLimit - (actualSpending[budget.category] || 0),
            percentage: Math.round(
                ((actualSpending[budget.category] || 0) / budget.monthlyLimit) * 100
            )
        }));

        res.json(summary);
    } catch (error) {
        res.status(500).json({
            message: '❌ Server error',
            error: error.message
        });
    }
};

module.exports = {
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetSummary
};
