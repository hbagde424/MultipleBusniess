const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Business = require('../models/Business');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      business,
      search,
      minPrice,
      maxPrice,
      isAvailable,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (category) filter.category = category;
    if (business) filter.business = business;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate('business', 'name logo address')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('business', 'name logo address contact operatingHours')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Business owners only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      tags,
      isAvailable,
      isFeatured,
      inventory,
      nutritionInfo,
      ingredients,
      allergens,
      variants
    } = req.body;

    // Verify user owns a business
    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(403).json({ message: 'Access denied. Business ownership required.' });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    const productData = {
      name,
      description,
      category,
      price: parseFloat(price),
      business: business._id,
      images,
      isAvailable: isAvailable === 'true',
      isFeatured: isFeatured === 'true'
    };

    // Add optional fields if provided
    if (originalPrice) productData.originalPrice = parseFloat(originalPrice);
    if (tags) productData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    if (inventory) productData.inventory = JSON.parse(inventory);
    if (nutritionInfo) productData.nutritionInfo = JSON.parse(nutritionInfo);
    if (ingredients) productData.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(ing => ing.trim());
    if (allergens) productData.allergens = Array.isArray(allergens) ? allergens : allergens.split(',').map(all => all.trim());
    if (variants) productData.variants = JSON.parse(variants);

    const product = new Product(productData);
    await product.save();

    // Populate business info before sending response
    await product.populate('business', 'name logo address');

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Business owners only)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify user owns the business that owns this product
    const business = await Business.findOne({ owner: req.user.id });
    if (!business || !product.business.equals(business._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Process updates
    const updates = { ...req.body };
    
    // Handle numeric fields
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    
    // Handle boolean fields
    if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable === 'true';
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true';
    
    // Handle array fields
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }
    if (updates.ingredients && typeof updates.ingredients === 'string') {
      updates.ingredients = updates.ingredients.split(',').map(ing => ing.trim());
    }
    if (updates.allergens && typeof updates.allergens === 'string') {
      updates.allergens = updates.allergens.split(',').map(all => all.trim());
    }
    
    // Handle JSON fields
    if (updates.inventory && typeof updates.inventory === 'string') {
      updates.inventory = JSON.parse(updates.inventory);
    }
    if (updates.nutritionInfo && typeof updates.nutritionInfo === 'string') {
      updates.nutritionInfo = JSON.parse(updates.nutritionInfo);
    }
    if (updates.variants && typeof updates.variants === 'string') {
      updates.variants = JSON.parse(updates.variants);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      
      // If replaceImages is true, replace all images, otherwise append
      if (updates.replaceImages === 'true') {
        updates.images = newImages;
      } else {
        updates.images = [...(product.images || []), ...newImages];
      }
    }

    // Remove update control fields
    delete updates.replaceImages;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('business', 'name logo address');

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Business owners only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify user owns the business that owns this product
    const business = await Business.findOne({ owner: req.user.id });
    if (!business || !product.business.equals(business._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products/bulk-update
// @desc    Bulk update products
// @access  Private (Business owners only)
router.post('/bulk-update', auth, async (req, res) => {
  try {
    const { productIds, updates } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }

    // Verify user owns a business
    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(403).json({ message: 'Access denied. Business ownership required.' });
    }

    // Verify all products belong to the user's business
    const products = await Product.find({ 
      _id: { $in: productIds },
      business: business._id 
    });

    if (products.length !== productIds.length) {
      return res.status(403).json({ message: 'Some products do not belong to your business' });
    }

    // Perform bulk update
    const result = await Product.updateMany(
      { 
        _id: { $in: productIds },
        business: business._id 
      },
      updates,
      { runValidators: true }
    );

    res.json({
      message: 'Products updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products/:id/review
// @desc    Add a product review
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.id,
      rating: parseInt(rating),
      comment: comment || '',
      date: new Date()
    };

    product.reviews.push(review);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    await product.populate('reviews.user', 'name avatar');

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/business/:businessId
// @desc    Get products by business ID
// @access  Public
router.get('/business/:businessId', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isAvailable } = req.query;
    
    let filter = { business: req.params.businessId };
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate('business', 'name logo')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching business products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(cat => cat)); // Filter out null/empty categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
