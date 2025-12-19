/**
 * Cinema Scraping Controller
 * Handles AI-powered cinema website scraping to update movie listings
 */

const Cinema = require('../models/Cinema');
const scrapingService = require('../services/scrapingService');
const aiService = require('../services/aiService');
const movieMatchingService = require('../services/movieMatchingService');
const rateLimiter = require('../services/geminiRateLimiter');
const logger = require('../utils/logger');

/**
 * Update movies for a single cinema
 * @param {string} cinemaId - Cinema ID
 * @returns {Promise<Object>} Update result
 */
const updateCinemaMovies = async (cinemaId) => {
  try {
    const cinema = await Cinema.findById(cinemaId);
    
    if (!cinema) {
      throw new Error(`Cinema not found: ${cinemaId}`);
    }

    if (!cinema.url) {
      logger.warn(`Cinema ${cinema.name} has no URL`, {}, 'CinemaScrapingController');
      return {
        success: false,
        cinemaId,
        cinemaName: cinema.name,
        error: 'No URL configured'
      };
    }

    logger.info(`Starting movie update for cinema: ${cinema.name}`, { cinemaId, url: cinema.url }, 'CinemaScrapingController');

    // Step 1: Scrape cinema website
    const htmlContent = await scrapingService.scrapeCinemaWebsite(cinema.url, {
      usePuppeteer: true,
      timeout: 30000
    });

    // Step 2: Extract relevant section
    const relevantHTML = scrapingService.extractRelevantSection(htmlContent);

    // Step 3: Use AI to extract movie titles
    const movieTitles = await aiService.extractMoviesFromHTML(relevantHTML, cinema.name);

    if (!movieTitles || movieTitles.length === 0) {
      logger.warn(`No movies found for cinema ${cinema.name}`, {}, 'CinemaScrapingController');
      return {
        success: true,
        cinemaId,
        cinemaName: cinema.name,
        moviesFound: 0,
        moviesMatched: 0,
        message: 'No movies found on website'
      };
    }

    // Step 4: Match titles with TMDB IDs
    const tmdbIds = await movieMatchingService.matchMoviesWithTMDB(movieTitles);

    // Step 5: Update cinema with new movie IDs
    cinema.movieId = tmdbIds;
    await cinema.save();

    logger.info(`Updated cinema ${cinema.name} with ${tmdbIds.length} movies`, {
      cinemaId,
      moviesFound: movieTitles.length,
      moviesMatched: tmdbIds.length
    }, 'CinemaScrapingController');

    return {
      success: true,
      cinemaId,
      cinemaName: cinema.name,
      moviesFound: movieTitles.length,
      moviesMatched: tmdbIds.length,
      tmdbIds
    };
  } catch (error) {
    logger.error(`Failed to update cinema ${cinemaId}`, error, 'CinemaScrapingController');
    return {
      success: false,
      cinemaId,
      error: error.message
    };
  }
};

/**
 * Update movies for all cinemas in Spain (internal function)
 * @returns {Promise<Object>} Update results
 */
