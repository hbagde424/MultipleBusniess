const express = require('express');
const router = express.Router();
const { getAllTiffins, createTiffin } = require('../controllers/tiffinController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Any authenticated user can view tiffins
router.get('/', authMiddleware, getAllTiffins);
// Only admin can create tiffin
router.post('/', authMiddleware, adminMiddleware, createTiffin);
// Only admin can update tiffin
router.put('/:id', authMiddleware, adminMiddleware, require('../controllers/tiffinController').updateTiffin);
// Only admin can delete tiffin
router.delete('/:id', authMiddleware, adminMiddleware, require('../controllers/tiffinController').deleteTiffin);

module.exports = router;
