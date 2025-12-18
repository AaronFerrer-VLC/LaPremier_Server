const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  movieId: {
    type: [Number],
    default: []
  },
  name: {
    type: String,
    required: true
  },
  cover: {
    type: [String],
    default: []
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipcode: {
      type: Number,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  location: {
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    }
  },
  url: {
    type: String,
    default: ''
  },
  price: {
    regular: {
      type: Number,
      default: 0
    },
    weekend: {
      type: Number,
      default: 0
    },
    special: {
      type: Number,
      default: 0
    }
  },
  specs: {
    VO: {
      type: Boolean,
      default: false
    },
    is3D: {
      type: Boolean,
      default: false
    },
    accesibility: {
      type: Boolean,
      default: false
    }
  },
  capacity: {
    dicerooms: {
      type: Number,
      default: 0
    },
    seating: {
      type: Number,
      default: 0
    }
  },
  services: {
    type: [String],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar las búsquedas
cinemaSchema.index({ name: 1 });
cinemaSchema.index({ 'address.city': 1 });
cinemaSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Cinema', cinemaSchema);

