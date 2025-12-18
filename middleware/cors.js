const ENV = require('../config/env');

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  // Allow specific origins in production, all in development
  if (ENV.CORS_ORIGIN === '*' || ENV.IS_DEVELOPMENT) {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    const allowedOrigins = ENV.CORS_ORIGIN.split(',');
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

module.exports = corsMiddleware;