const updateAllCinemasInternal = async () => {
  logger.info('Starting update for all Spanish cinemas', {}, 'CinemaScrapingController');

  // Check rate limits before starting
  const usageStats = rateLimiter.getUsageStats();
  logger.info('Current Gemini API usage', usageStats, 'CinemaScrapingController');

  // Get all cinemas in Spain
  const cinemas = await Cinema.find({
    'address.country': { $regex: /españa|spain|es/i },
    isDeleted: false,
    url: { $exists: true, $ne: '' }
  });

  if (cinemas.length === 0) {
    return {
      success: true,
      message: 'No cinemas found to update',
      results: []
    };
  }

    // Calculate how many cinemas we can process SAFELY (with safety margin)
    const tokensPerCinema = 5000; // Conservative estimate per cinema (2 requests: extraction + matching)
    const requestsPerCinema = 2; // Average: 1 for extraction + 1 for matching
    
    // Use SAFE limits (90% of hard limits) to prevent any costs
    const safeRequestsRemaining = usageStats.dailyRequests.remaining || 0;
    const safeTokensRemaining = usageStats.dailyTokens.remaining || 0;
    
    const maxCinemasByRequests = Math.floor(safeRequestsRemaining / requestsPerCinema);
    const maxCinemasByTokens = Math.floor(safeTokensRemaining / tokensPerCinema);
    const maxCinemasByRPM = Math.min(usageStats.rpm.remaining, 15); // Max 15 per minute
    
    // Limit to what we can process SAFELY (use the most restrictive limit)
    const maxCinemasToProcess = Math.min(
      cinemas.length,
      maxCinemasByRequests,
      maxCinemasByTokens,
      Math.max(1, maxCinemasByRPM) // At least 1, but respect RPM
    );

    if (maxCinemasToProcess < cinemas.length) {
      logger.warn(`Limiting to ${maxCinemasToProcess} cinemas to stay within FREE TIER limits (SAFETY MARGIN)`, {
        totalCinemas: cinemas.length,
        canProcess: maxCinemasToProcess,
        skipped: cinemas.length - maxCinemasToProcess,
        reason: maxCinemasByRequests < cinemas.length ? 'daily_requests_limit' : 
                maxCinemasByTokens < cinemas.length ? 'daily_token_limit' : 'rpm_limit',
        safeRequestsRemaining: safeRequestsRemaining,
        safeTokensRemaining: safeTokensRemaining,
        remainingRPM: usageStats.rpm.remaining,
        message: 'Stopped at 90% of limits to ensure 100% FREE usage - NO COSTS'
      }, 'CinemaScrapingController');
    }

  const cinemasToProcess = cinemas.slice(0, maxCinemasToProcess);

  logger.info(`Processing ${cinemasToProcess.length} out of ${cinemas.length} cinemas`, {
    total: cinemas.length,
    processing: cinemasToProcess.length,
    skipped: cinemas.length - cinemasToProcess.length
  }, 'CinemaScrapingController');

  // Process cinemas with delay to avoid rate limits
  const results = [];
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < cinemasToProcess.length; i++) {
    const cinema = cinemasToProcess[i];
    
    try {
      // Check rate limits before each cinema (with SAFETY MARGIN)
      const canProceed = rateLimiter.canMakeRequest();
      if (!canProceed.allowed) {
        if (canProceed.reason === 'DAILY_REQUESTS_LIMIT_EXCEEDED' || 
            canProceed.reason === 'DAILY_REQUESTS_HARD_LIMIT_EXCEEDED') {
          logger.warn(`Daily requests limit reached (SAFE LIMIT: 18/20). Stopping to prevent costs.`, {
            cinemaName: cinema.name,
            processed: i,
            remaining: cinemasToProcess.length - i,
            message: 'STOPPED AT 90% OF LIMIT - 100% FREE, NO COSTS'
          }, 'CinemaScrapingController');
          break;
        } else if (canProceed.reason === 'DAILY_TOKEN_LIMIT_EXCEEDED' ||
                   canProceed.reason === 'DAILY_TOKEN_HARD_LIMIT_EXCEEDED') {
          logger.warn(`Daily token limit reached (SAFE LIMIT: 90%). Stopping to prevent costs.`, {
            cinemaName: cinema.name,
            processed: i,
            remaining: cinemasToProcess.length - i,
            message: 'STOPPED AT 90% OF LIMIT - 100% FREE, NO COSTS'
          }, 'CinemaScrapingController');
          break;
        } else if (canProceed.reason === 'RPM_LIMIT_EXCEEDED') {
          logger.info(`RPM limit reached. Waiting ${canProceed.waitTime} seconds...`, {}, 'CinemaScrapingController');
          await delay(canProceed.waitTime * 1000);
        }
      }

      const result = await updateCinemaMovies(cinema._id.toString());
      results.push(result);

      // Add delay between requests to respect RPM (at least 4 seconds = 15 per minute)
      if (i < cinemasToProcess.length - 1) {
        await delay(4000); // 4 second delay = 15 requests per minute max
      }
    } catch (error) {
      // Check if it's a rate limit error
      if (error.message && error.message.includes('token limit')) {
        logger.warn(`Rate limit reached. Stopping processing.`, {
          processed: i + 1,
          total: cinemasToProcess.length,
          error: error.message
        }, 'CinemaScrapingController');
        break;
      }

      logger.error(`Failed to update cinema ${cinema._id}`, error, 'CinemaScrapingController');
      results.push({
        success: false,
        cinemaId: cinema._id.toString(),
        cinemaName: cinema.name,
        error: error.message
      });
    }
  }

  // Close browser after all requests
  await scrapingService.closeBrowser();

  const successCount = results.filter(r => r.success).length;
  const totalMovies = results.reduce((sum, r) => sum + (r.moviesMatched || 0), 0);
  
  // Get final usage stats
  const finalUsageStats = rateLimiter.getUsageStats();

  logger.info(`Completed update for ${results.length} cinemas`, {
    success: successCount,
    failed: results.length - successCount,
    totalMovies,
    usageStats: finalUsageStats
  }, 'CinemaScrapingController');

  return {
    success: true,
    message: `Updated ${successCount} out of ${results.length} cinemas processed`,
    totalCinemas: cinemas.length,
    processedCinemas: results.length,
    skippedCinemas: cinemas.length - results.length,
    successCount,
    failedCount: results.length - successCount,
    totalMoviesMatched: totalMovies,
    usageStats: finalUsageStats,
    results
  };
};

