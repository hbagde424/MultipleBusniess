const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    discountApplied: { type: Number, default: 0 }
  }],
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  promoDiscount: { type: Number, default: 0 },
  promoCode: { type: String },
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'online', 'wallet'], 
    default: 'COD' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    currency: { type: String, default: 'INR' },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'], 
      default: 'pending' 
    },
    failureReason: String,
    refund: {
      refundId: String,
      amount: Number,
      status: String,
      reason: String,
      createdAt: Date
    },
    createdAt: { type: Date, default: Date.now }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryType: { 
    type: String, 
    enum: ['delivery', 'pickup'], 
    default: 'delivery' 
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  deliverySlot: {
    date: Date,
    startTime: String,
    endTime: String
  },
  phone: String,
  notes: String,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  cancellationReason: String,
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 },
  orderDate: { type: Date, default: Date.now },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
