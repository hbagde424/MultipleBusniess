const express = require('express');
const router = express.Router();
const { 
  getAllOrders, 
  createOrder, 
  getUserOrderHistory, 
  getBusinessOrders,
  reorderPrevious,
  cancelOrder
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Only admin can get all orders
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
// Any authenticated user can create an order
router.post('/', authMiddleware, createOrder);
// User can get their own order history
router.get('/my-orders', authMiddleware, getUserOrderHistory);
// Get orders for specific business
router.get('/business/:businessId', authMiddleware, getBusinessOrders);
// Reorder from previous order
router.post('/reorder/:orderId', authMiddleware, reorderPrevious);
// Cancel order
router.put('/cancel/:orderId', authMiddleware, cancelOrder);
// Only admin can update order
router.put('/:id', authMiddleware, adminMiddleware, require('../controllers/orderController').updateOrder);
// Only admin can delete order
router.delete('/:id', authMiddleware, adminMiddleware, require('../controllers/orderController').deleteOrder);

module.exports = router;
