const express = require('express');
const router = express.Router();
const externalAPIController = require('../controllers/externalAPIController');
const tmdbController = require('../controllers/tmdbController');

// Cinema APIs (Google Places, Foursquare)
router.get('/cinemas/search', externalAPIController.searchCinemas);
router.get('/cinemas/details/:placeId', externalAPIController.getCinemaDetails);

// TMDB Proxy APIs (protects API key)
router.get('/tmdb/movies/now-playing', tmdbController.getNowPlaying);
router.get('/tmdb/movies/popular', tmdbController.getPopular);
router.get('/tmdb/movies/top-rated', tmdbController.getTopRated);
router.get('/tmdb/movies/upcoming', tmdbController.getUpcoming);
router.get('/tmdb/movies/trending', tmdbController.getTrending);
router.get('/tmdb/movies/search', tmdbController.searchMovies);
router.get('/tmdb/movies/:id', tmdbController.getMovieDetails);
router.get('/tmdb/movies/:id/similar', tmdbController.getSimilarMovies);
router.get('/tmdb/movies/:id/recommendations', tmdbController.getRecommendations);
router.get('/tmdb/discover/movies', tmdbController.discoverMovies);
router.get('/tmdb/genres', tmdbController.getGenres);

module.exports = router;

