const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Only admin can get all users
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
// Any authenticated user can get their own user info
router.get('/:id', authMiddleware, getUserById);
// Update user profile (self or admin)
router.put('/:id', authMiddleware, require('../controllers/userController').updateUser);
// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, require('../controllers/userController').deleteUser);

module.exports = router;
