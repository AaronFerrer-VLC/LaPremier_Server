/**
 * AI Service
 * Uses Google Gemini to extract movie information from cinema websites
 * Includes rate limiting to stay within free tier limits
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const ENV = require('../config/env');
const logger = require('../utils/logger') || console;
const rateLimiter = require('./geminiRateLimiter');

class AIService {
  constructor() {
    if (!ENV.GEMINI_API_KEY) {
      logger.warn('Gemini API key not configured', {}, 'AIService');
      this.genAI = null;
      this.model = null;
      this.modelName = null;
    } else {
      this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
      // List of models to try (each has its own 20 requests/day limit in free tier)
      this.availableModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.5-pro',
        'gemini-flash-latest'
      ];
      this.currentModelIndex = 0;
      this.initializeModel();
    }
  }

  /**
   * Initialize the current model
   */
  initializeModel() {
    const modelName = process.env.GEMINI_MODEL_NAME || this.availableModels[this.currentModelIndex];
    this.modelName = modelName;
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    logger.info(`Using Gemini model: ${modelName}`, {}, 'AIService');
  }

  /**
   * Switch to next available model when current one hits limit
   */
  switchToNextModel() {
    if (this.currentModelIndex < this.availableModels.length - 1) {
      this.currentModelIndex++;
      this.initializeModel();
      logger.info(`Switched to model: ${this.modelName}`, {}, 'AIService');
      return true;
    }
    return false;
  }

  /**
   * Check if we can make a request and wait if needed
   * @throws {Error} If limits are exceeded
   */
  async checkRateLimit() {
    const check = rateLimiter.canMakeRequest();
    
    if (!check.allowed) {
      if (check.reason === 'RPM_LIMIT_EXCEEDED') {
        // Wait for rate limit
        await rateLimiter.waitIfNeeded();
      } else if (check.reason === 'DAILY_REQUESTS_LIMIT_EXCEEDED') {
        // Try to switch to next model
        if (this.switchToNextModel()) {
          logger.info(`Daily requests limit reached for previous model, switched to ${this.modelName}`, {}, 'AIService');
          // Check again with new model
          const newCheck = rateLimiter.canMakeRequest();
          if (!newCheck.allowed && newCheck.reason === 'DAILY_REQUESTS_LIMIT_EXCEEDED') {
            throw new Error(
              `Daily requests limit (20/day) exceeded for all available models. ` +
              `Please wait until tomorrow or upgrade your plan.`
            );
          }
        } else {
          throw new Error(
            `Daily requests limit (20/day) exceeded for all available models. ` +
            `Please wait until tomorrow or upgrade your plan.`
          );
        }
      } else if (check.reason === 'DAILY_TOKEN_LIMIT_EXCEEDED') {
        throw new Error(
          `Daily token limit exceeded. Used: ${check.currentTokens}/${check.limit} tokens. ` +
          `Please wait until tomorrow or upgrade your plan.`
        );
      }
    }
  }

  /**
   * Retry request with exponential backoff for transient errors
   * @param {Function} requestFn - Function that makes the API request
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise} Request result
   */
  async retryWithBackoff(requestFn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Check if it's a quota exceeded error (429) - try switching model
        const isQuotaExceeded = 
          error.message?.includes('429') ||
          error.message?.includes('quota') ||
          error.message?.includes('exceeded your current quota');
        
        if (isQuotaExceeded && attempt === 0) {
          // Try switching to next model on first quota error
          if (this.switchToNextModel()) {
            logger.info(`Quota exceeded for previous model, switched to ${this.modelName}`, {}, 'AIService');
            // Retry immediately with new model
            continue;
          }
        }
        
        // Check if it's a retryable error (503, 429, or network errors)
        const isRetryable = 
          error.message?.includes('503') ||
          error.message?.includes('Service Unavailable') ||
          error.message?.includes('overloaded') ||
          error.message?.includes('429') ||
          error.message?.includes('rate limit') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ETIMEDOUT');
        
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 2^attempt seconds (2s, 4s, 8s)
        const waitTime = Math.pow(2, attempt) * 1000;
        logger.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitTime/1000}s...`, {
          error: error.message,
          attempt: attempt + 1
        }, 'AIService');
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError;
  }

  /**
   * Extract movie titles from HTML content using Gemini
   * @param {string} htmlContent - HTML content from cinema website
   * @param {string} cinemaName - Name of the cinema (for context)
   * @returns {Promise<Array>} Array of movie titles
   */
  async extractMoviesFromHTML(htmlContent, cinemaName = '') {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    // Check rate limits before making request
    await this.checkRateLimit();

    try {
      // Extract text content (simplified HTML)
      const textContent = this.simplifyHTML(htmlContent);

      const prompt = `Eres un asistente experto en extraer información de sitios web de cines.

