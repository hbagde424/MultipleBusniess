const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

// Create Payment Order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user.userId;

    // Verify order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId,
        userId: userId,
        businessId: order.business.toString()
      },
      payment_capture: 1 // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with payment details
    order.paymentDetails = {
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: 'INR',
      status: 'pending'
    };
    await order.save();

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderDetails: {
          id: order._id,
          items: order.items,
          totalAmount: order.totalAmount
        }
      }
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }

    // Find and update order
    const order = await Order.findOne({
      _id: orderId,
      'paymentDetails.razorpayOrderId': razorpay_order_id
    }).populate('user', 'name email').populate('business', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment details
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.paymentDetails.status = 'completed';
    order.paymentMethod = 'online';
    order.status = 'confirmed';
    order.paymentStatus = 'paid';

    await order.save();

    // Send confirmation email
    try {
      const emailService = require('./emailService');
      await emailService.sendOrderConfirmation(
        order.user.email,
        order.user.name,
        order
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Send notification
    try {
      const { sendNotification } = require('./notificationController');
      await sendNotification(
        order.user._id,
        'Payment Successful! 💳',
        `Your payment of ₹${order.totalAmount} has been processed successfully. Order #${order.orderNumber} is confirmed.`,
        'payment',
        { type: 'Order', id: order._id }
      );
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        paymentId: razorpay_payment_id,
        status: 'completed',
        amount: order.totalAmount
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Handle Payment Failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;
    const userId = req.user.userId;

    // Find and update order
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status
    order.paymentDetails.status = 'failed';
    order.paymentDetails.failureReason = error.description || 'Payment failed';
    order.status = 'payment_failed';
    order.paymentStatus = 'failed';

    await order.save();

    // Send notification
    try {
      const { sendNotification } = require('./notificationController');
      await sendNotification(
        userId,
        'Payment Failed ❌',
        `Your payment for order #${order.orderNumber} failed. Please try again or choose a different payment method.`,
        'payment',
        { type: 'Order', id: order._id }
      );
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        orderId: order._id,
        status: 'failed',
        reason: error.description
      }
    });

  } catch (error) {
    console.error('Payment failure handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle payment failure',
      error: error.message
    });
  }
};

// Get Payment History
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    let query = { user: userId, paymentMethod: 'online' };
    if (status) {
      query['paymentDetails.status'] = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Order.find(query)
      .populate('business', 'name category')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('orderNumber totalAmount paymentDetails createdAt status items business');

    const totalPayments = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / parseInt(limit));

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: { user: userId, paymentMethod: 'online' } },
      {
        $group: {
          _id: '$paymentDetails.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalPayments,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        },
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: error.message
    });
  }
};

// Refund Payment
exports.initiateRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;
    const userId = req.user.userId;

    // Find order
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      paymentMethod: 'online',
      'paymentDetails.status': 'completed'
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not eligible for refund'
      });
    }

    const refundAmount = amount || order.totalAmount;

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(
      order.paymentDetails.razorpayPaymentId,
      {
        amount: Math.round(refundAmount * 100), // Amount in paise
        notes: {
          orderId: orderId,
          reason: reason || 'Customer request'
        }
      }
    );

    // Update order with refund details
    order.paymentDetails.refund = {
      refundId: refund.id,
      amount: refundAmount,
      status: refund.status,
      reason: reason,
      createdAt: new Date()
    };
    order.status = 'refunded';

    await order.save();

    // Send notification
    try {
      const { sendNotification } = require('./notificationController');
      await sendNotification(
        userId,
        'Refund Initiated 💰',
        `Your refund of ₹${refundAmount} for order #${order.orderNumber} has been initiated. It will be processed within 5-7 business days.`,
        'refund',
        { type: 'Order', id: order._id }
      );
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
    }

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status,
        orderId: order._id
      }
    });

  } catch (error) {
    console.error('Refund initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate refund',
      error: error.message
    });
  }
};

module.exports = {
  createPaymentOrder: exports.createPaymentOrder,
  verifyPayment: exports.verifyPayment,
  handlePaymentFailure: exports.handlePaymentFailure,
  getPaymentHistory: exports.getPaymentHistory,
  initiateRefund: exports.initiateRefund
};
