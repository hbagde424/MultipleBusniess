const express = require('express');
const router = express.Router();
const { 
  getAllBusinesses, 
  getBusinessById, 
  createBusiness, 
  updateBusiness, 
  deleteBusiness,
  getMyBusinesses 
} = require('../controllers/businessController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all businesses (public)
router.get('/', getAllBusinesses);
// Get business by ID (public)
router.get('/:id', getBusinessById);
// Create business (auth required)
router.post('/', authMiddleware, createBusiness);
// Get my businesses (business owner)
router.get('/owner/my-businesses', authMiddleware, getMyBusinesses);
// Update business (owner or admin)
router.put('/:id', authMiddleware, updateBusiness);
// Delete business (owner or admin)
router.delete('/:id', authMiddleware, deleteBusiness);

module.exports = router;
