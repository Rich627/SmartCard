/**
 * SmartCard Credit Card Rewards Scraper
 *
 * This script scrapes credit card reward information from official issuer websites
 * and aggregates the data into a unified format for the SmartCard app.
 *
 * Usage:
 * - npm run scrape        # Run all scrapers
 * - npm run scrape:chase  # Run Chase scraper only
 * - npm run upload        # Upload scraped data to Firestore
 * - npm run full          # Scrape and upload
 */

const fs = require('fs');
const path = require('path');

// Import individual scrapers
const chaseScraper = require('./scrapers/chase');
const amexScraper = require('./scrapers/amex');
const citiScraper = require('./scrapers/citi');
const capitaloneScraper = require('./scrapers/capitalone');
const discoverScraper = require('./scrapers/discover');
const bofaScraper = require('./scrapers/bofa');
const wellsfargoScraper = require('./scrapers/wellsfargo');
const usbankScraper = require('./scrapers/usbank');

const OUTPUT_FILE = path.join(__dirname, 'scraped-cards.json');

async function runAllScrapers() {
  console.log('🚀 Starting SmartCard Credit Card Scraper...\n');

  const allCards = [];
  const errors = [];

  const scrapers = [
    { name: 'Chase', fn: chaseScraper },
    { name: 'American Express', fn: amexScraper },
    { name: 'Citi', fn: citiScraper },
    { name: 'Capital One', fn: capitaloneScraper },
    { name: 'Discover', fn: discoverScraper },
    { name: 'Bank of America', fn: bofaScraper },
    { name: 'Wells Fargo', fn: wellsfargoScraper },
    { name: 'US Bank', fn: usbankScraper },
  ];

  for (const scraper of scrapers) {
    console.log(`\n📋 Scraping ${scraper.name}...`);
    try {
      const cards = await scraper.fn();
      console.log(`   ✅ Found ${cards.length} cards from ${scraper.name}`);
      allCards.push(...cards);
    } catch (error) {
      console.error(`   ❌ Error scraping ${scraper.name}: ${error.message}`);
      errors.push({ issuer: scraper.name, error: error.message });
    }
  }

  // Save results
  const result = {
    scrapedAt: new Date().toISOString(),
    totalCards: allCards.length,
    errors: errors,
    cards: allCards
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Scraping Complete!`);
  console.log(`   Total cards: ${allCards.length}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Output saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(50));

  return result;
}

// Run if called directly
if (require.main === module) {
  runAllScrapers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllScrapers };
