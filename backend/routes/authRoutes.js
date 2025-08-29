const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  changePassword,
  socialLoginSuccess,
  socialLoginFailure,
  getCurrentUser,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Traditional Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authMiddleware, changePassword);

// Social Login Routes - Google
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  socialLoginSuccess
);

// Social Login Routes - Facebook
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  socialLoginSuccess
);

// Social Login Handlers
router.get('/failure', socialLoginFailure);

// Profile Routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
