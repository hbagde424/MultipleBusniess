const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  vehicleType: { 
    type: String, 
    enum: ['bike', 'scooter', 'bicycle', 'car'], 
    required: true 
  },
  vehicleNumber: String,
  licenseNumber: String,
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now }
  },
  isAvailable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalDeliveries: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
