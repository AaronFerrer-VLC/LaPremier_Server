const Favorite = require('../models/Favorite');

// GET /favorites - Obtener favoritos/watchlist de un usuario
exports.getUserFavorites = async (req, res) => {
  try {
    const { userId, type } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const favorites = await Favorite.find(query)
      .sort({ addedAt: -1 });
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /favorites - Agregar a favoritos/watchlist
exports.addFavorite = async (req, res) => {
  try {
    const { userId, movieId, type = 'favorite' } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'userId and movieId are required' });
    }

    if (!['favorite', 'watchlist'].includes(type)) {
      return res.status(400).json({ error: 'type must be "favorite" or "watchlist"' });
    }

    // Verificar si ya existe
    const existing = await Favorite.findOne({ userId, movieId, type });
    if (existing) {
      return res.status(409).json({ error: 'Already exists', favorite: existing });
    }

    const favorite = new Favorite({ userId, movieId, type });
    const savedFavorite = await favorite.save();
    
    res.status(201).json(savedFavorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Already exists' });
    }
    res.status(400).json({ error: error.message });
  }
};

// DELETE /favorites/:id - Eliminar de favoritos/watchlist
exports.removeFavorite = async (req, res) => {
  try {
    const { userId, movieId, type } = req.query;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'userId and movieId are required' });
    }

    const query = { userId, movieId };
    if (type) {
      query.type = type;
    }

    const favorite = await Favorite.findOneAndDelete(query);
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully', favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /favorites/check - Verificar si una película está en favoritos/watchlist
exports.checkFavorite = async (req, res) => {
  try {
    const { userId, movieId, type } = req.query;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'userId and movieId are required' });
    }

    const query = { userId, movieId };
    if (type) {
      query.type = type;
    }

    const favorite = await Favorite.findOne(query);
    
    res.json({ 
      exists: !!favorite,
      favorite: favorite || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /favorites/stats - Obtener estadísticas de favoritos
exports.getFavoriteStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const [favoritesCount, watchlistCount] = await Promise.all([
      Favorite.countDocuments({ userId, type: 'favorite' }),
      Favorite.countDocuments({ userId, type: 'watchlist' })
    ]);

    res.json({
      favorites: favoritesCount,
      watchlist: watchlistCount,
      total: favoritesCount + watchlistCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

