/**
 * Citi Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const CITI_CARDS = [
  {
    name: 'Citi Double Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [],
    imageURL: 'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png',
    imageColor: '#003B70'
  },
  {
    name: 'Citi Custom Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['dining', 'grocery', 'gas', 'travel', 'drugstore', 'homeImprovement', 'fitness', 'streaming', 'transit'],
      multiplier: 5,
      cap: 500,
      capPeriod: 'monthly'
    },
    imageURL: 'https://www.citi.com/CRD/images/citi-custom-cash/citi-custom-cash_222x140.png',
    imageColor: '#00BCD4'
  },
  {
    name: 'Citi Premier',
    annualFee: 95,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-premier/citi-premier_222x140.png',
    imageColor: '#002D62'
  },
  {
    name: 'Citi Strata Premier',
    annualFee: 95,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 10, note: 'hotels through thankyou.com' },
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-strata-premier/citi-strata-premier_222x140.png',
    imageColor: '#1A365D'
  },
  {
    name: 'Citi Rewards+',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-rewards-plus/citi-rewards-plus_222x140.png',
    imageColor: '#5C4A9E'
  },
  {
    name: 'Citi Diamond Preferred',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [],
    note: '0% intro APR card, no bonus categories',
    imageURL: 'https://www.citi.com/CRD/images/citi-diamond-preferred/citi-diamond-preferred_222x140.png',
    imageColor: '#4B6584'
  },
  {
    name: 'Costco Anywhere Visa',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'gas', multiplier: 4, cap: 7000, capPeriod: 'yearly' },
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'wholesale', multiplier: 2, note: 'Costco and Costco.com' }
    ],
    note: 'Requires Costco membership',
    imageURL: 'https://www.citi.com/CRD/images/costco-anywhere/costco-anywhere_222x140.png',
    imageColor: '#E21836'
  },
  {
    name: 'Citi AAdvantage Platinum Select',
    annualFee: 99,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'americanairlines', multiplier: 2, note: 'American Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-aadvantage-platinum/citi-aadvantage-platinum_222x140.png',
    imageColor: '#0078D2'
  }
];

/**
 * Citi Scraper class - extends BaseScraper
 */
class CitiScraper extends BaseScraper {
  constructor() {
    super('Citi', {
      fallbackCards: CITI_CARDS.map(card => formatCard('Citi', card)),
      baseUrl: 'https://www.citi.com',
      timeout: 45000
    });

    this.cardPages = [
      '/credit-cards/citi-double-cash-credit-card',
      '/credit-cards/citi-custom-cash-credit-card',
      '/credit-cards/citi-premier-credit-card',
      '/credit-cards/citi-strata-premier-credit-card',
      '/credit-cards/citi-rewards-plus-credit-card'
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

          const allText = document.body.innerText;
          const feeMatch = allText.match(/\$(\d+)\s*annual\s*fee/i);
          if (feeMatch) data.annualFee = parseInt(feeMatch[1], 10);
          if (allText.match(/\$0\s*annual\s*fee/i) || allText.match(/no\s*annual\s*fee/i)) {
            data.annualFee = 0;
          }

          const cardImg = document.querySelector('img[src*="card"], img[alt*="card"]');
          if (cardImg) data.imageUrl = cardImg.src;

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'Citi' });
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
          ...(liveCard.annualFee !== undefined && { annualFee: liveCard.annualFee }),
          ...(liveCard.imageUrl && { imageURL: liveCard.imageUrl }),
          ...(liveCard.applicationUrl && { applicationUrl: liveCard.applicationUrl })
        };
        console.log(`      ✅ 更新: ${existing.name}`);
      }
    }
    return merged;
  }
}

async function scrapeCiti() {
  const scraper = new CitiScraper();
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

  // Map selectableConfig categories if present
  let selectableConfig = null;
  if (cardData.selectableConfig) {
    const mappedAvailableCategories = cardData.selectableConfig.availableCategories
      .map(cat => mapCategory(cat))
      .filter(Boolean);

    selectableConfig = {
      maxSelections: cardData.selectableConfig.maxSelections,
      availableCategories: mappedAvailableCategories,
      multiplier: cardData.selectableConfig.multiplier,
      isPercentage: cardData.rewardType === 'cashback',
      cap: cardData.selectableConfig.cap || null,
      capPeriod: cardData.selectableConfig.capPeriod || null
    };
  }

  return {
    id: generateCardId(issuer, cardData.name),
    name: cardData.name,
    issuer: issuer,
    network: cardData.network || 'mastercard',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: selectableConfig,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#003B70',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Citi Scraper...\n');
  scrapeCiti()
    .then(cards => {
      console.log(`\n✅ Total cards: ${cards.length}`);
      cards.slice(0, 3).forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee} annual fee`);
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeCiti;
