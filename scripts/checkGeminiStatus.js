/**
 * Script to check Gemini API usage status
 * Shows current rate limit usage before running updates
 * 
 * Usage: node scripts/checkGeminiStatus.js
 */

require('dotenv').config();
const connectDB = require('../config/database');
const rateLimiter = require('../services/geminiRateLimiter');
const Cinema = require('../models/Cinema');

const checkStatus = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Get rate limiter stats
    const usageStats = rateLimiter.getUsageStats();

    // Get cinemas info
    const cinemas = await Cinema.find({
      'address.country': { $regex: /españa|spain|es/i },
      isDeleted: false,
      url: { $exists: true, $ne: '' }
    });

    // Calculate capacity
    const tokensPerCinema = 5000; // Conservative estimate
    const requestsPerCinema = 2; // Average: 1 for extraction + 1 for matching
    const maxCinemasByRequests = Math.floor(usageStats.dailyRequests.remaining / requestsPerCinema);
    const maxCinemasByTokens = Math.floor(usageStats.dailyTokens.remaining / tokensPerCinema);
    const maxCinemasByRPM = Math.min(usageStats.rpm.remaining, 15);

    console.log('📊 GEMINI API STATUS');
    console.log('═'.repeat(50));
    console.log('\n🔹 Rate Limits (RPM):');
    console.log(`   Current: ${usageStats.rpm.current}/${usageStats.rpm.limit}`);
    console.log(`   Remaining: ${usageStats.rpm.remaining}`);
    console.log(`   Status: ${usageStats.rpm.remaining > 0 ? '✅ OK' : '⚠️  LIMIT REACHED'}`);

    console.log('\n🔹 Daily Requests (per model):');
    console.log(`   Used: ${usageStats.dailyRequests.used}/${usageStats.dailyRequests.limit}`);
    console.log(`   Remaining: ${usageStats.dailyRequests.remaining}`);
    console.log(`   Percentage: ${usageStats.dailyRequests.percentage}%`);
    console.log(`   Status: ${parseFloat(usageStats.dailyRequests.percentage) < 90 ? '✅ OK' : '⚠️  APPROACHING LIMIT'}`);

    console.log('\n🔹 Daily Token Usage:');
    console.log(`   Used: ${usageStats.dailyTokens.used.toLocaleString()}/${usageStats.dailyTokens.limit.toLocaleString()}`);
    console.log(`   Remaining: ${usageStats.dailyTokens.remaining.toLocaleString()}`);
    console.log(`   Percentage: ${usageStats.dailyTokens.percentage}%`);
    console.log(`   Status: ${parseFloat(usageStats.dailyTokens.percentage) < 90 ? '✅ OK' : '⚠️  APPROACHING LIMIT'}`);

    console.log('\n🔹 Processing Capacity:');
    console.log(`   Total cinemas available: ${cinemas.length}`);
    console.log(`   Can process by requests: ${maxCinemasByRequests} cinemas`);
    console.log(`   Can process by tokens: ${maxCinemasByTokens} cinemas`);
    console.log(`   Can process by RPM: ${maxCinemasByRPM} cinemas`);
    console.log(`   Safe to process: ${Math.min(maxCinemasByRequests, maxCinemasByTokens, maxCinemasByRPM)} cinemas`);

    console.log('\n🔹 Recommendations:');
    if (usageStats.rpm.remaining === 0) {
      console.log('   ⚠️  RPM limit reached. Wait a minute before processing.');
    } else if (parseFloat(usageStats.dailyRequests.percentage) >= 100) {
      console.log('   ⚠️  Daily requests limit (20/day) reached for current model.');
      console.log('   💡 System will automatically switch to next model if available.');
    } else if (parseFloat(usageStats.dailyTokens.percentage) > 90) {
      console.log('   ⚠️  Daily token limit almost reached. Wait until tomorrow.');
    } else if (maxCinemasByRequests < 10) {
      console.log('   ⚠️  Low request capacity. System will switch models automatically if needed.');
    } else {
      console.log('   ✅ Safe to process cinemas');
      console.log(`   💡 Recommended: Start with ${Math.min(10, maxCinemasByRequests)} cinemas to test`);
    }

    console.log('\n' + '═'.repeat(50));
    console.log(`📅 Last reset: ${usageStats.lastResetDate}`);
    console.log('\n💡 Tip: Run this script before processing to check availability\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the check
checkStatus();

