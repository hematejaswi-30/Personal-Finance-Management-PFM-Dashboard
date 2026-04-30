const express = require('express');
const router = express.Router();
const { getReviews, draftReply, approveReply, seedReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReviews);
router.post('/seed', protect, seedReviews);
router.post('/:id/draft', protect, draftReply);
router.put('/:id/reply', protect, approveReply);

module.exports = router;
