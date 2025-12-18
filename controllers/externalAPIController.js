/**
 * External API Controller
 * Handles requests to external APIs (Google Places, Foursquare) from backend
 * This avoids CORS issues when calling from frontend
 */

// Use native fetch in Node.js 18+ or node-fetch for older versions
let fetch;
try {
  // Try native fetch first (Node.js 18+)
  fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}

const ENV = require('../config/env');
const GOOGLE_PLACES_API_KEY = ENV.GOOGLE_PLACES_API_KEY;
const FOURSQUARE_API_KEY = ENV.FOURSQUARE_API_KEY;

/**
 * Search cinemas using Google Places API
 */
const searchCinemasGooglePlaces = async (city, lat = null, lng = null) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    let url;
    if (lat && lng) {
      // Nearby Search (more accurate)
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=movie_theater&key=${GOOGLE_PLACES_API_KEY}`;
    } else {
      // Text Search
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cinemas+in+${encodeURIComponent(city)}&type=movie_theater&key=${GOOGLE_PLACES_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const cinemas = (data.results || []).map((place) => {
      const addressComponents = place.address_components || [];
      const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
      const streetName = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
      const cityName = addressComponents.find(c => c.types.includes('locality'))?.long_name || 
                       addressComponents.find(c => c.types.includes('administrative_area_level_2'))?.long_name || city;
      const zipcode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
      const country = addressComponents.find(c => c.types.includes('country'))?.long_name || 'Spain';
      
      const street = place.vicinity || `${streetNumber} ${streetName}`.trim() || '';
      
      // Get photo URLs if available (first photo as preview)
      const photoUrl = place.photos && place.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        : null;

      return {
        name: place.name,
        address: {
          street: street,
          city: cityName,
          zipcode: zipcode,
          country: country,
        },
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        ratingCount: place.user_ratings_total || 0,
        placeId: place.place_id,
        formattedAddress: place.formatted_address || '',
        priceLevel: place.price_level || null,
        openingHours: place.opening_hours?.weekday_text || null,
        photoUrl: photoUrl,
        website: place.website || null,
        source: 'google_places',
      };
    });

    return cinemas;
  } catch (error) {
    throw error;
  }
};

/**
 * Search cinemas using Foursquare Places API v3
 */
const searchCinemasFoursquare = async (city, lat = null, lng = null) => {
  try {
    if (!FOURSQUARE_API_KEY) {
      throw new Error('Foursquare API key not configured');
    }

    let url;
    if (lat && lng) {
      // Use coordinates for better accuracy
      url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=17114&radius=10000&limit=20`;
    } else {
      // Use city name
      url = `https://api.foursquare.com/v3/places/search?query=cinema&near=${encodeURIComponent(city)}&categories=17114&limit=20`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // 410 means endpoint deprecated, try alternative
      if (response.status === 410) {
        throw new Error('Foursquare API endpoint deprecated');
      }
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();
    const cinemas = (data.results || []).map((place) => ({
      name: place.name,
      address: {
        street: place.location?.address || '',
        city: place.location?.locality || city,
        zipcode: place.location?.postcode || '',
        country: place.location?.country || 'Spain',
      },
      location: {
        lat: place.geocodes?.main?.latitude,
        lng: place.geocodes?.main?.longitude,
      },
      rating: place.rating || 0,
      placeId: place.fsq_id,
      source: 'foursquare',
    }));

    return cinemas;
  } catch (error) {
    throw error;
  }
};

/**
 * Search cinemas using OpenStreetMap Nominatim
 */
const searchCinemasOpenStreetMap = async (city) => {
  try {
    const query = `cinema in ${city}, Spain`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=20&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LaPremiere/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('OpenStreetMap API error');
    }

    const data = await response.json();
    const cinemas = data.map((place) => ({
      name: place.display_name.split(',')[0],
      address: {
        street: place.address?.road || '',
        city: place.address?.city || place.address?.town || city,
        zipcode: place.address?.postcode || '',
        country: place.address?.country || 'Spain',
      },
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      },
      rating: 0,
      placeId: place.place_id,
      source: 'openstreetmap',
    }));

    return cinemas;
  } catch (error) {
    throw error;
  }
};

