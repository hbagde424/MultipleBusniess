const Subscription = require('../models/Subscription');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { sendNotification } = require('./notificationController');

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      business,
      subscriptionName,
      items,
      frequency,
      startDate,
      endDate,
      deliveryAddress,
      deliveryTime,
      deliveryDays,
      paymentMethod,
      notes
    } = req.body;

    const userId = req.user.userId;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }
      totalAmount += product.price * item.quantity;
      item.price = product.price;
    }

    // Create subscription
    const subscription = new Subscription({
      user: userId,
      business,
      subscriptionName,
      items,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      totalAmount,
      deliveryAddress,
      deliveryTime,
      deliveryDays: deliveryDays || [],
      paymentMethod,
      notes
    });

    await subscription.save();

    // Populate fields for response
    await subscription.populate('business', 'name category');
    await subscription.populate('items.product', 'name price');

    // Send notification
    await sendNotification(
      userId,
      'Subscription Created! 🔔',
      `Your ${frequency} subscription "${subscriptionName}" has been created successfully.`,
      'subscription',
      { type: 'Subscription', id: subscription._id }
    );

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
};

// Get User Subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { user: userId };
    if (status === 'active') {
      query.isActive = true;
      query.isPaused = false;
    } else if (status === 'paused') {
      query.isPaused = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await Subscription.find(query)
      .populate('business', 'name category location')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSubscriptions = await Subscription.countDocuments(query);
    const totalPages = Math.ceil(totalSubscriptions / parseInt(limit));

    // Get subscription statistics
    const stats = await Subscription.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalSubscriptions: { $sum: 1 },
          activeSubscriptions: {
            $sum: { $cond: [{ $and: ['$isActive', { $not: '$isPaused' }] }, 1, 0] }
          },
          pausedSubscriptions: {
            $sum: { $cond: ['$isPaused', 1, 0] }
          },
          totalMonthlyValue: {
            $sum: { $cond: [{ $eq: ['$frequency', 'monthly'] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSubscriptions,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        },
        statistics: stats[0] || {
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          pausedSubscriptions: 0,
          totalMonthlyValue: 0
        }
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscriptions',
      error: error.message
    });
  }
};

// Pause Subscription
exports.pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { pauseUntil, reason } = req.body;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isPaused = true;
    subscription.pausedUntil = pauseUntil ? new Date(pauseUntil) : null;
    subscription.pauseReason = reason;

    await subscription.save();

    // Send notification
    await sendNotification(
      userId,
      'Subscription Paused ⏸️',
      `Your subscription "${subscription.subscriptionName}" has been paused.`,
      'subscription',
      { type: 'Subscription', id: subscription._id }
    );

    res.json({
      success: true,
      message: 'Subscription paused successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Pause subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause subscription',
      error: error.message
    });
  }
};

// Resume Subscription
exports.resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isPaused = false;
    subscription.pausedUntil = null;
    subscription.pauseReason = null;

    // Calculate next delivery date
    subscription.calculateNextDeliveryDate();

    await subscription.save();

    // Send notification
    await sendNotification(
      userId,
      'Subscription Resumed ▶️',
      `Your subscription "${subscription.subscriptionName}" has been resumed.`,
      'subscription',
      { type: 'Subscription', id: subscription._id }
    );

    res.json({
      success: true,
      message: 'Subscription resumed successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume subscription',
      error: error.message
    });
  }
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.isActive = false;
    subscription.endDate = new Date();
    subscription.pauseReason = reason;

    await subscription.save();

    // Send notification
    await sendNotification(
      userId,
      'Subscription Cancelled ❌',
      `Your subscription "${subscription.subscriptionName}" has been cancelled.`,
      'subscription',
      { type: 'Subscription', id: subscription._id }
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
};

// Process Due Subscriptions (Cron Job Function)
exports.processDueSubscriptions = async () => {
  try {
    console.log('🔄 Processing due subscriptions...');

    const dueSubscriptions = await Subscription.find({
      isActive: true,
      isPaused: false,
      nextDeliveryDate: { $lte: new Date() }
    })
    .populate('user', 'name email')
    .populate('business', 'name')
    .populate('items.product', 'name price');

    for (const subscription of dueSubscriptions) {
      try {
        // Create automatic order
        const order = new Order({
          user: subscription.user._id,
          business: subscription.business._id,
          items: subscription.items,
          subtotal: subscription.totalAmount,
          totalAmount: subscription.totalAmount,
          deliveryAddress: subscription.deliveryAddress,
          paymentMethod: subscription.paymentMethod,
          notes: `Auto-generated from subscription: ${subscription.subscriptionName}`,
          status: 'confirmed'
        });

        await order.save();

        // Update subscription
        subscription.lastOrderDate = new Date();
        subscription.totalOrders += 1;
        subscription.calculateNextDeliveryDate();

        await subscription.save();

        // Send notification to user
        await sendNotification(
          subscription.user._id,
          'Subscription Order Created! 📦',
          `Your ${subscription.frequency} order for "${subscription.subscriptionName}" has been placed automatically.`,
          'subscription',
          { type: 'Order', id: order._id }
        );

        console.log(`✅ Order created for subscription ${subscription._id}`);

      } catch (orderError) {
        console.error(`❌ Failed to create order for subscription ${subscription._id}:`, orderError);
      }
    }

    console.log(`✅ Processed ${dueSubscriptions.length} due subscriptions`);

  } catch (error) {
    console.error('❌ Error processing due subscriptions:', error);
  }
};

// Get Subscription Details
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId
    })
    .populate('business', 'name category location contact')
    .populate('items.product', 'name price description image')
    .populate('user', 'name email phone');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Get recent orders from this subscription
    const recentOrders = await Order.find({
      user: userId,
      business: subscription.business._id,
      notes: { $regex: subscription.subscriptionName, $options: 'i' }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber status totalAmount createdAt');

    res.json({
      success: true,
      data: {
        subscription,
        recentOrders,
        nextDelivery: subscription.nextDeliveryDate,
        isDue: subscription.isDueForDelivery()
      }
    });

  } catch (error) {
    console.error('Get subscription details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription details',
      error: error.message
    });
  }
};

module.exports = {
  createSubscription: exports.createSubscription,
  getUserSubscriptions: exports.getUserSubscriptions,
  pauseSubscription: exports.pauseSubscription,
  resumeSubscription: exports.resumeSubscription,
  cancelSubscription: exports.cancelSubscription,
  processDueSubscriptions: exports.processDueSubscriptions,
  getSubscriptionDetails: exports.getSubscriptionDetails
};
