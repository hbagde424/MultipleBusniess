const Product = require('../models/Product');
const Business = require('../models/Business');

// Advanced Product Search with filters
exports.searchProducts = async (req, res) => {
  try {
    const {
      q,                    // Search query
      category,             // Product category
      business,             // Business ID
      minPrice,             // Minimum price
      maxPrice,             // Maximum price
      rating,               // Minimum rating
      availability,         // Available products only
      sortBy,               // Sort by: price, rating, name, createdAt
      sortOrder,            // asc or desc
      page = 1,             // Page number
      limit = 10            // Items per page
    } = req.query;

    // Build search query
    let searchQuery = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    // Business filter
    if (business) {
      searchQuery.business = business;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating) {
      searchQuery.averageRating = { $gte: parseFloat(rating) };
    }

    // Availability filter
    if (availability === 'true') {
      searchQuery.availability = true;
      searchQuery.stock = { $gt: 0 };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'price':
          sortOptions.price = order;
          break;
        case 'rating':
          sortOptions.averageRating = order;
          break;
        case 'name':
          sortOptions.name = order;
          break;
        case 'popularity':
          sortOptions.reviewCount = order;
          break;
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const products = await Product.find(searchQuery)
      .populate('business', 'name category location')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    // Search suggestions based on popular searches
    const suggestions = await Product.aggregate([
      {
        $match: q ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        } : {}
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          products: { $push: { name: '$name', _id: '$_id' } }
        }
      },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          applied: {
            q, category, business, minPrice, maxPrice, rating, availability, sortBy, sortOrder
          },
          suggestions
        }
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// Search Businesses
exports.searchBusinesses = async (req, res) => {
  try {
    const {
      q,                    // Search query
      category,             // Business category
      location,             // Business location
      rating,               // Minimum rating
      isActive,             // Active businesses only
      sortBy,               // Sort by: rating, name, createdAt
      sortOrder,            // asc or desc
      page = 1,             // Page number
      limit = 10            // Items per page
    } = req.query;

    // Build search query
    let searchQuery = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
        { 'location.area': { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    // Location filter
    if (location) {
      searchQuery.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.area': { $regex: location, $options: 'i' } },
        { 'location.pincode': location }
      ];
    }

    // Rating filter
    if (rating) {
      searchQuery.averageRating = { $gte: parseFloat(rating) };
    }

    // Active businesses only
    if (isActive === 'true') {
      searchQuery.isActive = true;
      searchQuery.status = 'approved';
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'rating':
          sortOptions.averageRating = order;
          break;
        case 'name':
          sortOptions.name = order;
          break;
        case 'popularity':
          sortOptions.reviewCount = order;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.averageRating = -1; // Default sort by rating
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const businesses = await Business.find(searchQuery)
      .populate('owner', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalBusinesses = await Business.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBusinesses / parseInt(limit));

    // Get popular categories
    const popularCategories = await Business.aggregate([
      { $match: { isActive: true, status: 'approved' } },
      { 
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBusinesses,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          applied: { q, category, location, rating, isActive, sortBy, sortOrder },
          popularCategories
        }
      }
    });

  } catch (error) {
    console.error('Business search error:', error);
    res.status(500).json({
      success: false,
      message: 'Business search failed',
      error: error.message
    });
  }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: {
          products: [],
          businesses: [],
          categories: []
        }
      });
    }

    // Product suggestions
    const productSuggestions = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name category')
    .limit(5);

    // Business suggestions
    const businessSuggestions = await Business.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ],
      isActive: true,
      status: 'approved'
    })
    .select('name category')
    .limit(5);

    // Category suggestions
    const categorySuggestions = await Product.aggregate([
      {
        $match: {
          category: { $regex: q, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        products: productSuggestions,
        businesses: businessSuggestions,
        categories: categorySuggestions.map(cat => ({
          name: cat._id,
          count: cat.count
        }))
      }
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
};

// Popular searches and trending
exports.getTrendingSearches = async (req, res) => {
  try {
    // Most searched products
    const trendingProducts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          products: {
            $push: {
              name: '$name',
              price: '$price',
              rating: '$averageRating'
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Most popular businesses
    const popularBusinesses = await Business.find({
      isActive: true,
      status: 'approved'
    })
    .sort({ averageRating: -1, reviewCount: -1 })
    .limit(5)
    .select('name category averageRating reviewCount');

    // Trending categories
    const trendingCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { productCount: -1 } },
      { $limit: 8 }
    ]);

    res.json({
      success: true,
      data: {
        trendingProducts,
        popularBusinesses,
        trendingCategories: trendingCategories.map(cat => ({
          name: cat._id,
          productCount: cat.productCount,
          avgPrice: Math.round(cat.avgPrice),
          avgRating: parseFloat(cat.avgRating?.toFixed(1)) || 0
        }))
      }
    });

  } catch (error) {
    console.error('Trending searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending searches',
      error: error.message
    });
  }
};

module.exports = {
  searchProducts: exports.searchProducts,
  searchBusinesses: exports.searchBusinesses,
  getSearchSuggestions: exports.getSearchSuggestions,
  getTrendingSearches: exports.getTrendingSearches
};
