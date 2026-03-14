 const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes - no token needed
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route - token required
router.get('/profile', protect, getUserProfile);

module.exports = router;

