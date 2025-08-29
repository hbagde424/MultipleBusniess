const express = require('express');
const router = express.Router();
const { 
  getAllReviews, 
  getReviewsByProduct, 
  getReviewsByBusiness,
  createReview, 
  updateReview, 
  deleteReview,
  voteHelpful
} = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all reviews (public)
router.get('/', getAllReviews);
// Get reviews for specific product (public)
router.get('/product/:productId', getReviewsByProduct);
// Get reviews for specific business (public)
router.get('/business/:businessId', getReviewsByBusiness);
// Create review (auth required)
router.post('/', authMiddleware, createReview);
// Vote helpful (auth required)
router.post('/:id/helpful', authMiddleware, voteHelpful);
// Update review (owner or admin)
router.put('/:id', authMiddleware, updateReview);
// Delete review (owner or admin)
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
