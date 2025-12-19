/**
 * American Express Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const AMEX_CARDS = [
  // ========== PERSONAL CHARGE CARDS ==========
  {
    name: 'American Express Platinum Card',
    annualFee: 695,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'flights and prepaid hotels through Amex Travel' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-card.png',
    imageColor: '#E5E4E2'
  },
  {
    name: 'American Express Gold Card',
    annualFee: 325,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4, cap: 50000, capPeriod: 'yearly' },
      { category: 'grocery', multiplier: 4, cap: 25000, capPeriod: 'yearly' },
      { category: 'airlines', multiplier: 3, note: 'flights booked directly with airlines or amextravel.com' },
      { category: 'travelPortal', multiplier: 2, note: 'prepaid hotels through Amex Travel' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png',
    imageColor: '#B8860B'
  },
  {
    name: 'American Express Green Card',
    annualFee: 150,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3 },
      { category: 'transit', multiplier: 3 },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/green-card.png',
    imageColor: '#228B22'
  },
  {
    name: 'Centurion Card',
    annualFee: 5000,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 1.5 },
      { category: 'dining', multiplier: 1.5 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000070_480x304_straight_withname.png',
    imageColor: '#1C1C1C'
  },

  // ========== BLUE CASH SERIES ==========
  {
    name: 'Blue Cash Preferred',
    annualFee: 95,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 6, cap: 6000, capPeriod: 'yearly' },
      { category: 'streaming', multiplier: 6 },
      { category: 'gas', multiplier: 3 },
      { category: 'transit', multiplier: 3 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-preferred.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Blue Cash Everyday',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 3, cap: 6000, capPeriod: 'yearly' },
      { category: 'gas', multiplier: 3 },
      { category: 'onlineShopping', multiplier: 3 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-everyday.png',
    imageColor: '#5DADE2'
  },

  // ========== AMEX EVERYDAY SERIES ==========
  {
    name: 'Amex EveryDay',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/amex-everyday.png',
    imageColor: '#9B59B6'
  },
  {
    name: 'Amex EveryDay Preferred',
    annualFee: 95,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/amex-everyday.png',
    imageColor: '#8E44AD'
  },

  // ========== DELTA SKYMILES ==========
  {
    name: 'Delta SkyMiles Blue',
    annualFee: 0,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 2, note: 'Delta purchases' },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-blue.png',
    imageColor: '#003366'
  },
  {
    name: 'Delta SkyMiles Gold',
    annualFee: 150,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 2, note: 'Delta purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-delta-skymiles.png',
    imageColor: '#C41E3A'
  },
  {
    name: 'Delta SkyMiles Platinum',
    annualFee: 350,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 3, note: 'Delta purchases' },
      { category: 'hotels', multiplier: 2 },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-delta-skymiles.png',
    imageColor: '#0A2647'
  },
  {
    name: 'Delta SkyMiles Reserve',
    annualFee: 650,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 3, note: 'Delta purchases' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-reserve.png',
    imageColor: '#1E3A5F'
  },
  {
    name: 'Delta SkyMiles Gold Business',
    annualFee: 150,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 2, note: 'Delta purchases' },
      { category: 'shipping', multiplier: 2 },
      { category: 'advertising', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000086_480x304_straight_withname.png',
    imageColor: '#B8860B'
  },
  {
    name: 'Delta SkyMiles Platinum Business',
    annualFee: 350,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 3, note: 'Delta purchases' },
      { category: 'hotels', multiplier: 1.5 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000087_480x304_straight_withname.png',
    imageColor: '#4A5568'
  },
  {
    name: 'Delta SkyMiles Reserve Business',
    annualFee: 650,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'delta', multiplier: 3, note: 'Delta purchases' }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000088_480x304_straight_withname.png',
    imageColor: '#1A365D'
  },

  // ========== HILTON HONORS ==========
  {
    name: 'Hilton Honors Card',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'hilton', multiplier: 7, note: 'Hilton hotels' },
      { category: 'dining', multiplier: 5 },
      { category: 'grocery', multiplier: 5 },
      { category: 'gas', multiplier: 5 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors.png',
    imageColor: '#104C97'
  },
  {
    name: 'Hilton Honors Surpass',
    annualFee: 150,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'hilton', multiplier: 12, note: 'Hilton hotels' },
      { category: 'dining', multiplier: 6 },
      { category: 'grocery', multiplier: 6 },
      { category: 'gas', multiplier: 6 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors-surpass.png',
    imageColor: '#0D3B66'
  },
  {
    name: 'Hilton Honors Aspire',
    annualFee: 550,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'hilton', multiplier: 14, note: 'Hilton hotels' },
      { category: 'airlines', multiplier: 7, note: 'flights' },
      { category: 'dining', multiplier: 7 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors-aspire.png',
    imageColor: '#1B1B3A'
  },
  {
    name: 'Hilton Honors Business',
    annualFee: 95,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'hilton', multiplier: 12, note: 'Hilton hotels' },
      { category: 'shipping', multiplier: 6 },
      { category: 'gas', multiplier: 6 },
      { category: 'dining', multiplier: 6 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors.png',
    imageColor: '#1A365D'
  },

  // ========== MARRIOTT BONVOY ==========
  {
    name: 'Marriott Bonvoy Brilliant',
    annualFee: 650,
    rewardType: 'points',
    network: 'amex',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'dining', multiplier: 3 },
      { category: 'airlines', multiplier: 3, note: 'flights' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy-brilliant-card.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Bevy',
    annualFee: 250,
    rewardType: 'points',
    network: 'amex',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'dining', multiplier: 4 }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy-bevy-card.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Business',
    annualFee: 125,
    rewardType: 'points',
    network: 'amex',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'shipping', multiplier: 4 },
      { category: 'gas', multiplier: 4 },
      { category: 'phone', multiplier: 4 },
      { category: 'dining', multiplier: 4 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000244_480x304_straight_withname.png',
    imageColor: '#8A2432'
  },

  // ========== BUSINESS CARDS ==========
  {
    name: 'Business Platinum Card',
    annualFee: 695,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'flights and hotels through Amex Travel' },
      { category: 'other', multiplier: 1.5, note: 'on purchases $5,000+' }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000175_480x304_straight_withname.png',
    imageColor: '#E5E4E2'
  },
  {
    name: 'Business Gold Card',
    annualFee: 375,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [],
    selectableConfig: {
      maxSelections: 2,
      availableCategories: ['advertising', 'shipping', 'gas', 'travel', 'phone', 'officeSupplies'],
      multiplier: 4,
      cap: 150000,
      capPeriod: 'yearly'
    },
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000257_480x304_straight_withname.png',
    imageColor: '#B8860B'
  },
  {
    name: 'Blue Business Plus',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'other', multiplier: 2, cap: 50000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000268_480x304_straight_withname.png',
    imageColor: '#2E86AB'
  },
  {
    name: 'Blue Business Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 2,
    categories: [],
    note: '2% on all purchases up to $50,000/year',
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000267_480x304_straight_withname.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Amazon Business Prime',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 5 },
      { category: 'wholefoods', multiplier: 5 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000295_480x304_straight_withname.png',
    imageColor: '#FF9900'
  },
  {
    name: 'Lowes Business Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'homeImprovement', multiplier: 5, note: 'Lowes purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'officeSupplies', multiplier: 2 }
    ],
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000312_480x304_straight_withname.png',
    imageColor: '#004990'
  },
  {
    name: 'Plum Card',
    annualFee: 250,
    rewardType: 'cashback',
    network: 'amex',
    baseReward: 1.5,
    categories: [],
    note: '1.5% early pay discount',
    imageURL: 'https://icm.aexp-static.com/acquisition/card-art/NUS000000173_480x304_straight_withname.png',
    imageColor: '#614B79'
  }
];

/**
 * Amex Scraper class - extends BaseScraper
 */
