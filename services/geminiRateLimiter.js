/**
 * Gemini Rate Limiter Service
 * Ensures we never exceed Gemini's free tier limits:
 * - 15 requests per minute (RPM)
 * - 1,500,000 tokens per day
 */

const logger = require('../utils/logger') || console;

class GeminiRateLimiter {
  constructor() {
    // FREE TIER LIMITS - DO NOT EXCEED (100% FREE, NO COSTS)
    // These are the ACTUAL limits discovered from Gemini API
    this.RPM_LIMIT = 15; // Requests per minute (shared across all models)
    this.DAILY_REQUESTS_LIMIT = 20; // 20 requests per day per model (FREE TIER - CRITICAL LIMIT)
    this.DAILY_TOKEN_LIMIT = 1500000; // 1.5M tokens per day (FREE TIER)
    
    // SAFETY MARGIN: Stop at 18 requests to avoid hitting 20 (90% of limit)
    this.SAFE_REQUESTS_LIMIT = 18; // Stop before hitting hard limit
    this.SAFE_TOKEN_LIMIT = 1350000; // 90% of token limit (1.35M tokens)
    
    // Tracking
    this.requestTimestamps = []; // Array of timestamps for RPM tracking
    this.dailyRequestCount = 0; // Total requests made today (per model)
    this.dailyTokenCount = 0; // Total tokens used today
    this.lastResetDate = new Date().toDateString(); // Date of last reset
    
    // Estimated tokens per request (conservative estimate)
    this.ESTIMATED_INPUT_TOKENS = 2000; // ~2000 tokens per HTML extraction
    this.ESTIMATED_OUTPUT_TOKENS = 500; // ~500 tokens per response
    this.ESTIMATED_TOKENS_PER_REQUEST = this.ESTIMATED_INPUT_TOKENS + this.ESTIMATED_OUTPUT_TOKENS;
  }

