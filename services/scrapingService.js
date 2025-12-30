/**
 * Scraping Service
 * Scrapes cinema websites to extract HTML content
 */

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const logger = require('../utils/logger') || console;

class ScrapingService {
  constructor() {
    this.browser = null;
  }

  /**
   * Initialize browser instance
   */
  async initBrowser() {
    if (!this.browser) {
      const launchOptions = {
        headless: 'new', // Use new headless mode to avoid deprecation warning
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      };

      // Usar Chromium del sistema si está configurado (Fly.io, Docker, etc.)
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }

      this.browser = await puppeteer.launch(launchOptions);
    }
    return this.browser;
  }

  /**
   * Close browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Scrape a cinema website
   * @param {string} url - Cinema website URL
   * @param {Object} options - Scraping options
   * @returns {Promise<string>} HTML content
   */
  async scrapeCinemaWebsite(url, options = {}) {
    const { usePuppeteer = true, waitForSelector = null, timeout = 30000 } = options;

    try {
      if (usePuppeteer) {
        return await this.scrapeWithPuppeteer(url, { waitForSelector, timeout });
      } else {
        return await this.scrapeWithFetch(url, { timeout });
      }
    } catch (error) {
      logger.error(`Failed to scrape ${url}`, error, 'ScrapingService');
      throw error;
    }
  }

  /**
   * Scrape using Puppeteer (for JavaScript-rendered content)
   */
  async scrapeWithPuppeteer(url, options = {}) {
    const { waitForSelector = null, timeout = 30000 } = options;
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Set user agent to avoid detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Navigate to URL
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout
      });

      // Wait for specific selector if provided
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 }).catch(() => {
          // Continue even if selector not found
        });
      }

      // Wait a bit for dynamic content
      await page.waitForTimeout(2000);

      // Get page content
      const content = await page.content();

      return content;
    } finally {
      await page.close();
    }
  }

  /**
   * Scrape using fetch (for static HTML)
   */
  async scrapeWithFetch(url, options = {}) {
    const { timeout = 30000 } = options;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      },
      timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  }

  /**
   * Extract text content from HTML (removes scripts, styles, etc.)
   */
  extractTextContent(html) {
    // Remove script and style elements
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
    
    // Remove HTML tags but keep text
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  /**
   * Get relevant section of HTML (around movie listings)
   */
  extractRelevantSection(html, keywords = ['película', 'cartelera', 'cine', 'movie', 'film']) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    
    // Try to find sections containing movie-related keywords
    let relevantContent = '';
    
    // Look for common movie listing containers
    const selectors = [
      'section',
      'div[class*="movie"]',
      'div[class*="pelicula"]',
      'div[class*="cartelera"]',
      'div[class*="film"]',
      'main',
      'article'
    ];

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const text = $(elem).text().toLowerCase();
        if (keywords.some(keyword => text.includes(keyword))) {
          relevantContent += $(elem).html() + '\n';
        }
      });
    }

    // If no relevant section found, return main content
    if (!relevantContent) {
      relevantContent = $('main').html() || $('body').html() || html;
    }

    return relevantContent || html;
  }
}

module.exports = new ScrapingService();

