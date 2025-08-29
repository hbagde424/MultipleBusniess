const mongoose = require('mongoose');

// Import all models
const User = require('./models/User');
const Business = require('./models/Business');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Wishlist = require('./models/Wishlist');
const Cart = require('./models/Cart');
const PromoCode = require('./models/PromoCode');
const LoyaltyPoint = require('./models/LoyaltyPoint');
const Notification = require('./models/Notification');
const Subscription = require('./models/Subscription');

require('dotenv').config();

async function clearDummyData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multibusiness');
    console.log('✅ MongoDB connected successfully');

    // Clear all dummy data
    console.log('🗑️ Clearing all dummy data...');
    await User.deleteMany({});
    await Business.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await Cart.deleteMany({});
    await PromoCode.deleteMany({});
    await LoyaltyPoint.deleteMany({});
    await Notification.deleteMany({});
    await Subscription.deleteMany({});

    console.log('✅ All dummy data cleared successfully');
    console.log('💡 Database is now clean and ready for fresh data');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

// Run the cleanup
clearDummyData();
