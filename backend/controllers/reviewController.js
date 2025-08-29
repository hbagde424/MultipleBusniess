const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name')
      .populate('business', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByBusiness = async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId })
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product, business, rating, comment } = req.body;
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      user: req.user.userId, 
      product: product 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    const review = new Review({
      user: req.user.userId,
      product,
      business,
      rating,
      comment
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Only review owner can update
    if (review.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Only review owner or admin can delete
    if (review.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voteHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Initialize helpfulVotes array if it doesn't exist
    if (!review.helpfulVotes) {
      review.helpfulVotes = [];
    }
    
    const userId = req.user.userId;
    const hasVoted = review.helpfulVotes.includes(userId);
    
    if (hasVoted) {
      // Remove vote if already voted
      review.helpfulVotes = review.helpfulVotes.filter(id => id.toString() !== userId);
    } else {
      // Add vote
      review.helpfulVotes.push(userId);
    }
    
    await review.save();
    
    res.json({ 
      message: hasVoted ? 'Vote removed' : 'Vote added',
      helpfulCount: review.helpfulVotes.length,
      hasVoted: !hasVoted
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
