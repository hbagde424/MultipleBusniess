const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  isOpen: { type: Boolean, default: true },
  openTime: String, // "09:00"
  closeTime: String, // "21:00"
});

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'tiffin', 'bakery', 'pickles', 'sweets', 'restaurant', 'grocery', 'other']
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: String,
  phone: String,
  email: String,
  logo: String,
  images: [String],
  businessHours: [businessHoursSchema],
  deliveryRadius: { type: Number, default: 10 }, // in km
  minOrderAmount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Business', businessSchema);
