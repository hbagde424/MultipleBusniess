const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  totalAmount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

// Calculate total amount before saving
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