class AmexScraper extends BaseScraper {
  constructor() {
    super('American Express', {
      fallbackCards: AMEX_CARDS.map(card => formatCard('American Express', card)),
      baseUrl: 'https://www.americanexpress.com',
      timeout: 45000
    });

    // Known card page URLs for direct scraping
    this.cardPages = [
      '/us/credit-cards/card/platinum-card/',
      '/us/credit-cards/card/gold-card/',
      '/us/credit-cards/card/green-card/',
      '/us/credit-cards/card/blue-cash-preferred/',
      '/us/credit-cards/card/blue-cash-everyday/',
      '/us/credit-cards/card/hilton-honors/',
      '/us/credit-cards/card/hilton-honors-surpass/',
      '/us/credit-cards/card/hilton-honors-aspire/',
      '/us/credit-cards/card/delta-skymiles-gold/',
      '/us/credit-cards/card/delta-skymiles-platinum/'
    ];
  }

  /**
   * Scrape live data from Amex website
   */
  async scrapeLive() {
    await this.launchBrowser();
    const page = await this.browser.newPage();

    // Amex has strong anti-bot, need extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    const scrapedCards = [];

    for (let i = 0; i < this.cardPages.length; i++) {
      const cardPath = this.cardPages[i];
      const url = `${this.baseUrl}${cardPath}`;
      console.log(`    📋 抓取卡片 ${i + 1}/${this.cardPages.length}: ${cardPath.split('/').filter(Boolean).pop()}`);

      try {
        await this.randomDelay(2000, 4000);
        const success = await this.safeGoto(page, url);
        if (!success) continue;

        // Wait for dynamic content
        await this.randomDelay(2000, 3000);

        const cardData = await page.evaluate(() => {
          const data = {};

          // Card name from title or h1
          const title = document.querySelector('h1, [data-testid="card-name"]');
          if (title) {
            data.name = title.textContent.trim().replace(/®|™|℠/g, '').trim();
          }

          // Try to find annual fee
          const allText = document.body.innerText;
          const feePatterns = [
            /\$(\d+)\s*Annual\s*Fee/i,
            /Annual\s*Fee[:\s]*\$(\d+)/i,
            /\$(\d+)\s*annual\s*membership/i
          ];

          for (const pattern of feePatterns) {
            const match = allText.match(pattern);
            if (match) {
              data.annualFee = parseInt(match[1], 10);
              break;
            }
          }

          if (allText.includes('No Annual Fee') || allText.includes('$0 annual fee')) {
            data.annualFee = 0;
          }

          // Try to find reward rates
          const rewards = [];
          const rewardPatterns = [
            /(\d+)[Xx]\s+(?:Membership Rewards®?\s+)?(?:points?\s+)?(?:at|on|for)\s+(.+?)(?:\.|,|$)/gi,
            /Earn\s+(\d+)[Xx]\s+(?:points?\s+)?(?:at|on)\s+(.+?)(?:\.|,|$)/gi
          ];

          const elements = document.querySelectorAll('li, p, span');
          elements.forEach(el => {
            const text = el.textContent;
            for (const pattern of rewardPatterns) {
              pattern.lastIndex = 0;
              const match = pattern.exec(text);
              if (match) {
                rewards.push({
                  multiplier: parseInt(match[1], 10),
                  category: match[2].trim()
                });
              }
            }
          });

          data.rewards = rewards.slice(0, 10);

          // Find card image
          const cardImg = document.querySelector('img[src*="card-art"], img[alt*="Card"]');
          if (cardImg && cardImg.src) {
            data.imageUrl = cardImg.src;
          }

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({
            ...cardData,
            applicationUrl: url,
            issuer: 'American Express'
          });
        }
      } catch (error) {
        console.log(`      ⚠️  無法抓取: ${error.message}`);
      }
    }

    return scrapedCards;
  }

  /**
   * Override merge to update specific fields from live data
   */
  mergeWithFallback(liveData) {
    const merged = [...this.fallbackCards];

    for (const liveCard of liveData) {
      const liveNameLower = liveCard.name.toLowerCase();
      const existingIndex = merged.findIndex(c => {
        const fallbackNameLower = c.name.toLowerCase();
        return fallbackNameLower.includes(liveNameLower) ||
               liveNameLower.includes(fallbackNameLower) ||
               fallbackNameLower === liveNameLower;
      });

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

async function scrapeAmex() {
  const scraper = new AmexScraper();
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
    .filter(Boolean);  // Remove null entries

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

  const card = {
    id: generateCardId(issuer, cardData.name),
    name: cardData.name,
    issuer: issuer,
    network: cardData.network || 'amex',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: selectableConfig,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#006FCF',
    imageURL: cardData.imageURL || null
  };

  return card;
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Amex Scraper...\n');
  scrapeAmex()
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

module.exports = scrapeAmex;
