const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getByCategory,
    getMonthlySummary
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected - login required
router.get('/', protect, getTransactions);
router.get('/by-category', protect, getByCategory);
router.get('/monthly-summary', protect, getMonthlySummary);
router.get('/:id', protect, getTransaction);
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;
