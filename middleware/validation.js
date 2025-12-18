/**
 * Validation Middleware
 * Uses express-validator for input validation and sanitization
 */

const { validationResult, body, param, query } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        errors: errors.array()
      }
    });
  }
  
  next();
};

/**
 * Validation rules for common fields
 */
const validators = {
  // Movie validators
  movieId: param('id')
    .notEmpty()
    .withMessage('Movie ID is required')
    .isMongoId()
    .withMessage('Invalid movie ID format'),

  movieBody: [
    body('title.original')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Original title must be between 1 and 200 characters'),
    body('title.spanish')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Spanish title must be between 1 and 200 characters'),
    body('poster')
      .optional()
      .isURL()
      .withMessage('Poster must be a valid URL'),
    body('duration')
      .optional()
      .isInt({ min: 1, max: 600 })
      .withMessage('Duration must be between 1 and 600 minutes'),
    body('gender')
      .optional()
      .isArray()
      .withMessage('Gender must be an array'),
    body('gender.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Each gender must be between 1 and 50 characters')
  ],

  // Cinema validators
  cinemaId: param('id')
    .notEmpty()
    .withMessage('Cinema ID is required')
    .isMongoId()
    .withMessage('Invalid cinema ID format'),

  cinemaBody: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Cinema name must be between 1 and 200 characters'),
    body('address.street')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street must be between 1 and 200 characters'),
    body('address.city')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City must be between 1 and 100 characters'),
    body('address.zipcode')
      .optional()
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Zipcode must be between 1 and 20 characters')
  ],

  // Review validators
  reviewId: param('id')
    .notEmpty()
    .withMessage('Review ID is required')
    .isMongoId()
    .withMessage('Invalid review ID format'),

  reviewBody: [
    body('comment')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment must be between 1 and 1000 characters'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('movieId')
      .notEmpty()
      .withMessage('Movie ID is required')
  ],

  // Login validators
  login: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],

  // Query parameters
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

module.exports = {
  validate,
  validators
};

