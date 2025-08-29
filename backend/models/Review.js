const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String], // Array of image URLs
  helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who found this helpful
  businessReply: {
    comment: String,
    repliedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
