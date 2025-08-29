const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  category: { 
    type: String, 
    required: true,
    enum: ['tiffin', 'cake', 'pickle', 'sweet', 'snack', 'beverage', 'main-course', 'dessert', 'other']
  },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  ingredients: [String],
  images: [String],
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'piece' }, // piece, kg, liter, packet, etc.
  minQuantity: { type: Number, default: 1 },
  maxQuantity: { type: Number, default: 100 },
  preparationTime: { type: Number, default: 30 }, // in minutes
  tags: [String],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  bulkPricing: [{
    minQuantity: Number,
    discountPercentage: Number
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  isSpecial: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
