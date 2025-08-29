const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for social login
  address: String,
  phone: String,
  role: { type: String, enum: ['customer', 'business_owner', 'admin'], default: 'customer' },
  
  // Social Login Fields
  googleId: String,
  facebookId: String,
  profileImage: String,
  loginMethod: { 
    type: String, 
    enum: ['email', 'google', 'facebook'], 
    default: 'email' 
  },
  isEmailVerified: { type: Boolean, default: false },
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // User Preferences
  preferences: {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
