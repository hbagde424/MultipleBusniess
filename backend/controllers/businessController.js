const Business = require('../models/Business');

exports.getAllBusinesses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isActive: true } : { isActive: true };
    const businesses = await Business.find(filter).populate('owner', 'name email');
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBusiness = async (req, res) => {
  try {
    const business = new Business({
      ...req.body,
      owner: req.user.userId
    });
    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    
    // Only business owner or admin can update
    if (business.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    
    // Only business owner or admin can delete
    if (business.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: 'Business deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user.userId });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
