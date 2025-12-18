const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.Mixed, // Puede ser Number o String según los datos
    required: true
  }
}, {
  timestamps: true
});

// Índices para mejorar las búsquedas
reviewSchema.index({ movieId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

