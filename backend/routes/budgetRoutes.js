const express = require('express');
const router = express.Router();
const {
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetSummary
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected - login required
router.get('/', protect, getBudgets);
router.get('/summary', protect, getBudgetSummary);
router.post('/', protect, addBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;
