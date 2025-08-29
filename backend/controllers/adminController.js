const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Business = require('../models/Business');
const Review = require('../models/Review');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBusinessOwners = await User.countDocuments({ role: 'business_owner' });
    const totalBusinesses = await Business.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const businessesByCategory = await Business.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('business', 'name category')
      .populate('items.product', 'name price')
      .sort({ orderDate: -1 })
      .limit(10);
    
    res.json({
      stats: {
        totalUsers,
        totalBusinessOwners,
        totalBusinesses,
        totalProducts,
        totalOrders,
        totalReviews,
        pendingOrders,
        deliveredOrders,
        cancelledOrders
      },
      businessesByCategory,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