Analiza el siguiente contenido HTML de la web de un cine${cinemaName ? ` llamado "${cinemaName}"` : ''} y extrae SOLO los títulos de las películas que están actualmente en cartelera.

IMPORTANTE:
- Extrae SOLO los títulos de las películas en cartelera
- NO incluyas información adicional como horarios, salas, precios, etc.
- Si un título aparece varias veces, inclúyelo solo una vez
- Devuelve los títulos en español si están disponibles, o en su idioma original
- Si no encuentras películas, devuelve un array vacío

Formato de respuesta (JSON):
{
  "movies": ["Título 1", "Título 2", "Título 3"]
}

Contenido HTML:
${textContent.substring(0, 15000)}`;

      // Retry with backoff for transient errors (503, 429, etc.)
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });
      
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsed;
      try {
        // Try to extract JSON from response (might have markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = JSON.parse(text);
        }
      } catch (parseError) {
        logger.warn('Failed to parse Gemini response as JSON, trying to extract movies from text', { 
          response: text 
        }, 'AIService');
        
        // Fallback: try to extract movie titles from plain text
        const movies = this.extractMoviesFromText(text);
        parsed = { movies };
      }

      const movies = parsed.movies || [];
      
      // Record the request (estimate tokens: input + output)
      const inputTokens = Math.ceil(textContent.length / 4); // Rough estimate: 1 token ≈ 4 chars
      const outputTokens = Math.ceil(text.length / 4);
      rateLimiter.recordRequest(inputTokens + outputTokens);
      
      logger.info(`Extracted ${movies.length} movies from ${cinemaName}`, { 
        cinemaName, 
        movieCount: movies.length 
      }, 'AIService');

      return movies;
    } catch (error) {
      logger.error('Failed to extract movies with AI', { error: error.message, cinemaName }, 'AIService');
      throw error;
    }
  }

  /**
   * Extract movie titles from plain text (fallback)
   */
  extractMoviesFromText(text) {
    const lines = text.split('\n');
    const movies = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for lines that might be movie titles (not too short, not too long, not empty)
      if (trimmed.length > 2 && trimmed.length < 100 && 
          !trimmed.startsWith('-') && 
          !trimmed.match(/^\d+/) &&
          !trimmed.includes('http')) {
        // Check if it looks like a movie title
        if (trimmed.match(/[A-Za-zÁÉÍÓÚáéíóúÑñ]/)) {
          movies.push(trimmed);
        }
      }
    }
    
    return movies.slice(0, 20); // Limit to 20 movies
  }

  /**
   * Simplify HTML to text for AI processing
   */
  simplifyHTML(html) {
    // Remove scripts, styles, comments
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    
    // Convert common HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    
    // Remove most HTML tags but keep structure
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit length to avoid token limits
    return text.substring(0, 15000);
  }

  /**
   * Match movie title with TMDB (using AI to find best match)
   * @param {string} title - Movie title from cinema website
   * @param {Array} tmdbMovies - Array of TMDB movie objects
   * @returns {Promise<Object|null>} Best matching TMDB movie or null
   */
  async matchMovieTitle(title, tmdbMovies = []) {
    if (!this.model || tmdbMovies.length === 0) {
      return null;
    }

    // Check rate limits before making request
    await this.checkRateLimit();

    try {
      const movieTitles = tmdbMovies.map(m => ({
        id: m.id,
        title: m.title,
        originalTitle: m.original_title,
        releaseDate: m.release_date
      }));

      const prompt = `Eres un asistente experto en hacer matching de títulos de películas.

Título a buscar: "${title}"

Lista de películas disponibles en TMDB:
${JSON.stringify(movieTitles.slice(0, 50), null, 2)}

Encuentra la película que mejor coincida con el título "${title}".
Considera variaciones en el título, títulos en diferentes idiomas, y títulos alternativos.

Responde SOLO con el ID de TMDB de la película que mejor coincida, o null si no hay coincidencia clara.

Formato de respuesta (JSON):
{
  "tmdbId": 12345
}

Si no hay coincidencia, responde:
{
  "tmdbId": null
}`;

      // Retry with backoff for transient errors (503, 429, etc.)
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });
      
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsed;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = JSON.parse(text);
        }
      } catch (parseError) {
        logger.warn(`Failed to parse Gemini matching response for "${title}"`, { 
          response: text 
        }, 'AIService');
        return null;
      }

      const matchedMovie = parsed.tmdbId ? tmdbMovies.find(m => m.id === parsed.tmdbId) : null;
      
      // Record the request (estimate tokens)
      const inputTokens = Math.ceil(prompt.length / 4);
      const outputTokens = Math.ceil(text.length / 4);
      rateLimiter.recordRequest(inputTokens + outputTokens);

      return matchedMovie;
    } catch (error) {
      logger.warn(`Failed to match movie title "${title}"`, { error: error.message }, 'AIService');
      return null;
    }
  }
}

module.exports = new AIService();
