/**
 * Movie Matching Service
 * Matches movie titles from cinema websites with TMDB movies
 */

const tmdbController = require('../controllers/tmdbController');
const aiService = require('./aiService');
const logger = require('../utils/logger') || console;

class MovieMatchingService {
  /**
   * Match movie titles with TMDB IDs
   * @param {Array<string>} movieTitles - Array of movie titles from cinema
   * @returns {Promise<Array<number>>} Array of TMDB IDs
   */
  async matchMoviesWithTMDB(movieTitles) {
    if (!movieTitles || movieTitles.length === 0) {
      return [];
    }

    const matchedIds = [];
    const unmatchedTitles = [];

    // First, try direct search in TMDB for each title
    for (const title of movieTitles) {
      try {
        const tmdbId = await this.searchMovieInTMDB(title);
        if (tmdbId) {
          matchedIds.push(tmdbId);
          logger.info(`Matched "${title}" with TMDB ID ${tmdbId}`, {}, 'MovieMatchingService');
        } else {
          unmatchedTitles.push(title);
        }
      } catch (error) {
        logger.warn(`Failed to match "${title}"`, { error: error.message }, 'MovieMatchingService');
        unmatchedTitles.push(title);
      }
    }

    // For unmatched titles, try AI-assisted matching with popular movies
    if (unmatchedTitles.length > 0) {
      logger.info(`Trying AI-assisted matching for ${unmatchedTitles.length} unmatched titles`, {}, 'MovieMatchingService');
      
      // Get popular movies from TMDB for AI matching
      try {
        const popularMovies = await this.getPopularMoviesFromTMDB();
        
        for (const title of unmatchedTitles) {
          try {
            const matchedMovie = await aiService.matchMovieTitle(title, popularMovies);
            if (matchedMovie && matchedMovie.id) {
              matchedIds.push(matchedMovie.id);
              logger.info(`AI matched "${title}" with TMDB ID ${matchedMovie.id}`, {}, 'MovieMatchingService');
            }
          } catch (error) {
            logger.warn(`AI matching failed for "${title}"`, { error: error.message }, 'MovieMatchingService');
          }
        }
      } catch (error) {
        logger.error('Failed to get popular movies for AI matching', { error }, 'MovieMatchingService');
      }
    }

    // Remove duplicates
    const uniqueIds = [...new Set(matchedIds)];

    logger.info(`Matched ${uniqueIds.length} out of ${movieTitles.length} movies`, {
      total: movieTitles.length,
      matched: uniqueIds.length,
      unmatched: movieTitles.length - uniqueIds.length
    }, 'MovieMatchingService');

    return uniqueIds;
  }

  /**
   * Search movie in TMDB by title
   * @param {string} title - Movie title
   * @returns {Promise<number|null>} TMDB ID or null
   */
  async searchMovieInTMDB(title) {
    try {
      // Use TMDB search endpoint
      const fetch = require('node-fetch');
      const ENV = require('../config/env');
      
      if (!ENV.TMDB_API_KEY) {
        return null;
      }

      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${ENV.TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(title)}&page=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Get the first result (most relevant)
        const movie = data.results[0];
        
        // Check if title is similar enough (fuzzy match)
        const similarity = this.calculateSimilarity(
          title.toLowerCase(),
          movie.title.toLowerCase()
        );
        
        // Also check original title
        const originalSimilarity = movie.original_title 
          ? this.calculateSimilarity(title.toLowerCase(), movie.original_title.toLowerCase())
          : 0;

        const maxSimilarity = Math.max(similarity, originalSimilarity);

        // If similarity is high enough, return the ID
        if (maxSimilarity > 0.7) {
          return movie.id;
        }
      }

      return null;
    } catch (error) {
      logger.warn(`TMDB search failed for "${title}"`, { error: error.message }, 'MovieMatchingService');
      return null;
    }
  }

  /**
   * Get popular movies from TMDB for AI matching
   * @returns {Promise<Array>} Array of popular movies
   */
  async getPopularMoviesFromTMDB() {
    try {
      const fetch = require('node-fetch');
      const ENV = require('../config/env');
      
      if (!ENV.TMDB_API_KEY) {
        return [];
      }

      // Get popular movies (first 2 pages = 40 movies)
      const movies = [];
      
      for (let page = 1; page <= 2; page++) {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${ENV.TMDB_API_KEY}&language=es-ES&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results) {
          movies.push(...data.results);
        }
      }

      return movies;
    } catch (error) {
      logger.error('Failed to get popular movies from TMDB', { error }, 'MovieMatchingService');
      return [];
    }
  }

  /**
   * Calculate similarity between two strings (Levenshtein distance)
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

module.exports = new MovieMatchingService();

