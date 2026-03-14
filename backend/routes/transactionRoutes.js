 
const express = require('express');
const router = express.Router();

// placeholder route
router.get('/', (req, res) => {
    res.json({ message: 'Transaction routes working' });
});

module.exports = router;