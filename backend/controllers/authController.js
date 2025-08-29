const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password, address, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ 
      success: false, 
      message: 'User already exists' 
    });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      address, 
      phone,
      role: role || 'customer'
    });
    await user.save();
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, name);
      console.log('✅ Welcome email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(',')
      });
    }
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );
    
    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError);
    }
    
    res.json({ 
      message: 'Password reset link sent to your email',
      success: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Social Login Success Handler
exports.socialLoginSuccess = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/success?token=${token}`);

  } catch (error) {
    console.error('Social login success error:', error);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/error?message=Login failed`);
  }
};

// Social Login Failure Handler
exports.socialLoginFailure = (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendURL}/auth/error?message=Authentication failed`);
};

// Get Current User (for auth verification)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      name, 
      phone, 
      address, 
      preferences 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
