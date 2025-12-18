const Cinema = require('../models/Cinema');

// GET /cinemas - Obtener todos los cines
exports.getAllCinemas = async (req, res) => {
  try {
    const { deleted, city } = req.query;
    const query = {};
    
    // Filtrar por estado de eliminación
    if (deleted === 'true') {
      query.isDeleted = true;
    } else {
      query.isDeleted = { $ne: true };
    }
    
    // Filtrar por ciudad si se proporciona
    if (city) {
      query['address.city'] = { $regex: new RegExp(city, 'i') }; // Búsqueda case-insensitive
    }
    
    const cinemas = await Cinema.find(query).sort({ createdAt: -1 });
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /cinemas/:id - Obtener un cine por ID
exports.getCinemaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es un ObjectId válido de MongoDB
    const mongoose = require('mongoose');
    let cinema;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Es un ObjectId válido, buscar por _id
      cinema = await Cinema.findById(id);
    } else {
      // No es un ObjectId válido, intentar buscar por campo id si existe
      cinema = await Cinema.findOne({ 
        $or: [
          { _id: id },
          { id: id }
        ]
      });
    }
    
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /cinemas - Crear un nuevo cine
exports.createCinema = async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    const savedCinema = await cinema.save();
    res.status(201).json(savedCinema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /cinemas/:id - Actualizar un cine completo
exports.updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH /cinemas/:id - Actualizar parcialmente un cine
exports.patchCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /cinemas/:id - Eliminar un cine (soft delete)
exports.deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

