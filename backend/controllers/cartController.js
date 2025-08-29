const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('business', 'name')
      .populate('items.product', 'name price images stock');
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, businessId, quantity = 1, price } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        business: businessId,
        items: [{ product: productId, quantity, price }]
      });
    } else {
      // Check if cart belongs to same business
      if (cart.business.toString() !== businessId) {
        return res.status(400).json({ 
          message: 'You can only add items from one business at a time. Clear cart to add from different business.' 
        });
      }
      
      // Check if product already exists in cart
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
    }
    
    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.product.toString() === productId);
    
    if (!item) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
