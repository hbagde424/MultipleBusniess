const mongoose = require('mongoose');

const loyaltyPointSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPoints: { type: Number, default: 0 },
  level: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  transactions: [{
    type: { type: String, enum: ['earned', 'redeemed'], required: true },
    points: { type: Number, required: true },
    reason: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoyaltyPoint', loyaltyPointSchema);
