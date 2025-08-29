const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentHistory,
  initiateRefund
} = require('../controllers/paymentController');

// Create Payment Order
// POST /api/payments/create-order
router.post('/create-order', authMiddleware, createPaymentOrder);

// Verify Payment
// POST /api/payments/verify
router.post('/verify', authMiddleware, verifyPayment);

// Handle Payment Failure
// POST /api/payments/failure
router.post('/failure', authMiddleware, handlePaymentFailure);

// Get Payment History
// GET /api/payments/history?page=1&limit=10&status=completed
router.get('/history', authMiddleware, getPaymentHistory);

// Initiate Refund
// POST /api/payments/refund
router.post('/refund', authMiddleware, initiateRefund);

module.exports = router;
