const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createSubscription,
  getUserSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getSubscriptionDetails
} = require('../controllers/subscriptionController');

// Create Subscription
// POST /api/subscriptions
router.post('/', authMiddleware, createSubscription);

// Get User Subscriptions
// GET /api/subscriptions?status=active&page=1&limit=10
router.get('/', authMiddleware, getUserSubscriptions);

// Get Subscription Details
// GET /api/subscriptions/:subscriptionId
router.get('/:subscriptionId', authMiddleware, getSubscriptionDetails);

// Pause Subscription
// PUT /api/subscriptions/:subscriptionId/pause
router.put('/:subscriptionId/pause', authMiddleware, pauseSubscription);

// Resume Subscription
// PUT /api/subscriptions/:subscriptionId/resume
router.put('/:subscriptionId/resume', authMiddleware, resumeSubscription);

// Cancel Subscription
// DELETE /api/subscriptions/:subscriptionId
router.delete('/:subscriptionId', authMiddleware, cancelSubscription);

module.exports = router;
