const PromoCode = require('../models/PromoCode');

exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ isActive: true })
      .populate('applicableBusinesses', 'name')
      .populate('applicableProducts', 'name');
    res.json(promoCodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode({
      ...req.body,
      createdBy: req.user.userId
    });
    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validatePromoCode = async (req, res) => {
  try {
    const { code, businessId, totalAmount } = req.body;
    
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() },
      usedCount: { $lt: '$usageLimit' }
    });
    
    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }
    
    if (totalAmount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount should be ₹${promoCode.minOrderAmount}` 
      });
    }
    
    // Check if promo code is applicable to this business
    if (promoCode.applicableTo === 'business' && 
        !promoCode.applicableBusinesses.includes(businessId)) {
      return res.status(400).json({ message: 'Promo code not applicable to this business' });
    }
    
    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
      discountAmount = (totalAmount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, promoCode.maxDiscountAmount);
      }
    } else {
      discountAmount = promoCode.discountValue;
    }
    
    res.json({
      valid: true,
      discountAmount,
      finalAmount: totalAmount - discountAmount,
      message: `₹${discountAmount} discount applied!`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    
    promoCode.usedCount += 1;
    await promoCode.save();
    
    res.json({ message: 'Promo code applied successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePromoCode = async (req, res) => {
  try {
    const updated = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Promo code not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePromoCode = async (req, res) => {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Promo code not found' });
    res.json({ message: 'Promo code deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
