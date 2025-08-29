const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  validFrom: { type: Date, default: Date.now },
  validTill: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  applicableTo: {
    type: String,
    enum: ['all', 'business', 'category', 'product'],
    default: 'all'
  },
  applicableBusinesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
  applicableCategories: [String],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
