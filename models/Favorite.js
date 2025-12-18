const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.Mixed, // Puede ser ObjectId o String
    required: true
  },
  type: {
    type: String,
    enum: ['favorite', 'watchlist'],
    default: 'favorite',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
favoriteSchema.index({ userId: 1, movieId: 1, type: 1 }, { unique: true });

// Índices para búsquedas rápidas
favoriteSchema.index({ userId: 1, type: 1 });
favoriteSchema.index({ movieId: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);

