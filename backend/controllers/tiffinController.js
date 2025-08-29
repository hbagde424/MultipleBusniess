const Tiffin = require('../models/Tiffin');

exports.getAllTiffins = async (req, res) => {
  try {
    const tiffins = await Tiffin.find();
    res.json(tiffins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createTiffin = async (req, res) => {
  try {
    const tiffin = new Tiffin(req.body);
    await tiffin.save();
    res.status(201).json(tiffin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTiffin = async (req, res) => {
  try {
    const updated = await Tiffin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Tiffin not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTiffin = async (req, res) => {
  try {
    const deleted = await Tiffin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tiffin not found' });
    res.json({ message: 'Tiffin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
