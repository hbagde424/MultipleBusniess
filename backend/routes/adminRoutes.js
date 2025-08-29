const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
