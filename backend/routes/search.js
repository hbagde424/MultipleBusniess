const express = require('express');
const router = express.Router();
const {
  searchProducts,
  searchBusinesses,
  getSearchSuggestions,
  getTrendingSearches
} = require('../controllers/searchController');

// Advanced Product Search
// GET /api/search/products?q=tiffin&category=food&minPrice=50&maxPrice=200&rating=4&sortBy=price&sortOrder=asc&page=1&limit=10
router.get('/products', searchProducts);

// Advanced Business Search  
// GET /api/search/businesses?q=tiffin&category=food&location=mumbai&rating=4&sortBy=rating&page=1
router.get('/businesses', searchBusinesses);

// Get Search Suggestions
// GET /api/search/suggestions?q=tif
router.get('/suggestions', getSearchSuggestions);

// Get Trending Searches and Popular Items
// GET /api/search/trending
router.get('/trending', getTrendingSearches);

module.exports = router;
