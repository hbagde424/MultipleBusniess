const express = require('express');
const router = express.Router();
const { 
  getAllPromoCodes, 
  createPromoCode, 
  validatePromoCode, 
  applyPromoCode,
  updatePromoCode,
  deletePromoCode
} = require('../controllers/promoController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all active promo codes (public)
router.get('/', getAllPromoCodes);
// Validate promo code
router.post('/validate', validatePromoCode);
// Apply promo code
router.post('/apply', authMiddleware, applyPromoCode);
// Create promo code (admin only)
router.post('/', authMiddleware, adminMiddleware, createPromoCode);
// Update promo code (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updatePromoCode);
// Delete promo code (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deletePromoCode);

module.exports = router;
