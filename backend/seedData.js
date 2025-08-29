const mongoose = require('mongoose');
const User = require('./models/User');
const Business = require('./models/Business');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multibusiness');
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Business.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create dummy users first
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        _id: '67210f8a5c1234567890def1',
        name: 'Restaurant Owner 1',
        email: 'owner1@example.com',
        password: hashedPassword,
        phone: '+91-9876543210',
        role: 'business_owner'
      },
      {
        _id: '67210f8a5c1234567890def2',
        name: 'Bakery Owner',
        email: 'owner2@example.com',
        password: hashedPassword,
        phone: '+91-9876543211',
        role: 'business_owner'
      }
    ]);

    console.log('✅ Created dummy users:', users.length);

    // Create dummy businesses
    const businesses = await Business.insertMany([
      {
        _id: '67210f8a5c1234567890abc2',
        name: 'Tasty Tiffin Center',
        description: 'Delicious home-style meals delivered fresh',
        address: '123 Food Street, Mumbai',
        phone: '+91-9876543210',
        email: 'contact@tastytiffin.com',
        category: 'restaurant',
        owner: '67210f8a5c1234567890def1', // Reference to user
        openingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '10:00', close: '22:00' }
        },
        approved: true,
        rating: 4.5
      },
      {
        _id: '67210f8a5c1234567890abc3',
        name: 'Sweet Delights Bakery',
        description: 'Fresh cakes and pastries baked daily',
        address: '456 Baker Lane, Delhi',
        phone: '+91-9876543211',
        email: 'orders@sweetdelights.com',
        category: 'bakery',
        owner: '67210f8a5c1234567890def2', // Reference to user
        openingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '09:00', close: '21:00' }
        },
        approved: true,
        rating: 4.8
      }
    ]);

    // Create dummy products
    const products = await Product.insertMany([
      {
        _id: '67210f8a5c1234567890abc1',
        name: 'Deluxe Veg Tiffin',
        description: 'Complete meal with rice, dal, sabzi, roti, and pickle',
        price: 120,
        category: 'tiffin',
        business: '67210f8a5c1234567890abc2',
        ingredients: ['Rice', 'Dal', 'Mixed Vegetables', 'Roti', 'Pickle'],
        available: true,
        stock: 50,
        preparationTime: 45,
        tags: ['vegetarian', 'healthy', 'homestyle']
      },
      {
        _id: '67210f8a5c1234567890abc4',
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake with chocolate frosting',
        price: 450,
        category: 'cake',
        business: '67210f8a5c1234567890abc3',
        ingredients: ['Flour', 'Cocoa', 'Sugar', 'Eggs', 'Butter'],
        available: true,
        stock: 10,
        preparationTime: 60,
        tags: ['dessert', 'birthday', 'chocolate']
      },
      {
        _id: '67210f8a5c1234567890abc5',
        name: 'Paneer Butter Masala Tiffin',
        description: 'Rich paneer curry with rice, roti, and pickle',
        price: 150,
        category: 'tiffin',
        business: '67210f8a5c1234567890abc2',
        ingredients: ['Paneer', 'Tomato', 'Butter', 'Cream', 'Rice', 'Roti'],
        available: true,
        stock: 30,
        preparationTime: 50,
        tags: ['vegetarian', 'spicy', 'popular']
      }
    ]);

    console.log('✅ Created dummy businesses:', businesses.length);
    console.log('✅ Created dummy products:', products.length);
    console.log('🎉 Seed data created successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedData();
