const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  createNotification,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user notifications
router.get('/', authMiddleware, getUserNotifications);
// Get unread count
router.get('/unread-count', authMiddleware, getUnreadCount);
// Mark notification as read
router.put('/:notificationId/read', authMiddleware, markAsRead);
// Mark all notifications as read
router.put('/mark-all-read', authMiddleware, markAllAsRead);
// Create notification (admin only)
router.post('/', authMiddleware, adminMiddleware, createNotification);
// Delete notification
router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router;