/**
 * Get cinema details from Google Places by place_id
 */
const getCinemaDetailsFromGooglePlaces = async (placeId) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    const fields = [
      'name',
      'formatted_address',
      'address_components',
      'geometry',
      'rating',
      'user_ratings_total',
      'opening_hours',
      'website',
      'international_phone_number',
      'price_level',
      'photos',
      'reviews',
      'vicinity',
      'place_id'
    ].join(',');
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /api/external/cinemas/details/:placeId
 * Get detailed cinema information from Google Places
 */
exports.getCinemaDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ 
        error: 'Place ID is required' 
      });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(400).json({ 
        error: 'Google Places API key not configured' 
      });
    }

    const details = await getCinemaDetailsFromGooglePlaces(placeId);
    
    // Transform to our format
    const addressComponents = details.address_components || [];
    const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
    const streetName = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
    const cityName = addressComponents.find(c => c.types.includes('locality'))?.long_name || 
                     addressComponents.find(c => c.types.includes('administrative_area_level_2'))?.long_name || '';
    const zipcode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
    const country = addressComponents.find(c => c.types.includes('country'))?.long_name || 'Spain';
    
    const street = details.vicinity || `${streetNumber} ${streetName}`.trim() || '';
    
    // Get photo URLs (first 3 photos)
    const photos = (details.photos || []).slice(0, 3).map(photo => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
    });

    const cinemaData = {
      name: details.name,
      address: {
        street: street,
        city: cityName,
        zipcode: zipcode,
        country: country,
      },
      location: {
        lat: details.geometry?.location?.lat || null,
        lng: details.geometry?.location?.lng || null,
      },
      cover: photos,
      url: details.website || '',
      rating: details.rating || 0,
      ratingCount: details.user_ratings_total || 0,
      phone: details.international_phone_number || '',
      openingHours: details.opening_hours?.weekday_text || null,
      priceLevel: details.price_level || null,
      formattedAddress: details.formatted_address || '',
      placeId: details.place_id,
      source: 'google_places',
    };

    res.json({
      success: true,
      data: cinemaData
    });
  } catch (error) {
    console.error('Error getting cinema details:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener detalles del cine' 
    });
  }
};

/**
 * GET /api/external/cinemas/search
 * Search cinemas from external APIs
 */
exports.searchCinemas = async (req, res) => {
  try {
    const { city, lat, lng } = req.query;

    if (!city) {
      return res.status(400).json({ 
        error: 'City parameter is required' 
      });
    }

    let cinemas = [];
    let source = '';

    // Try Google Places first
    if (GOOGLE_PLACES_API_KEY) {
      try {
        cinemas = await searchCinemasGooglePlaces(city, lat, lng);
        source = 'google_places';
      } catch (error) {
        console.warn('Google Places failed, trying alternatives:', error.message);
      }
    }

    // Try Foursquare if Google failed or no results
    if (cinemas.length === 0 && FOURSQUARE_API_KEY) {
      try {
        cinemas = await searchCinemasFoursquare(city, lat, lng);
        source = 'foursquare';
      } catch (error) {
        console.warn('Foursquare failed, trying OpenStreetMap:', error.message);
      }
    }

    // Fallback to OpenStreetMap
    if (cinemas.length === 0) {
      try {
        cinemas = await searchCinemasOpenStreetMap(city);
        source = 'openstreetmap';
      } catch (error) {
        console.error('All cinema API services failed:', error);
        return res.status(500).json({ 
          error: 'No se pudieron obtener cines. Por favor, intenta más tarde.' 
        });
      }
    }

    res.json({
      success: true,
      data: cinemas,
      source,
      count: cinemas.length
    });
  } catch (error) {
    console.error('Error searching cinemas:', error);
    res.status(500).json({ 
      error: error.message || 'Error al buscar cines' 
    });
  }
};

