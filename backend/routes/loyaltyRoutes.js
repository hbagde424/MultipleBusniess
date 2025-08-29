const express = require('express');
const router = express.Router();
const { 
  getUserLoyaltyPoints, 
  addLoyaltyPoints, 
  redeemLoyaltyPoints,
  getLoyaltyPointHistory
} = require('../controllers/loyaltyController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user's loyalty points
router.get('/', authMiddleware, getUserLoyaltyPoints);
// Get loyalty point history
router.get('/history', authMiddleware, getLoyaltyPointHistory);
// Add loyalty points (admin only)
router.post('/add', authMiddleware, adminMiddleware, addLoyaltyPoints);
// Redeem loyalty points
router.post('/redeem', authMiddleware, redeemLoyaltyPoints);

module.exports = router;
