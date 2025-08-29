const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.loginMethod = 'google';
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profileImage: profile.photos[0]?.value,
      loginMethod: 'google',
      isEmailVerified: true // Google emails are pre-verified
    });
    
    await user.save();
    
    // Send welcome email
    try {
      const emailService = require('../services/emailService');
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
    
    return done(null, user);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || 'your_facebook_app_id',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'your_facebook_app_secret',
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await User.findOne({ email });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = profile.id;
        user.loginMethod = 'facebook';
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    user = new User({
      facebookId: profile.id,
      name: profile.displayName,
      email: email,
      profileImage: profile.photos?.[0]?.value,
      loginMethod: 'facebook',
      isEmailVerified: !!email // Only verified if email provided
    });
    
    await user.save();
    
    // Send welcome email if email available
    if (email) {
      try {
        const emailService = require('../services/emailService');
        await emailService.sendWelcomeEmail(email, user.name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }
    
    return done(null, user);
    
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize/Deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
