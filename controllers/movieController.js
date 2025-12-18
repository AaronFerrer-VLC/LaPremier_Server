const Movie = require('../models/Movie');

// GET /movies - Obtener todas las películas
exports.getAllMovies = async (req, res) => {
  try {
    const { deleted, released, gender } = req.query;
    const query = {};
    
    if (deleted !== 'true') {
      query.isDeleted = { $ne: true };
    } else {
      query.isDeleted = true;
    }
    
    if (released !== undefined) {
      query.released = released === 'true';
    }
    
    if (gender) {
      query.gender = { $in: [gender] };
    }
    
    const movies = await Movie.find(query).sort({ date: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /movies/:id - Obtener una película por ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es un ObjectId válido de MongoDB
    const mongoose = require('mongoose');
    let movie;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Es un ObjectId válido, buscar por _id
      movie = await Movie.findById(id);
    } else {
      // No es un ObjectId válido, podría ser un ID numérico (TMDB) o string
      // Intentar buscar por campo id numérico o tmdbId
      // No intentar buscar por _id si no es ObjectId válido
      const query = {
        $or: [
          { id: Number(id) || id },
          { tmdbId: Number(id) || id }
        ]
      };
      
      movie = await Movie.findOne(query);
    }
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error in getMovieById:', {
      id: req.params.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// POST /movies - Crear una nueva película
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /movies/:id - Actualizar una película completa
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH /movies/:id - Actualizar parcialmente una película
exports.patchMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /movies/:id - Eliminar una película (soft delete)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

