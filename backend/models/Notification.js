const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['order', 'promo', 'business', 'system', 'payment'], 
    required: true 
  },
  relatedTo: {
    type: { type: String, enum: ['Order', 'Business', 'Product', 'PromoCode'] },
    id: mongoose.Schema.Types.ObjectId
  },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

module.exports = mongoose.model('Notification', notificationSchema);
