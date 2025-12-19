/**
 * Capital One Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const CAPITALONE_CARDS = [
  {
    name: 'Capital One Savor',
    annualFee: 95,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4 },
      { category: 'entertainment', multiplier: 4 },
      { category: 'streaming', multiplier: 4 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savor-background.png',
    imageColor: '#ED1B24'
  },
  {
    name: 'Capital One SavorOne',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'entertainment', multiplier: 3 },
      { category: 'streaming', multiplier: 3 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savorone-background.png',
    imageColor: '#C41230'
  },
  {
    name: 'Capital One Venture X',
    annualFee: 395,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 10, note: 'hotels and car rentals booked through Capital One Travel' },
      { category: 'travelPortalFlights', multiplier: 5, note: 'flights booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venturex-background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Capital One Venture',
    annualFee: 95,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels and car rentals booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venture-background.png',
    imageColor: '#004977'
  },
  {
    name: 'Capital One VentureOne',
    annualFee: 0,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1.25,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/ventureone-background.png',
    imageColor: '#0066A1'
  },
  {
    name: 'Capital One Quicksilver',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/quicksilver-background.png',
    imageColor: '#004879'
  },
  {
    name: 'Capital One Platinum',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 0,
    categories: [],
    note: 'Credit building card, no rewards',
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/platinum-background.png',
    imageColor: '#5C6BC0'
  },
  {
    name: 'Capital One Spark Cash Plus',
    annualFee: 150,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels and car rentals booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/spark-cash-plus-background.png',
    imageColor: '#2E7D32'
  }
];

/**
 * Capital One Scraper class - extends BaseScraper
 */
class CapitalOneScraper extends BaseScraper {
  constructor() {
    super('Capital One', {
      fallbackCards: CAPITALONE_CARDS.map(card => formatCard('Capital One', card)),
      baseUrl: 'https://www.capitalone.com',
      timeout: 45000
    });

    this.cardPages = [
      '/credit-cards/savor-dining-rewards/',
      '/credit-cards/savorone-dining-rewards/',
      '/credit-cards/venture-x/',
      '/credit-cards/venture/',
      '/credit-cards/ventureone/',
      '/credit-cards/quicksilver/'
    ];
  }

  async scrapeLive() {
    await this.launchBrowser();
    const page = await this.browser.newPage();
    const scrapedCards = [];

    for (let i = 0; i < this.cardPages.length; i++) {
      const cardPath = this.cardPages[i];
      const url = `${this.baseUrl}${cardPath}`;
      console.log(`    📋 抓取卡片 ${i + 1}/${this.cardPages.length}: ${cardPath.split('/').filter(Boolean).pop()}`);

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
          if (allText.includes('$0 annual fee') || allText.match(/no\s*annual\s*fee/i)) {
            data.annualFee = 0;
          }

          const cardImg = document.querySelector('img[src*="card"], img[alt*="card"]');
          if (cardImg) data.imageUrl = cardImg.src;

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'Capital One' });
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

async function scrapeCapitalOne() {
  const scraper = new CapitalOneScraper();
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
    network: cardData.network || 'mastercard',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#004977',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Capital One Scraper...\n');
  scrapeCapitalOne()
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

module.exports = scrapeCapitalOne;
