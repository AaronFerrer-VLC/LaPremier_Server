const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const ENV = require('./config/env');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter, externalAPILimiter } = require('./middleware/rateLimiter');

// Importar rutas
const authRoutes = require('./routes/auth');
const cinemasRoutes = require('./routes/cinemas');
const moviesRoutes = require('./routes/movies');
const reviewsRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');
const externalAPIRoutes = require('./routes/externalAPI');
const cinemaScrapingRoutes = require('./routes/cinemaScraping');

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Security middleware (must be first)
app.use(helmet({
  contentSecurityPolicy: ENV.IS_PRODUCTION ? undefined : false, // Disable in dev for easier debugging
  crossOriginEmbedderPolicy: false // Allow embedding (for maps, etc.)
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (ENV.IS_DEVELOPMENT) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
// Auth routes use strict limiter
app.use('/api/auth', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    database: 'MongoDB'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/cinemas', cinemasRoutes);
app.use('/movies', moviesRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/api/external', externalAPILimiter, externalAPIRoutes);
app.use('/api/scraping', cinemaScrapingRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Setup cron job for weekly cinema updates (only in production or if enabled)
// Note: Render free tier supports cron jobs natively
if (ENV.IS_PRODUCTION && process.env.ENABLE_CRON === 'true') {
  try {
    const scheduleCinemaUpdates = require('./scripts/setupCronJob');
    scheduleCinemaUpdates();
    console.log('⏰ Cron job enabled: Cinema updates scheduled for Fridays at 9:00 AM');
  } catch (error) {
    console.warn('⚠️  Cron job setup failed (may not be supported on this platform):', error.message);
    console.log('💡 Tip: Render free tier supports cron jobs, or use external service like cron-job.org');
  }
}

// Start server
const PORT = ENV.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at port ${PORT}`);
  console.log(`📊 Environment: ${ENV.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${ENV.CORS_ORIGIN}`);
  console.log(`💾 Database: MongoDB (${ENV.MONGODB_URI})`);
  if (ENV.GEMINI_API_KEY) {
    console.log('🤖 Gemini API: Configured');
  } else {
    console.log('⚠️  Gemini API: Not configured');
  }
});

module.exports = app;
