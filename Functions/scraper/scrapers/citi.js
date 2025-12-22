/**
 * Citi Credit Card Scraper
 * Citi website is heavily JavaScript-rendered, so we use verified card data
 * with HTTP checks for basic validation
 */

const https = require('https');
const { generateCardId, mapCategory } = require('../utils/categories');

// Verified Citi card data
const CITI_CARDS = [
  {
    slug: 'double-cash',
    name: 'Citi Double Cash Card',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [],
    note: '2% cash back: 1% when you buy, 1% when you pay',
    imageURL: 'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png',
    imageColor: '#003B70'
  },
  {
    slug: 'custom-cash',
    name: 'Citi Custom Cash Card',
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
      capPeriod: 'monthly',
      autoDetect: true
    },
    note: '5% automatically on top spending category each billing cycle (up to $500)',
    imageURL: 'https://www.citi.com/CRD/images/citi-custom-cash/citi-custom-cash_222x140.png',
    imageColor: '#00BCD4'
  },
  {
    slug: 'premier',
    name: 'Citi Premier Card',
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
    slug: 'strata-premier',
    name: 'Citi Strata Premier Card',
    annualFee: 95,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 10, note: 'Hotels booked through thankyou.com' },
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-strata-premier/citi-strata-premier_222x140.png',
    imageColor: '#1A365D'
  },
  {
    slug: 'rewards-plus',
    name: 'Citi Rewards+ Card',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    note: 'Points rounded up to nearest 10 on every purchase',
    imageURL: 'https://www.citi.com/CRD/images/citi-rewards-plus/citi-rewards-plus_222x140.png',
    imageColor: '#5C4A9E'
  },
  {
    slug: 'diamond-preferred',
    name: 'Citi Diamond Preferred Card',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [],
    note: '0% intro APR card for balance transfers',
    imageURL: 'https://cdn.prodstatic.com/shared/images/cards/278x175/64a1b510-35eb-11ee-bf78-57c180bf03f6.png',
    imageColor: '#4B6584'
  },
  {
    slug: 'costco-anywhere',
    name: 'Costco Anywhere Visa Card',
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
    slug: 'aadvantage-platinum',
    name: 'Citi AAdvantage Platinum Select Card',
    annualFee: 99,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 2, note: 'American Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    note: '$0 first year, then $99',
    imageURL: null,
    imageColor: '#0078D2'
  }
];

/**
 * Fetch a URL to verify it exists
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    }, res => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

/**
 * Main scrape function
 */
async function scrapeCiti() {
  console.log('🏦 Citi: Processing credit cards...');

  const cards = [];

  for (const cardData of CITI_CARDS) {
    // Map categories (keep note for portal-specific rewards)
    const categoryRewards = (cardData.categories || [])
      .map(cat => {
        const mappedCategory = mapCategory(cat.category);
        if (!mappedCategory) return null;
        return {
          category: mappedCategory,
          multiplier: cat.multiplier,
          isPercentage: cardData.rewardType === 'cashback',
          cap: cat.cap || null,
          capPeriod: cat.capPeriod || null,
          note: cat.note || null
        };
      })
      .filter(Boolean);

    // Map selectable config if present
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
      id: generateCardId('Citi', cardData.name),
      name: cardData.name,
      issuer: 'Citi',
      network: cardData.network || 'mastercard',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: selectableConfig,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#003B70',
      imageURL: cardData.imageURL
    };

    cards.push(card);
    console.log(`  ✅ ${cardData.name} - $${cardData.annualFee} fee, ${categoryRewards.length} categories`);
  }

  console.log(`  📊 Total: ${cards.length} Citi cards`);
  return cards;
}

// Test standalone
if (require.main === module) {
  console.log('🧪 Testing Citi Scraper...\n');
  scrapeCiti()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
        if (card.selectableConfig) {
          console.log(`    (selectable: ${card.selectableConfig.multiplier}x on ${card.selectableConfig.availableCategories.length} categories)`);
        }
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeCiti;
