const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., 'Amazon', 'Shopify'
  authorName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative', 'Pending'], default: 'Pending' },
  topics: [{ type: String }], // e.g. ['shipping', 'quality']
  autoReplyDraft: { type: String }, // Drafted by AI
  replyStatus: { type: String, enum: ['Unreplied', 'Drafted', 'Replied'], default: 'Unreplied' },
  isRisky: { type: Boolean, default: false } // Triggered by severe negative keywords
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
