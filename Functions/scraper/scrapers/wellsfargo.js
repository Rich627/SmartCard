/**
 * Wells Fargo Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const WELLSFARGO_CARDS = [
  {
    name: 'Wells Fargo Active Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/ActiveCash/WF_ActiveCash_VS_Collateral_Front_RGB.png',
    imageColor: '#D71E28'
  },
  {
    name: 'Wells Fargo Autograph',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'transit', multiplier: 3 },
      { category: 'streaming', multiplier: 3 },
      { category: 'phone', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/Autograph/Autograph-No-Fee-Card-RGB_d.png',
    imageColor: '#FFCD00'
  },
  {
    name: 'Wells Fargo Autograph Journey',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels through Wells Fargo Travel' },
      { category: 'travel', multiplier: 4, note: 'airlines, hotels, car rentals' },
      { category: 'dining', multiplier: 3 },
      { category: 'transit', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/AutographJourney/WF_Autograph_Journey_Card_d.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Wells Fargo Reflect',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 0,
    categories: [],
    note: 'Balance transfer card with 0% intro APR, no rewards',
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/Reflect/Reflect_homepage.png',
    imageColor: '#5DADE2'
  },
  {
    name: 'Wells Fargo Bilt',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 2 },
      { category: 'other', multiplier: 1, note: 'rent payments with no fee' }
    ],
    note: 'Earn points on rent payments',
    imageURL: 'https://static.biltrewards.com/assets/seo/bilt_card2_coming_soon_seo.jpg',
    imageColor: '#000000'
  }
];

/**
 * Wells Fargo Scraper class - extends BaseScraper
 */
class WellsFargoScraper extends BaseScraper {
  constructor() {
    super('Wells Fargo', {
      fallbackCards: WELLSFARGO_CARDS.map(card => formatCard('Wells Fargo', card)),
      baseUrl: 'https://creditcards.wellsfargo.com',
      timeout: 45000
    });

    this.cardPages = [
      '/active-cash-credit-card',
      '/autograph-visa-credit-card',
      '/autograph-journey-visa-credit-card',
      '/reflect-visa-credit-card'
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

          const cardImg = document.querySelector('img[src*="CardArt"], img[src*="card"]');
          if (cardImg) data.imageUrl = cardImg.src;

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({ ...cardData, applicationUrl: url, issuer: 'Wells Fargo' });
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

async function scrapeWellsFargo() {
  const scraper = new WellsFargoScraper();
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
    network: cardData.network || 'visa',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#D71E28',
    imageURL: cardData.imageURL || null
  };
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Wells Fargo Scraper...\n');
  scrapeWellsFargo()
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

module.exports = scrapeWellsFargo;
