/**
 * Script to create admin user
 * Run: node scripts/createAdminUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ENV = require('../config/env');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    // IMPORTANT: Always use ADMIN_PASSWORD from environment variables
    // Never hardcode passwords in production!
    if (!process.env.ADMIN_PASSWORD) {
      console.error('❌ ERROR: ADMIN_PASSWORD environment variable is required!');
      console.error('   Set ADMIN_PASSWORD in your .env file before running this script.');
      process.exit(1);
    }

    const admin = new User({
      username: 'admin',
      password: process.env.ADMIN_PASSWORD, // Must come from .env
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📝 Username: admin');
    console.log('🔑 Password: [Set via ADMIN_PASSWORD env variable]');
    console.log('⚠️  IMPORTANT: Keep ADMIN_PASSWORD secure and change it regularly!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();