/**
 * Update movies for all cinemas in Spain
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.updateAllCinemas = async (req, res) => {
  try {
    const result = await updateAllCinemasInternal();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Failed to update all cinemas', error, 'CinemaScrapingController');
    await scrapingService.closeBrowser();
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export internal function for use in scripts
exports.updateAllCinemasInternal = updateAllCinemasInternal;

/**
 * Update movies for a specific cinema
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.updateCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;

    logger.info(`Starting update for cinema: ${cinemaId}`, {}, 'CinemaScrapingController');

    const result = await updateCinemaMovies(cinemaId);

    // Close browser
    await scrapingService.closeBrowser();

    if (result.success) {
      res.status(200).json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    logger.error('Failed to update cinema', error, 'CinemaScrapingController');
    await scrapingService.closeBrowser();
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export internal function for use in scripts
exports.updateCinemaMovies = updateCinemaMovies;

/**
 * Get scraping status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getStatus = async (req, res) => {
  try {
    const cinemas = await Cinema.find({
      'address.country': { $regex: /españa|spain|es/i },
      isDeleted: false
    });

    const cinemasWithUrl = cinemas.filter(c => c.url && c.url.trim() !== '');

    // Get rate limiter stats
    const usageStats = rateLimiter.getUsageStats();

    res.status(200).json({
      success: true,
      totalCinemas: cinemas.length,
      cinemasWithUrl: cinemasWithUrl.length,
      cinemasWithoutUrl: cinemas.length - cinemasWithUrl.length,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      tmdbConfigured: !!process.env.TMDB_API_KEY,
      rateLimits: {
        rpm: {
          current: usageStats.rpm.current,
          limit: usageStats.rpm.limit,
          remaining: usageStats.rpm.remaining
        },
        dailyTokens: {
          used: usageStats.dailyTokens.used,
          limit: usageStats.dailyTokens.limit,
          remaining: usageStats.dailyTokens.remaining,
          percentage: usageStats.dailyTokens.percentage
        },
        lastResetDate: usageStats.lastResetDate
      }
    });
  } catch (error) {
    logger.error('Failed to get scraping status', error, 'CinemaScrapingController');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

