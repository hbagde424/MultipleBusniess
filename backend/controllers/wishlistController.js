const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId })
      .populate('products');
    
    if (!wishlist) {
      return res.json({ products: [] });
    }
    
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      } else {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
    }
    
    await wishlist.save();
    res.json({ message: 'Product added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.userId });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user.userId },
      { products: [] }
    );
    
    res.json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
