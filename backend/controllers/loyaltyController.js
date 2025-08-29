const LoyaltyPoint = require('../models/LoyaltyPoint');

exports.getUserLoyaltyPoints = async (req, res) => {
  try {
    let loyaltyPoint = await LoyaltyPoint.findOne({ user: req.user.userId });
    
    if (!loyaltyPoint) {
      loyaltyPoint = new LoyaltyPoint({ user: req.user.userId });
      await loyaltyPoint.save();
    }
    
    res.json(loyaltyPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addLoyaltyPoints = async (req, res) => {
  try {
    const { userId, points, reason, orderId } = req.body;
    
    let loyaltyPoint = await LoyaltyPoint.findOne({ user: userId });
    
    if (!loyaltyPoint) {
      loyaltyPoint = new LoyaltyPoint({ user: userId });
    }
    
    loyaltyPoint.totalPoints += points;
    loyaltyPoint.transactions.push({
      type: 'earned',
      points,
      reason,
      order: orderId
    });
    
    // Update level based on points
    if (loyaltyPoint.totalPoints >= 10000) {
      loyaltyPoint.level = 'Platinum';
    } else if (loyaltyPoint.totalPoints >= 5000) {
      loyaltyPoint.level = 'Gold';
    } else if (loyaltyPoint.totalPoints >= 1000) {
      loyaltyPoint.level = 'Silver';
    }
    
    await loyaltyPoint.save();
    res.json(loyaltyPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redeemLoyaltyPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    
    const loyaltyPoint = await LoyaltyPoint.findOne({ user: req.user.userId });
    
    if (!loyaltyPoint || loyaltyPoint.totalPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    loyaltyPoint.totalPoints -= points;
    loyaltyPoint.transactions.push({
      type: 'redeemed',
      points,
      reason
    });
    
    await loyaltyPoint.save();
    res.json({ message: 'Points redeemed successfully', remainingPoints: loyaltyPoint.totalPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLoyaltyPointHistory = async (req, res) => {
  try {
    const loyaltyPoint = await LoyaltyPoint.findOne({ user: req.user.userId })
      .populate('transactions.order', 'orderNumber totalAmount');
    
    if (!loyaltyPoint) {
      return res.json({ transactions: [] });
    }
    
    res.json(loyaltyPoint.transactions.sort((a, b) => b.date - a.date));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
