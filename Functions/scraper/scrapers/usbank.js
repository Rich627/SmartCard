/**
 * US Bank Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const USBANK_CARDS = [
  {
    name: 'US Bank Altitude Go',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4 },
      { category: 'grocery', multiplier: 2 },
      { category: 'streaming', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'evCharging', multiplier: 2 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/illustrations/card-art/credit-cards/altitude-go-visa-signature-credit-card.png',
    imageColor: '#00529B'
  },
  {
    name: 'US Bank Altitude Connect',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'travel and hotels booked through Altitude Rewards' },
      { category: 'gas', multiplier: 4 },
      { category: 'evCharging', multiplier: 4 },
      { category: 'streaming', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-altitude-connect-consumer.png',
    imageColor: '#0072CE'
  },
  {
    name: 'US Bank Altitude Reserve',
    annualFee: 400,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'travel and mobile wallet purchases' },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-altitude-reserve-visa-infinite-benefits-vertical-card-art.png',
    imageColor: '#002855'
  },
  {
    name: 'US Bank Cash+',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [],
    selectableConfig: {
      maxSelections: 2,
      availableCategories: ['gas', 'grocery', 'dining', 'homeImprovement', 'utilities', 'phone', 'fitness', 'streaming', 'transit', 'electronics'],
      multiplier: 5,
      cap: 2000,
      capPeriod: 'quarterly'
    },
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-cash-plus-signature-lg.png',
    imageColor: '#0047AB'
  },
  {
    name: 'US Bank Smartly',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    note: 'Flat 2% on everything',
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-bank-smartly-card-art.png',
    imageColor: '#00A9E0'
  }
];

/**
 * US Bank Scraper class - extends BaseScraper
 */
class USBankScraper extends BaseScraper {
  constructor() {
    super('US Bank', {
      fallbackCards: USBANK_CARDS.map(card => formatCard('US Bank', card)),
      baseUrl: 'https://www.usbank.com',
      timeout: 45000
    });

    this.cardPages = [
      '/credit-cards/altitude-go-visa-signature-credit-card.html',
      '/credit-cards/altitude-connect-visa-signature-credit-card.html',
      '/credit-cards/altitude-reserve-visa-infinite-credit-card.html',
      '/credit-cards/cash-plus-visa-signature-credit-card.html',
      '/credit-cards/smartly-visa-signature-credit-card.html'
    ];
  }

  async scrapeLive() {
    await this.launchBrowser();
    const page = await this.browser.newPage();
    const scrapedCards = [];

    for (let i = 0; i < this.cardPages.length; i++) {
      const cardPath = this.cardPages[i];
      const url = `${this.baseUrl}${cardPath}`;
      console.log(`    📋 抓取卡片 ${i + 1}/${this.cardPages.length}: ${cardPath.split('/').pop().replace('.html', '')}`);

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
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'US Bank' });
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

async function scrapeUsBank() {
  const scraper = new USBankScraper();
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
    network: cardData.network || 'visa',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: selectableConfig,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#00529B',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing US Bank Scraper...\n');
  scrapeUsBank()
    .then(cards => {
      console.log(`\n✅ Total cards: ${cards.length}`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee} annual fee`);
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeUsBank;