  /**
   * Reset daily counts if it's a new day
   */
  resetDailyCountIfNeeded() {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      logger.info('Resetting daily counts', { 
        previousDate: this.lastResetDate,
        previousRequestCount: this.dailyRequestCount,
        previousTokenCount: this.dailyTokenCount 
      }, 'GeminiRateLimiter');
      this.dailyRequestCount = 0;
      this.dailyTokenCount = 0;
      this.lastResetDate = today;
    }
  }

  /**
   * Clean old timestamps (older than 1 minute)
   */
  cleanOldTimestamps() {
    const oneMinuteAgo = Date.now() - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
  }

  /**
   * Check if we can make a request without exceeding limits
   * @returns {Object} { allowed: boolean, reason?: string, waitTime?: number }
   */
  canMakeRequest() {
    this.resetDailyCountIfNeeded();
    this.cleanOldTimestamps();

    // Check RPM limit
    if (this.requestTimestamps.length >= this.RPM_LIMIT) {
      const oldestTimestamp = Math.min(...this.requestTimestamps);
      const waitTime = 60000 - (Date.now() - oldestTimestamp);
      
      return {
        allowed: false,
        reason: 'RPM_LIMIT_EXCEEDED',
        waitTime: Math.ceil(waitTime / 1000), // in seconds
        currentRPM: this.requestTimestamps.length,
        limit: this.RPM_LIMIT
      };
    }

    // Check daily requests limit with SAFETY MARGIN (stop at 18 to avoid hitting 20)
    if (this.dailyRequestCount >= this.SAFE_REQUESTS_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_REQUESTS_LIMIT_EXCEEDED',
        currentRequests: this.dailyRequestCount,
        limit: this.SAFE_REQUESTS_LIMIT,
        hardLimit: this.DAILY_REQUESTS_LIMIT,
        message: 'Safe limit reached (18/20). Stopping to prevent any costs.'
      };
    }
    
    // Double check: Never allow if we're at or above hard limit
    if (this.dailyRequestCount >= this.DAILY_REQUESTS_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_REQUESTS_HARD_LIMIT_EXCEEDED',
        currentRequests: this.dailyRequestCount,
        limit: this.DAILY_REQUESTS_LIMIT,
        message: 'HARD LIMIT REACHED. STOPPING IMMEDIATELY to prevent costs.'
      };
    }

    // Check daily token limit with SAFETY MARGIN (stop at 90% to avoid hitting limit)
    const estimatedTokensAfterRequest = this.dailyTokenCount + this.ESTIMATED_TOKENS_PER_REQUEST;
    if (estimatedTokensAfterRequest > this.SAFE_TOKEN_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_TOKEN_LIMIT_EXCEEDED',
        currentTokens: this.dailyTokenCount,
        limit: this.SAFE_TOKEN_LIMIT,
        hardLimit: this.DAILY_TOKEN_LIMIT,
        estimatedAfterRequest: estimatedTokensAfterRequest,
        message: 'Safe token limit reached (90%). Stopping to prevent any costs.'
      };
    }
    
    // Double check: Never allow if we're at or above hard limit
    if (estimatedTokensAfterRequest > this.DAILY_TOKEN_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_TOKEN_HARD_LIMIT_EXCEEDED',
        currentTokens: this.dailyTokenCount,
        limit: this.DAILY_TOKEN_LIMIT,
        estimatedAfterRequest: estimatedTokensAfterRequest,
        message: 'HARD TOKEN LIMIT REACHED. STOPPING IMMEDIATELY to prevent costs.'
      };
    }

    return { allowed: true };
  }

  /**
   * Record a request (call this after making a request)
   * @param {number} actualTokens - Actual tokens used (optional, will use estimate if not provided)
   */
  recordRequest(actualTokens = null) {
    this.resetDailyCountIfNeeded();
    
    // Add timestamp for RPM tracking
    this.requestTimestamps.push(Date.now());
    
    // Increment daily request count
    this.dailyRequestCount++;
    
    // Add tokens to daily count
    const tokensUsed = actualTokens || this.ESTIMATED_TOKENS_PER_REQUEST;
    this.dailyTokenCount += tokensUsed;
    
    logger.info('Recorded Gemini API request', {
      tokensUsed,
      dailyRequests: this.dailyRequestCount,
      dailyRequestsLimit: this.DAILY_REQUESTS_LIMIT,
      remainingRequests: this.DAILY_REQUESTS_LIMIT - this.dailyRequestCount,
      dailyTokens: this.dailyTokenCount,
      dailyTokenLimit: this.DAILY_TOKEN_LIMIT,
      remainingTokens: this.DAILY_TOKEN_LIMIT - this.dailyTokenCount,
      currentRPM: this.requestTimestamps.length,
      rpmLimit: this.RPM_LIMIT
    }, 'GeminiRateLimiter');
  }

  /**
   * Get current usage statistics
   * @returns {Object} Usage stats
   */
  getUsageStats() {
    this.resetDailyCountIfNeeded();
    this.cleanOldTimestamps();

    return {
      rpm: {
        current: this.requestTimestamps.length,
        limit: this.RPM_LIMIT,
        remaining: Math.max(0, this.RPM_LIMIT - this.requestTimestamps.length)
      },
      dailyRequests: {
        used: this.dailyRequestCount,
        safeLimit: this.SAFE_REQUESTS_LIMIT,
        hardLimit: this.DAILY_REQUESTS_LIMIT,
        remaining: Math.max(0, this.SAFE_REQUESTS_LIMIT - this.dailyRequestCount),
        remainingToHardLimit: Math.max(0, this.DAILY_REQUESTS_LIMIT - this.dailyRequestCount),
        percentage: ((this.dailyRequestCount / this.DAILY_REQUESTS_LIMIT) * 100).toFixed(2),
        safePercentage: ((this.dailyRequestCount / this.SAFE_REQUESTS_LIMIT) * 100).toFixed(2)
      },
      dailyTokens: {
        used: this.dailyTokenCount,
        safeLimit: this.SAFE_TOKEN_LIMIT,
        hardLimit: this.DAILY_TOKEN_LIMIT,
        remaining: Math.max(0, this.SAFE_TOKEN_LIMIT - this.dailyTokenCount),
        remainingToHardLimit: Math.max(0, this.DAILY_TOKEN_LIMIT - this.dailyTokenCount),
        percentage: ((this.dailyTokenCount / this.DAILY_TOKEN_LIMIT) * 100).toFixed(2),
        safePercentage: ((this.dailyTokenCount / this.SAFE_TOKEN_LIMIT) * 100).toFixed(2)
      },
      lastResetDate: this.lastResetDate
    };
  }

  /**
   * Wait if necessary to respect RPM limit
   * @returns {Promise<void>}
   */
  async waitIfNeeded() {
    const check = this.canMakeRequest();
    
    if (!check.allowed && check.reason === 'RPM_LIMIT_EXCEEDED' && check.waitTime) {
      logger.warn(`Rate limit reached. Waiting ${check.waitTime} seconds...`, {
        currentRPM: check.currentRPM,
        limit: check.limit
      }, 'GeminiRateLimiter');
      
      await new Promise(resolve => setTimeout(resolve, check.waitTime * 1000));
      
      // Clean timestamps again after waiting
      this.cleanOldTimestamps();
    }
  }
}

module.exports = new GeminiRateLimiter();

