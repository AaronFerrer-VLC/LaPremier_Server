/**
 * Script de migración de db.json a MongoDB
 * Ejecutar con: node scripts/migrateToMongoDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Importar modelos
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

// Configuración
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lapremier';
const DB_JSON_PATH = path.join(__dirname, '..', 'db.json');

// Función para convertir IDs numéricos a ObjectIds o mantenerlos como números
const convertId = (id) => {
  // MongoDB usará _id automáticamente, pero mantenemos el id original si existe
  return id;
};

// Función para migrar datos
const migrateData = async () => {
  try {
    console.log('🔄 Iniciando migración a MongoDB...');
    
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Leer db.json
    console.log('📖 Leyendo db.json...');
    const dbData = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf8'));

    // Limpiar colecciones existentes (opcional - comentar si quieres mantener datos)
    console.log('🗑️  Limpiando colecciones existentes...');
    await Cinema.deleteMany({});
    await Movie.deleteMany({});
    await Review.deleteMany({});

    // Migrar Cinemas
    if (dbData.cinemas && dbData.cinemas.length > 0) {
      console.log(`📦 Migrando ${dbData.cinemas.length} cines...`);
      const cinemasData = dbData.cinemas.map(cinema => {
        // Remover id si existe, MongoDB generará _id automáticamente
        const { id, ...cinemaData } = cinema;
        // Asegurar que los campos requeridos existan
        if (!cinemaData.name) {
          console.warn('⚠️  Cinema sin nombre encontrado, saltando...');
          return null;
        }
        return cinemaData;
      }).filter(cinema => cinema !== null);
      
      if (cinemasData.length > 0) {
        await Cinema.insertMany(cinemasData, { ordered: false });
        console.log('✅ Cines migrados exitosamente');
      } else {
        console.log('⚠️  No se migraron cines (todos fueron filtrados)');
      }
    }

    // Migrar Movies
    if (dbData.movies && dbData.movies.length > 0) {
      console.log(`📦 Migrando ${dbData.movies.length} películas...`);
      const moviesData = dbData.movies.map(movie => {
        const { id, ...movieData } = movie;
        // Convertir fecha string a Date si es necesario
        if (movieData.date && typeof movieData.date === 'string') {
          try {
            movieData.date = new Date(movieData.date);
          } catch (e) {
            console.warn(`⚠️  Fecha inválida para película: ${movieData.title?.original || 'sin título'}`);
            movieData.date = new Date();
          }
        }
        // Validar campos requeridos
        if (!movieData.title || !movieData.title.original) {
          console.warn('⚠️  Película sin título encontrada, saltando...');
          return null;
        }
        return movieData;
      }).filter(movie => movie !== null);
      
      if (moviesData.length > 0) {
        await Movie.insertMany(moviesData, { ordered: false });
        console.log('✅ Películas migradas exitosamente');
      } else {
        console.log('⚠️  No se migraron películas (todas fueron filtradas)');
      }
    }

    // Migrar Reviews
    if (dbData.reviews && dbData.reviews.length > 0) {
      console.log(`📦 Migrando ${dbData.reviews.length} reseñas...`);
      const reviewsData = dbData.reviews.map(review => {
        const { id, ...reviewData } = review;
        // Validar campos requeridos
        if (!reviewData.rating || !reviewData.comment || !reviewData.user) {
          console.warn('⚠️  Reseña incompleta encontrada, saltando...');
          return null;
        }
        // Asegurar que rating esté en el rango válido
        if (reviewData.rating < 1 || reviewData.rating > 5) {
          console.warn(`⚠️  Rating inválido (${reviewData.rating}), ajustando...`);
          reviewData.rating = Math.max(1, Math.min(5, reviewData.rating));
        }
        return reviewData;
      }).filter(review => review !== null);
      
      if (reviewsData.length > 0) {
        await Review.insertMany(reviewsData, { ordered: false });
        console.log('✅ Reseñas migradas exitosamente');
      } else {
        console.log('⚠️  No se migraron reseñas (todas fueron filtradas)');
      }
    }

    // Estadísticas finales
    const cinemasCount = await Cinema.countDocuments();
    const moviesCount = await Movie.countDocuments();
    const reviewsCount = await Review.countDocuments();

    console.log('\n📊 Migración completada:');
    console.log(`   - Cines: ${cinemasCount}`);
    console.log(`   - Películas: ${moviesCount}`);
    console.log(`   - Reseñas: ${reviewsCount}`);

    console.log('\n✅ ¡Migración completada exitosamente!');
    
    // Cerrar conexión
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar migración
migrateData();

