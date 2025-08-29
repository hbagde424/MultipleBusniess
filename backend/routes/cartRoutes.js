const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

// Get user's cart
router.get('/', authMiddleware, getCart);
// Add product to cart
router.post('/add', authMiddleware, addToCart);
// Update cart item quantity
router.put('/item/:productId', authMiddleware, updateCartItem);
// Remove product from cart
router.delete('/item/:productId', authMiddleware, removeFromCart);
// Clear entire cart
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;
