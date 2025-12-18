const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/', favoriteController.getUserFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/', favoriteController.removeFavorite);
router.get('/check', favoriteController.checkFavorite);
router.get('/stats', favoriteController.getFavoriteStats);

module.exports = router;

