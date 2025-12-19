/**
 * BaseScraper - Base class for credit card scrapers
 *
 * Provides common functionality:
 * - Puppeteer with stealth plugin to avoid detection
 * - Fallback to cached data if scraping fails
 * - Random delays to avoid rate limiting
 * - Merge strategy for live + cached data
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { mapCategory, generateCardId } = require('./categories');

// Apply stealth plugin
puppeteer.use(StealthPlugin());

class BaseScraper {
  /**
   * @param {string} issuerName - Name of the card issuer (e.g., 'Chase', 'Amex')
   * @param {Object} options - Configuration options
   * @param {Array} options.fallbackCards - Cached cards to use if scraping fails
   * @param {string} options.baseUrl - Base URL for the issuer's website
   * @param {number} options.timeout - Page timeout in milliseconds
   * @param {boolean} options.headless - Run browser in headless mode
   */
  constructor(issuerName, options = {}) {
    this.issuerName = issuerName;
    this.fallbackCards = options.fallbackCards || [];
    this.baseUrl = options.baseUrl || '';
    this.timeout = options.timeout || 30000;
    this.headless = options.headless !== false; // default true
    this.browser = null;
  }

  /**
   * Launch a Puppeteer browser instance with stealth settings
   */
  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: this.headless ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    return this.browser;
  }

  /**
   * Close the browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Main scrape method - tries live scraping, falls back to cached data
   * @returns {Array} Array of card objects
   */
  async scrape() {
    try {
      console.log(`  🌐 嘗試從 ${this.issuerName} 網站抓取...`);
      const liveData = await this.scrapeLive();

      if (liveData && liveData.length > 0) {
        console.log(`  ✅ 成功抓取 ${liveData.length} 張卡片`);
        return this.mergeWithFallback(liveData);
      }

      console.log(`  ⚠️  抓取到 0 張卡片，使用快取資料`);
    } catch (error) {
      console.log(`  ⚠️  爬蟲失敗: ${error.message}`);
    } finally {
      await this.closeBrowser();
    }

    console.log(`  📦 使用快取資料 (${this.fallbackCards.length} 張卡片)`);
    return this.fallbackCards;
  }

  /**
   * Override this method in subclasses to implement actual scraping
   * @returns {Array} Array of scraped card data
   */
  async scrapeLive() {
    throw new Error('scrapeLive() must be implemented by subclass');
  }

  /**
   * Merge live scraped data with fallback/cached data
   * Live data updates matching cards, new cards are added
   *
   * @param {Array} liveData - Freshly scraped card data
   * @returns {Array} Merged card array
   */
  mergeWithFallback(liveData) {
    const merged = [...this.fallbackCards];

    for (const liveCard of liveData) {
      const existingIndex = merged.findIndex(c =>
        c.name === liveCard.name || c.id === liveCard.id
      );

      if (existingIndex >= 0) {
        // Update existing card with live data (live takes precedence)
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...liveCard,
          // Preserve certain fields from fallback if not in live
          imageUrl: liveCard.imageUrl || merged[existingIndex].imageUrl
        };
      } else {
        // Add new card not in fallback
        merged.push(liveCard);
      }
    }

    return merged;
  }

  /**
   * Random delay to avoid rate limiting / detection
   * @param {number} min - Minimum delay in ms
   * @param {number} max - Maximum delay in ms
   */
  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Wait for navigation or network idle
   * @param {Object} page - Puppeteer page object
   */
  async waitForLoad(page) {
    await page.waitForNetworkIdle({ idleTime: 500, timeout: this.timeout });
  }

  /**
   * Safe page.goto with error handling
   * @param {Object} page - Puppeteer page object
   * @param {string} url - URL to navigate to
   */
  async safeGoto(page, url) {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: this.timeout
      });
      return true;
    } catch (error) {
      console.log(`    ⚠️  載入失敗: ${url} - ${error.message}`);
      return false;
    }
  }

  /**
   * Extract text content safely from an element
   * @param {Object} page - Puppeteer page object
   * @param {string} selector - CSS selector
   * @returns {string|null} Text content or null
   */
  async extractText(page, selector) {
    try {
      const element = await page.$(selector);
      if (!element) return null;
      return await page.evaluate(el => el.textContent.trim(), element);
    } catch {
      return null;
    }
  }

  /**
   * Extract all matching elements' text
   * @param {Object} page - Puppeteer page object
   * @param {string} selector - CSS selector
   * @returns {Array<string>} Array of text contents
   */
  async extractAllText(page, selector) {
    try {
      return await page.$$eval(selector, elements =>
        elements.map(el => el.textContent.trim())
      );
    } catch {
      return [];
    }
  }

  /**
   * Format a card object with standard fields
   * @param {Object} cardData - Raw card data
   * @returns {Object} Formatted card object
   */
  formatCard(cardData) {
    const id = generateCardId(cardData.issuer || this.issuerName, cardData.name);

    // Map categories to valid iOS categories
    const categoryRewards = (cardData.categories || [])
      .map(cat => {
        const mappedCategory = mapCategory(cat.category);
        if (!mappedCategory) {
          console.warn(`    ⚠️  Unknown category '${cat.category}' in ${cardData.name}, skipping`);
          return null;
        }
        return {
          category: mappedCategory,
          multiplier: cat.multiplier,
          ...(cat.cap && { cap: cat.cap }),
          ...(cat.capPeriod && { capPeriod: cat.capPeriod })
        };
      })
      .filter(Boolean);

    return {
      id,
      name: cardData.name,
      issuer: cardData.issuer || this.issuerName,
      network: cardData.network || this.getDefaultNetwork(),
      rewardType: cardData.rewardType || 'points',
      annualFee: cardData.annualFee || 0,
      baseReward: cardData.baseReward || 1,
      categoryRewards,
      signupBonus: cardData.signupBonus || null,
      imageUrl: cardData.imageUrl || null,
      applicationUrl: cardData.applicationUrl || null,
      ...(cardData.rotatingCategories && { rotatingCategories: cardData.rotatingCategories }),
      ...(cardData.selectableCategories && { selectableCategories: cardData.selectableCategories })
    };
  }

  /**
   * Get default network for issuer
   */
  getDefaultNetwork() {
    const issuerNetworks = {
      'American Express': 'amex',
      'Amex': 'amex',
      'Discover': 'discover'
    };
    return issuerNetworks[this.issuerName] || 'visa';
  }
}

module.exports = BaseScraper;
