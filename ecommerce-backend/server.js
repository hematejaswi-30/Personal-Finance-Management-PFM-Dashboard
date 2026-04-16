const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Review = require('./models/Review');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reviewsync';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Webhook to ingest reviews
app.post('/api/reviews/webhook', async (req, res) => {
  try {
    const { platform, authorName, rating, content } = req.body;
    
    // Create un-analyzed review
    const newReview = await Review.create({
      platform,
      authorName,
      rating,
      content
    });

    // We will trigger AI sentiment / draft analysis in Phase 3 here
    
    res.status(201).json({ success: true, message: 'Review ingested', review: newReview });
  } catch (error) {
    console.error('Error ingesting review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ReviewSync API running on port ${PORT}`);
});
