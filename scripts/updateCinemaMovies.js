/**
 * Script to update cinema movies using AI scraping
 * Can be run manually or via cron job
 * 
 * Usage: node scripts/updateCinemaMovies.js [cinemaId]
 * If cinemaId is provided, updates only that cinema
 * Otherwise, updates all Spanish cinemas
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ENV = require('../config/env');
const connectDB = require('../config/database');
const cinemaScrapingController = require('../controllers/cinemaScrapingController');
const scrapingService = require('../services/scrapingService');

const runUpdate = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    const cinemaId = process.argv[2];

    if (cinemaId) {
      // Update specific cinema
      console.log(`🔄 Updating cinema: ${cinemaId}`);
      const { updateCinemaMovies } = require('../controllers/cinemaScrapingController');
      
      const result = await updateCinemaMovies(cinemaId);
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      
      // Close browser
      await scrapingService.closeBrowser();
    } else {
      // Update all cinemas
      console.log('🔄 Updating all Spanish cinemas...');
      const { updateAllCinemasInternal } = require('../controllers/cinemaScrapingController');
      
      const result = await updateAllCinemasInternal();
      console.log('📊 Results:', JSON.stringify(result, null, 2));
    }

    console.log('✅ Update completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await scrapingService.closeBrowser();
    process.exit(1);
  }
};

// Run the update
runUpdate();

