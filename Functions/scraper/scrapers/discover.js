/**
 * Discover Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

// Discover it quarterly categories for 2025 (example - should be updated each year)
const DISCOVER_ROTATING_2025 = {
  Q1: ['grocery', 'fitness'],
  Q2: ['gas', 'homeImprovement', 'evCharging'],
  Q3: ['dining', 'drugstore'],
  Q4: ['amazon', 'walmart', 'target', 'onlineShopping']
};

const DISCOVER_CARDS = [
  {
    name: 'Discover it Cash Back',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'discover',
    baseReward: 1,
    categories: [],
    rotating: {
      multiplier: 5,
      cap: 1500,
      capPeriod: 'quarterly',
      activationRequired: true
    },
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/background/bg-cards-itcards-388-350.png',
    imageColor: '#FF6600'
  },
  {
    name: 'Discover it Chrome',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'discover',
    baseReward: 1,
    categories: [
      { category: 'gas', multiplier: 2, cap: 1000, capPeriod: 'quarterly' },
      { category: 'dining', multiplier: 2, cap: 1000, capPeriod: 'quarterly' }
    ],
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/cardart/cardart-cash-chrome-platinum-620-382.png',
    imageColor: '#868686'
  },
  {
    name: 'Discover it Miles',
    annualFee: 0,
    rewardType: 'miles',
    network: 'discover',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/cardart/cardart-travel-beachcard-620-382.png',
    imageColor: '#1E90FF'
  },
  {
    name: 'Discover it Student Cash Back',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'discover',
    baseReward: 1,
    categories: [],
    rotating: {
      multiplier: 5,
      cap: 1500,
      capPeriod: 'quarterly',
      activationRequired: true
    },
    note: 'Student version of Discover it Cash Back',
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/cardart/cardart-student-iridescent-390-243.png',
    imageColor: '#FF6600'
  }
];

/**
 * Discover Scraper class - extends BaseScraper
 */
class DiscoverScraper extends BaseScraper {
  constructor() {
    const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
    const currentYear = new Date().getFullYear();

    // Pre-format fallback cards with rotating categories
    const fallbackCards = DISCOVER_CARDS.map(card => {
      const formatted = formatCard('Discover', card);
      if (card.rotating) {
        const quarterKey = `Q${currentQuarter}`;
        const rawCategories = DISCOVER_ROTATING_2025[quarterKey] || ['grocery', 'gas'];
        const mappedCategories = rawCategories.map(cat => mapCategory(cat)).filter(Boolean);
        formatted.rotatingCategories = [{
          quarter: currentQuarter,
          year: currentYear,
          categories: mappedCategories,
          multiplier: card.rotating.multiplier,
          isPercentage: true,
          cap: card.rotating.cap,
          activationRequired: card.rotating.activationRequired
        }];
      }
      return formatted;
    });

    super('Discover', {
      fallbackCards,
      baseUrl: 'https://www.discover.com',
      timeout: 45000
    });

    this.cardPages = [
      '/credit-cards/cash-back.html',
      '/credit-cards/chrome.html',
      '/credit-cards/miles.html',
      '/credit-cards/student-cash-back.html'
    ];
  }

  async scrapeLive() {
    await this.launchBrowser();
    const page = await this.browser.newPage();
    const scrapedCards = [];

    for (let i = 0; i < this.cardPages.length; i++) {
      const cardPath = this.cardPages[i];
      const url = `${this.baseUrl}${cardPath}`;
      console.log(`    📋 抓取卡片 ${i + 1}/${this.cardPages.length}: ${cardPath.split('/').pop()}`);

      try {
        await this.randomDelay(1500, 3000);
        const success = await this.safeGoto(page, url);
        if (!success) continue;

        await this.randomDelay(1500, 2500);

        const cardData = await page.evaluate(() => {
          const data = {};
          const h1 = document.querySelector('h1');
          if (h1) data.name = h1.textContent.trim().replace(/®|™|℠/g, '').trim();

          // Discover cards are $0 annual fee
          data.annualFee = 0;

          const cardImg = document.querySelector('img[src*="card"], img[alt*="card"]');
          if (cardImg) data.imageUrl = cardImg.src;

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'Discover' });
        }
      } catch (error) {
        console.log(`      ⚠️  無法抓取: ${error.message}`);
      }
    }

    return scrapedCards;
  }

  mergeWithFallback(liveData) {
    const merged = [...this.fallbackCards];
    for (const liveCard of liveData) {
      const liveNameLower = liveCard.name.toLowerCase();
      const existingIndex = merged.findIndex(c =>
        c.name.toLowerCase().includes(liveNameLower) || liveNameLower.includes(c.name.toLowerCase())
      );
      if (existingIndex >= 0) {
        const existing = merged[existingIndex];
        merged[existingIndex] = {
          ...existing,
          ...(liveCard.imageUrl && { imageURL: liveCard.imageUrl }),
          ...(liveCard.applicationUrl && { applicationUrl: liveCard.applicationUrl })
        };
        console.log(`      ✅ 更新: ${existing.name}`);
      }
    }
    return merged;
  }
}

async function scrapeDiscover() {
  const scraper = new DiscoverScraper();
  return await scraper.scrape();
}

function formatCard(issuer, cardData) {
  // Map categories to iOS SpendingCategory enum values
  const categoryRewards = (cardData.categories || [])
    .map(cat => {
      const mappedCategory = mapCategory(cat.category);
      if (!mappedCategory) {
        console.warn(`  ⚠️  Unknown category '${cat.category}' in ${cardData.name}, skipping`);
        return null;
      }
      return {
        category: mappedCategory,
        multiplier: cat.multiplier,
        isPercentage: cardData.rewardType === 'cashback',
        cap: cat.cap || null,
        capPeriod: cat.capPeriod || null
      };
    })
    .filter(Boolean);

  return {
    id: generateCardId(issuer, cardData.name),
    name: cardData.name,
    issuer: issuer,
    network: cardData.network || 'discover',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback' || cardData.rewardType === 'miles',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#FF6600',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Discover Scraper...\n');
  scrapeDiscover()
    .then(cards => {
      console.log(`\n✅ Total cards: ${cards.length}`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee} annual fee`);
        if (card.rotatingCategories) {
          console.log(`    Rotating: ${card.rotatingCategories[0].categories.join(', ')}`);
        }
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeDiscover;
