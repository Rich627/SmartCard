/**
 * Bank of America Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const BOFA_CARDS = [
  {
    name: 'Bank of America Customized Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'onlineShopping', multiplier: 2 }
    ],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['gas', 'onlineShopping', 'dining', 'travel', 'drugstore', 'homeImprovement'],
      multiplier: 3,
      cap: 2500,
      capPeriod: 'quarterly'
    },
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8ckn_cshsigcm_v_250x158.png',
    imageColor: '#C41230'
  },
  {
    name: 'Bank of America Premium Rewards',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1.5,
    categories: [
      { category: 'travel', multiplier: 2 },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8CAL_prmsigcm_v_250_158.png',
    imageColor: '#012169'
  },
  {
    name: 'Bank of America Premium Rewards Elite',
    annualFee: 550,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1.5,
    categories: [
      { category: 'travel', multiplier: 2 },
      { category: 'dining', multiplier: 2 }
    ],
    note: 'Enhanced version with more travel benefits',
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8cud_premrewelite_v_250x158.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Bank of America Travel Rewards',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8blm_trvsigcm_v_250x158.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Bank of America Unlimited Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8cty_cshsigcm_v_250x157.png',
    imageColor: '#C41230'
  },
  {
    name: 'Alaska Airlines Visa',
    annualFee: 95,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'alaska', multiplier: 3, note: 'Alaska Airlines purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'streaming', multiplier: 2 },
      { category: 'transit', multiplier: 2 },
      { category: 'delivery', multiplier: 2, note: 'eligible delivery services' }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/1bbt_sigcm_v_atmos_ascent_250.png',
    imageColor: '#01426A'
  }
];

/**
 * Bank of America Scraper class - extends BaseScraper
 */
class BofaScraper extends BaseScraper {
  constructor() {
    super('Bank of America', {
      fallbackCards: BOFA_CARDS.map(card => formatCard('Bank of America', card)),
      baseUrl: 'https://www.bankofamerica.com',
      timeout: 45000
    });

    this.cardPages = [
      '/credit-cards/products/cash-back-credit-card/',
      '/credit-cards/products/premium-rewards-credit-card/',
      '/credit-cards/products/travel-rewards-credit-card/',
      '/credit-cards/products/unlimited-cash-rewards-credit-card/',
      '/credit-cards/products/alaska-airlines-credit-card/'
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
          if (allText.match(/\$0\s*annual\s*fee/i) || allText.match(/no\s*annual\s*fee/i)) {
            data.annualFee = 0;
          }

          const cardImg = document.querySelector('img[src*="card"], img[alt*="card"]');
          if (cardImg) data.imageUrl = cardImg.src;

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'Bank of America' });
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

async function scrapeBofa() {
  const scraper = new BofaScraper();
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
    imageColor: cardData.imageColor || '#C41230',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Bank of America Scraper...\n');
  scrapeBofa()
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

module.exports = scrapeBofa;
