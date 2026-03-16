const express = require('express');
const router = express.Router();
const { askAI, getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askAI);
router.get('/insights', protect, getInsights);

module.exports = router;
