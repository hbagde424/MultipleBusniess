const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByBusiness 
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all products (public)
router.get('/', getAllProducts);
// Get product by ID (public)
router.get('/:id', getProductById);
// Get products by business (public)
router.get('/business/:businessId', getProductsByBusiness);
// Create product (business owner or admin)
router.post('/', authMiddleware, createProduct);
// Update product (business owner or admin)
router.put('/:id', authMiddleware, updateProduct);
// Delete product (business owner or admin)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
