const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  subscriptionName: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
  }],
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  deliveryTime: {
    startTime: String,
    endTime: String
  },
  deliveryDays: [{ 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
  }],
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'online', 'wallet'], 
    default: 'COD' 
  },
  nextDeliveryDate: Date,
  lastOrderDate: Date,
  totalOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  pausedUntil: Date,
  isPaused: { type: Boolean, default: false },
  pauseReason: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate next delivery date
subscriptionSchema.methods.calculateNextDeliveryDate = function() {
  const now = new Date();
  let nextDate = new Date(this.nextDeliveryDate || this.startDate);
  
  switch (this.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }
  
  this.nextDeliveryDate = nextDate;
  return nextDate;
};

// Check if subscription is due for delivery
subscriptionSchema.methods.isDueForDelivery = function() {
  if (!this.isActive || this.isPaused) return false;
  
  const now = new Date();
  const nextDelivery = new Date(this.nextDeliveryDate);
  
  // Check if today is delivery day for weekly subscriptions
  if (this.frequency === 'weekly' && this.deliveryDays.length > 0) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[now.getDay()];
    return this.deliveryDays.includes(today) && now >= nextDelivery;
  }
  
  return now >= nextDelivery;
};

subscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isNew) {
    this.nextDeliveryDate = this.startDate;
  }
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
