/**
 * Cinema Scraping Routes
 * Routes for AI-powered cinema website scraping
 */

const express = require('express');
const router = express.Router();
const cinemaScrapingController = require('../controllers/cinemaScrapingController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/scraping/status
 * Get scraping status and configuration
 */
router.get('/status', cinemaScrapingController.getStatus);

/**
 * POST /api/scraping/cinemas/all
 * Update movies for all Spanish cinemas
 */
router.post('/cinemas/all', cinemaScrapingController.updateAllCinemas);

/**
 * POST /api/scraping/cinemas/:cinemaId
 * Update movies for a specific cinema
 */
router.post('/cinemas/:cinemaId', cinemaScrapingController.updateCinema);

module.exports = router;

