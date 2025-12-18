const Review = require('../models/Review');

// GET /reviews - Obtener todas las reseñas
exports.getAllReviews = async (req, res) => {
  try {
    const { movieId, rating } = req.query;
    const query = {};
    
    if (movieId) {
      query.movieId = movieId;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /reviews/:id - Obtener una reseña por ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /reviews - Crear una nueva reseña
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /reviews/:id - Actualizar una reseña completa
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH /reviews/:id - Actualizar parcialmente una reseña
exports.patchReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /reviews/:id - Eliminar una reseña
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

