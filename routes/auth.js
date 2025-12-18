/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validators, validate } = require('../middleware/validation');

// Login
router.post(
  '/login',
  authLimiter,
  validators.login,
  validate,
  authController.login
);

// Register (only in development, or protect with admin auth)
router.post(
  '/register',
  authLimiter,
  validators.login, // Reuse login validators
  validate,
  authController.register
);

// Get current user
router.get(
  '/me',
  authenticateToken,
  authController.getMe
);

module.exports = router;

