const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Debug endpoint to test User model
router.get('/debug/user-schema', async (req, res) => {
  try {
    const schema = User.schema.obj;
    const roleEnum = User.schema.paths.role.enumValues;
    
    res.json({
      success: true,
      schema: {
        name: schema.name,
        email: schema.email,
        phone: schema.phone,
        role: schema.role
      },
      roleEnumValues: roleEnum,
      modelName: User.modelName,
      collectionName: User.collection.name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test user creation
router.post('/debug/test-user', async (req, res) => {
  try {
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      phone: '1234567890',
      role: 'business_owner'
    });
    
    // Validate without saving
    const validationError = testUser.validateSync();
    
    if (validationError) {
      return res.status(400).json({
        success: false,
        validationErrors: Object.values(validationError.errors).map(e => e.message)
      });
    }
    
    res.json({
      success: true,
      message: 'User validation passed',
      user: {
        name: testUser.name,
        email: testUser.email,
        phone: testUser.phone,
        role: testUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
