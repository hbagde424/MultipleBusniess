const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Business = require('../models/Business');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get orders with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      businessId
    } = req.query;

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'business_owner') {
      // Business owners can only see their business orders
      const business = await Business.findOne({ owner: req.user.id });
      if (!business) {
        return res.status(403).json({ message: 'Business not found' });
      }
      filter.business = business._id;
    } else if (req.user.role === 'customer') {
      // Customers can only see their own orders
      filter.customer = req.user.id;
    } else if (req.user.role === 'admin' && businessId) {
      // Admins can filter by business
      filter.business = businessId;
    }

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('business', 'name logo address')
      .populate('items.product', 'name price images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone avatar')
      .populate('business', 'name logo address contact')
      .populate('items.product', 'name price images description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      (req.user.role === 'customer' && order.customer._id.toString() === req.user.id) ||
      (req.user.role === 'business_owner' && await Business.findOne({ owner: req.user.id, _id: order.business._id }));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Customers only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      businessId,
      items,
      deliveryAddress,
      billingAddress,
      paymentMethod,
      specialInstructions,
      couponCode
    } = req.body;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can place orders' });
    }

    // Validate business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Validate and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      if (!product.isAvailable) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.business.toString() !== businessId) {
        return res.status(400).json({ message: `Product ${product.name} does not belong to this business` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
        specifications: item.specifications || ''
      });
    }

    // Calculate charges
    const taxRate = business.taxRate || 0.05; // 5% default tax
    const tax = subtotal * taxRate;
    const deliveryCharge = business.deliveryCharge || 30;
    
    // Apply coupon discount if provided
    let discount = 0;
    if (couponCode) {
      // TODO: Implement coupon validation and discount calculation
      // For now, just a placeholder
    }

    const total = subtotal + tax + deliveryCharge - discount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = new Order({
      orderNumber,
      customer: req.user.id,
      business: businessId,
      items: orderItems,
      subtotal,
      tax,
      deliveryCharge,
      discount,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      deliveryAddress,
      billingAddress: billingAddress || deliveryAddress,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + (business.averageDeliveryTime || 30) * 60000), // Default 30 minutes
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed successfully'
      }]
    });

    await order.save();

    // Populate order before sending response
    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'name logo address' },
      { path: 'items.product', select: 'name price images' }
    ]);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Business owners and admins)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'business_owner') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business || !order.business.equals(business._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update order status
    order.status = status;
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    // Add to timeline
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    await order.save();

    // Populate and return updated order
    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'name logo address' },
      { path: 'items.product', select: 'name price images' }
    ]);

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/payment-status
// @desc    Update payment status
// @access  Private (Business owners and admins)
router.put('/:id/payment-status', auth, async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'business_owner') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business || !order.business.equals(business._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();

    res.json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/analytics/overview
// @desc    Get order analytics overview
// @access  Private (Business owners and admins)
router.get('/analytics/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate, businessId } = req.query;
    
    let matchFilter = {};
    
    // Role-based filtering
    if (req.user.role === 'business_owner') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business) {
        return res.status(403).json({ message: 'Business not found' });
      }
      matchFilter.business = business._id;
    } else if (req.user.role === 'admin' && businessId) {
      matchFilter.business = mongoose.Types.ObjectId(businessId);
    }

    // Date filtering
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
      if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    const result = analytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/analytics/daily
// @desc    Get daily order analytics
// @access  Private (Business owners and admins)
router.get('/analytics/daily', auth, async (req, res) => {
  try {
    const { days = 30, businessId } = req.query;
    
    let matchFilter = {};
    
    if (req.user.role === 'business_owner') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business) {
        return res.status(403).json({ message: 'Business not found' });
      }
      matchFilter.business = business._id;
    } else if (req.user.role === 'admin' && businessId) {
      matchFilter.business = mongoose.Types.ObjectId(businessId);
    }

    // Filter by date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    matchFilter.createdAt = { $gte: startDate };

    const dailyAnalytics = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          orders: 1,
          revenue: 1,
          averageOrderValue: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json(dailyAnalytics);
  } catch (error) {
    console.error('Error fetching daily analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
