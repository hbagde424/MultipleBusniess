const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const promoRoutes = require('./routes/promoRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const cartRoutes = require('./routes/cartRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/search');
const paymentRoutes = require('./routes/payments');
const subscriptionRoutes = require('./routes/subscriptions');
const debugRoutes = require('./routes/debug');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multibusiness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Start Subscription Processing (Cron Job)
const { processDueSubscriptions } = require('./controllers/subscriptionController');
setInterval(processDueSubscriptions, 60 * 60 * 1000); // Check every hour

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Multi-Business Platform Server running on port ${PORT}`);
  console.log(`📱 Features: Cart, Wishlist, Loyalty Points, Promo Codes, Notifications`);
  console.log(`🔍 New: Advanced Search, Email Notifications, Smart Filters`);
  console.log(`💳 Payment: Razorpay Integration, Online Payments, Refunds`);
  console.log(`🔔 Subscriptions: Auto-recurring Orders, Pause/Resume`);
  console.log(`🔐 Social Login: Google & Facebook Authentication`);
});
