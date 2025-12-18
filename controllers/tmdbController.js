/**
 * TMDB Proxy Controller
 * Proxies TMDB API requests through backend to protect API keys
 */

let fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}

const ENV = require('../config/env');
const TMDB_API_KEY = ENV.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Proxy TMDB API request
 */
const proxyTMDBRequest = async (endpoint, params = {}) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    // Build URL with API key
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    
    // Add default language and region for Spanish content
    if (!params.language) {
      url.searchParams.append('language', 'es-ES');
    }
    if (!params.region && !endpoint.includes('/search/') && !endpoint.includes('/discover/')) {
      url.searchParams.append('region', 'ES');
    }
    
    // Add additional params
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || response.statusText}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /api/external/tmdb/movies/now-playing
 * Get now playing movies
 */
exports.getNowPlaying = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest('/movie/now_playing', { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/popular
 * Get popular movies
 */
exports.getPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest('/movie/popular', { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/top-rated
 * Get top rated movies
 */
exports.getTopRated = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest('/movie/top_rated', { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/upcoming
 * Get upcoming movies
 */
exports.getUpcoming = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest('/movie/upcoming', { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/trending
 * Get trending movies
 */
exports.getTrending = async (req, res) => {
  try {
    const { page = 1, time_window = 'day' } = req.query;
    const data = await proxyTMDBRequest('/trending/movie/day', { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/search
 * Search movies
 */
exports.searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Query parameter is required' }
      });
    }
    const data = await proxyTMDBRequest('/search/movie', { query, page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/:id
 * Get movie details
 */
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { append_to_response = 'credits,videos,watch/providers' } = req.query;
    
    const data = await proxyTMDBRequest(`/movie/${id}`, { append_to_response });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/:id/similar
 * Get similar movies
 */
exports.getSimilarMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest(`/movie/${id}/similar`, { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/movies/:id/recommendations
 * Get movie recommendations
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const data = await proxyTMDBRequest(`/movie/${id}/recommendations`, { page });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/discover/movies
 * Discover movies with filters
 */
exports.discoverMovies = async (req, res) => {
  try {
    const params = {
      page: req.query.page || 1,
      ...(req.query.genre && { with_genres: req.query.genre }),
      ...(req.query.year && { year: req.query.year }),
      ...(req.query['vote_average.gte'] && { 'vote_average.gte': req.query['vote_average.gte'] }),
      ...(req.query.sort_by && { sort_by: req.query.sort_by }),
    };
    const data = await proxyTMDBRequest('/discover/movie', params);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

/**
 * GET /api/external/tmdb/genres
 * Get movie genres
 */
exports.getGenres = async (req, res) => {
  try {
    const data = await proxyTMDBRequest('/genre/movie/list');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

