const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  cinemaId: {
    type: [Number],
    default: []
  },
  title: {
    original: {
      type: String,
      required: true
    },
    spanish: {
      type: String,
      required: true
    }
  },
  poster: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  director: {
    type: String,
    default: ''
  },
  gender: {
    type: [String],
    default: []
  },
  casting: {
    type: [{
      name: String,
      photo: String
    }],
    default: []
  },
  calification: {
    type: String,
    default: ''
  },
  released: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  trailer: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar las búsquedas
movieSchema.index({ 'title.original': 1 });
movieSchema.index({ 'title.spanish': 1 });
movieSchema.index({ gender: 1 });
movieSchema.index({ released: 1 });
movieSchema.index({ isDeleted: 1 });
movieSchema.index({ date: -1 });

module.exports = mongoose.model('Movie', movieSchema);

