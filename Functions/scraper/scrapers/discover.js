/**
 * Discover Credit Card Scraper
 */

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
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-702702702702702702702702702702.png',
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
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/chrome-cardart.png',
    imageColor: '#868686'
  },
  {
    name: 'Discover it Miles',
    annualFee: 0,
    rewardType: 'miles',
    network: 'discover',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/miles-cardart.png',
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
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/student-cashback-cardart.png',
    imageColor: '#FF6600'
  }
];

async function scrapeDiscover() {
  const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
  const currentYear = new Date().getFullYear();

  return DISCOVER_CARDS.map(card => {
    const formatted = formatCard('Discover', card);

    // Add rotating categories for Discover it cards
    if (card.rotating) {
      const quarterKey = `Q${currentQuarter}`;
      const rawCategories = DISCOVER_ROTATING_2025[quarterKey] || ['grocery', 'gas'];
      // Map rotating categories to iOS SpendingCategory enum values
      const mappedCategories = rawCategories
        .map(cat => mapCategory(cat))
        .filter(Boolean);

      formatted.rotatingCategories = [
        {
          quarter: currentQuarter,
          year: currentYear,
          categories: mappedCategories,
          multiplier: card.rotating.multiplier,
          isPercentage: true,
          cap: card.rotating.cap,
          activationRequired: card.rotating.activationRequired
        }
      ];
    }

    return formatted;
  });
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

module.exports = scrapeDiscover;
