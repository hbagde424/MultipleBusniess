const Order = require('../models/Order');
const Cart = require('../models/Cart');
const LoyaltyPoint = require('../models/LoyaltyPoint');
const { sendNotification } = require('./notificationController');
const emailService = require('../services/emailService');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('business', 'name category')
      .populate('items.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { 
      items, 
      business, 
      deliveryAddress, 
      deliverySlot,
      phone, 
      notes, 
      paymentMethod = 'COD',
      promoCode,
      loyaltyPointsUsed = 0
    } = req.body;
    
    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    
    // Apply promo discount if any
    let promoDiscount = 0;
    if (req.body.promoDiscount) {
      promoDiscount = req.body.promoDiscount;
    }
    
    // Calculate loyalty point discount (1 point = ₹1)
    let loyaltyDiscount = loyaltyPointsUsed;
    
    // Calculate delivery charge based on business
    const deliveryCharge = req.body.deliveryCharge || 0;
    
    const totalAmount = subtotal + deliveryCharge - promoDiscount - loyaltyDiscount;
    
    const order = new Order({
      user: req.user.userId,
      business,
      items,
      subtotal,
      deliveryCharge,
      promoDiscount,
      promoCode,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      deliverySlot,
      phone,
      notes,
      loyaltyPointsUsed,
      statusHistory: [{
        status: 'pending',
        note: 'Order placed successfully'
      }]
    });
    
    await order.save();
    
    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user.userId });
    
    // Award loyalty points (1% of order value)
    const pointsEarned = Math.floor(totalAmount * 0.01);
    if (pointsEarned > 0) {
      const loyaltyController = require('./loyaltyController');
      await loyaltyController.addLoyaltyPoints({
        body: {
          userId: req.user.userId,
          points: pointsEarned,
          reason: 'Order purchase',
          orderId: order._id
        }
      }, { json: () => {} });
    }
    
    // Send notification to user
    await sendNotification(
      req.user.userId,
      'Order Placed Successfully!',
      `Your order #${order.orderNumber} has been placed and will be processed soon.`,
      'order',
      { type: 'Order', id: order._id }
    );
    
    // Send order confirmation email
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId);
      if (user && user.email) {
        await emailService.sendOrderConfirmation(user.email, user.name, order);
        console.log('✅ Order confirmation email sent to:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
    }
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Only admin or business owner can update
    if (req.user.role !== 'admin' && req.user.role !== 'business_owner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update status
    if (status) {
      order.status = status;
      order.statusHistory.push({
        status,
        note: note || `Order status updated to ${status}`
      });
      
      // Set delivery time for delivered status
      if (status === 'delivered') {
        order.actualDeliveryTime = new Date();
      }
      
      // Send notification to user about status change
      const statusMessages = {
        confirmed: 'Your order has been confirmed!',
        preparing: 'Your order is being prepared.',
        ready: 'Your order is ready for pickup/delivery.',
        out_for_delivery: 'Your order is out for delivery.',
        delivered: 'Your order has been delivered successfully!',
        cancelled: 'Your order has been cancelled.'
      };
      
      if (statusMessages[status]) {
        await sendNotification(
          order.user,
          'Order Status Update',
          `Order #${order.orderNumber}: ${statusMessages[status]}`,
          'order',
          { type: 'Order', id: order._id }
        );
      }
    }
    
    // Update other fields
    Object.assign(order, req.body);
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    // Only admin can delete orders
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('business', 'name category')
      .populate('items.product', 'name price images')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBusinessOrders = async (req, res) => {
  try {
    const orders = await Order.find({ business: req.params.businessId })
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reorderPrevious = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const previousOrder = await Order.findById(orderId)
      .populate('items.product');
    
    if (!previousOrder || previousOrder.user.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if all products are still available
    const unavailableProducts = [];
    for (let item of previousOrder.items) {
      if (!item.product.available || item.product.stock < item.quantity) {
        unavailableProducts.push(item.product.name);
      }
    }
    
    if (unavailableProducts.length > 0) {
      return res.status(400).json({ 
        message: 'Some products are no longer available',
        unavailableProducts 
      });
    }
    
    // Create new order with same items
    const newOrder = new Order({
      user: req.user.userId,
      business: previousOrder.business,
      items: previousOrder.items,
      subtotal: previousOrder.subtotal,
      deliveryCharge: previousOrder.deliveryCharge,
      totalAmount: previousOrder.totalAmount,
      deliveryAddress: previousOrder.deliveryAddress,
      phone: previousOrder.phone,
      statusHistory: [{
        status: 'pending',
        note: 'Reorder from previous order'
      }]
    });
    
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only user who placed order can cancel, or admin
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Can only cancel if order is not delivered or out for delivery
    if (['delivered', 'out_for_delivery'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }
    
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      note: `Order cancelled: ${reason}`
    });
    
    await order.save();
    
    // Send notification
    await sendNotification(
      order.user,
      'Order Cancelled',
      `Your order #${order.orderNumber} has been cancelled.`,
      'order',
      { type: 'Order', id: order._id }
    );
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
