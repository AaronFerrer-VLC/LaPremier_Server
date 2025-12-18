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

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at port ${PORT}`);
  console.log(`📊 Environment: ${ENV.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${ENV.CORS_ORIGIN}`);
  console.log(`💾 Database: MongoDB (${ENV.MONGODB_URI})`);
});

module.exports = app;
