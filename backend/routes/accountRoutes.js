const express = require('express');
const router = express.Router();
const {
    getAccounts,
    addAccount,
    updateAccount,
    deleteAccount
} = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected - login required
router.get('/', protect, getAccounts);
router.post('/', protect, addAccount);
router.put('/:id', protect, updateAccount);
router.delete('/:id', protect, deleteAccount);

module.exports = router;

