const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/media/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow images, videos, and audio files
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') || 
        file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Real-time Delivery Tracking
const getDeliveryTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Mock tracking data (replace with real GPS tracking)
    const trackingInfo = {
      orderId: orderId,
      status: 'in_transit',
      estimatedTime: 25,
      currentLocation: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Near Central Park, Delhi'
      },
      deliveryPartner: {
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        rating: 4.8,
        vehicle: 'Motorcycle'
      },
      route: {
        distance: 3.2,
        duration: 12,
        steps: []
      },
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(Date.now() - 3600000),
          note: 'Order received and being prepared'
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 2400000),
          note: 'Kitchen started preparing your order'
        },
        {
          status: 'Picked Up',
          timestamp: new Date(Date.now() - 1200000),
          note: 'Order picked up by delivery partner'
        },
        {
          status: 'In Transit',
          timestamp: new Date(Date.now() - 600000),
          note: 'On the way to your location'
        }
      ]
    };

    res.json({
      success: true,
      ...trackingInfo
    });
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tracking information' 
    });
  }
};

// Upload Media (Images, Videos, Audio)
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/media/${req.file.filename}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload media' 
    });
  }
};

// Process Image for AR/Computer Vision
const processImageForAR = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    // Mock AR processing (in production, use computer vision APIs)
    const arData = {
      nutritionInfo: {
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12
      },
      ingredients: ['Rice', 'Chicken', 'Vegetables', 'Spices'],
      allergens: ['None detected'],
      confidence: 0.92
    };

    res.json({
      success: true,
      arData
    });
  } catch (error) {
    console.error('Error processing image for AR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process image' 
    });
  }
};

// Get Trending Content
const getTrendingContent = async (req, res) => {
  try {
    const trending = {
      hashtags: ['#foodie', '#delicious', '#healthy', '#spicy', '#vegetarian'],
      dishes: [
        { name: 'Butter Chicken', mentions: 234 },
        { name: 'Biryani', mentions: 198 },
        { name: 'Pizza', mentions: 156 }
      ],
      locations: [
        { name: 'Delhi', orders: 1234 },
        { name: 'Mumbai', orders: 987 },
        { name: 'Bangalore', orders: 765 }
      ]
    };

    res.json({
      success: true,
      trending
    });
  } catch (error) {
    console.error('Error fetching trending content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch trending content' 
    });
  }
};

// Get Social Comments
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Mock comments
    const comments = [
      {
        id: '1',
        user: {
          name: 'Alice Johnson',
          avatar: '/avatars/alice.jpg'
        },
        content: 'Looks absolutely delicious! 😍',
        timestamp: new Date(Date.now() - 1800000),
        likes: 5,
        isLiked: false
      },
      {
        id: '2',
        user: {
          name: 'Mike Wilson',
          avatar: '/avatars/mike.jpg'
        },
        content: 'I need to order this right now!',
        timestamp: new Date(Date.now() - 900000),
        likes: 3,
        isLiked: true
      }
    ];

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch comments' 
    });
  }
};

// Add Comment to Post
const addPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const newComment = {
      id: Date.now().toString(),
      user: {
        name: 'Current User', // Get from user model
        avatar: '/avatars/default.jpg'
      },
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    res.json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add comment' 
    });
  }
};

// Share Post
const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // In production, increment share count and track sharing
    
    res.json({
      success: true,
      message: 'Post shared successfully'
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to share post' 
    });
  }
};

// Get User Generated Content
const getUserGeneratedContent = async (req, res) => {
  try {
    const content = [
      {
        id: '1',
        type: 'review_photo',
        user: 'John Doe',
        content: 'Amazing presentation!',
        media: '/uploads/reviews/food1.jpg',
        product: 'Butter Chicken',
        rating: 5,
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'unboxing_video',
        user: 'Sarah Smith',
        content: 'Unboxing my tiffin order!',
        media: '/uploads/videos/unboxing1.mp4',
        product: 'Meal Combo',
        timestamp: new Date()
      }
    ];

    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user content' 
    });
  }
};

// Routes
router.get('/delivery/track/:orderId', authMiddleware, getDeliveryTracking);
router.post('/media/upload', authMiddleware, upload.single('media'), uploadMedia);
router.post('/ar/process-image', authMiddleware, processImageForAR);
router.get('/trending', getTrendingContent);
router.get('/social/posts/:postId/comments', authMiddleware, getPostComments);
router.post('/social/posts/:postId/comments', authMiddleware, addPostComment);
router.post('/social/posts/:postId/share', authMiddleware, sharePost);
router.get('/social/user-content', authMiddleware, getUserGeneratedContent);

module.exports = router;
