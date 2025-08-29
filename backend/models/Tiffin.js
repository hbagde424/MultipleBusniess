const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
