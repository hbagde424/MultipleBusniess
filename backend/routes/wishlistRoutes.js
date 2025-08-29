const express = require('express');
const router = express.Router();
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/auth');

// Get user's wishlist
router.get('/', authMiddleware, getWishlist);
// Add product to wishlist
router.post('/add', authMiddleware, addToWishlist);
// Remove product from wishlist
router.delete('/remove/:productId', authMiddleware, removeFromWishlist);
// Clear entire wishlist
router.delete('/clear', authMiddleware, clearWishlist);

module.exports = router;
