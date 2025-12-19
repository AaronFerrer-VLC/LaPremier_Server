/**
 * Environment Variables Configuration
 * Validates and exports environment variables
 */

require('dotenv').config();

const requiredEnvVars = [];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Validate on import
validateEnv();

const ENV = {
  PORT: process.env.PORT || 5005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lapremier',
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  FOURSQUARE_API_KEY: process.env.FOURSQUARE_API_KEY,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-secret-change-in-production'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Validate critical production variables
if (ENV.IS_PRODUCTION) {
  const requiredProdVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = requiredProdVars.filter(varName => !ENV[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );
  }
}

module.exports = ENV;

