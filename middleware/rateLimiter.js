/**
 * Rate Limiting Middleware
 * Protects API from abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');
const ENV = require('../config/env');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.IS_PRODUCTION ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health'
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// Rate limiter for external API proxy endpoints
// More permissive in development to handle React StrictMode double renders and parallel requests
const externalAPILimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: ENV.IS_PRODUCTION ? 60 : 500, // Very permissive in development (500 req/min), stricter in production (60 req/min)
  message: {
    success: false,
    error: {
      message: 'Too many external API requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  authLimiter,
  externalAPILimiter
};

