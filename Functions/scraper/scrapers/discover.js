/**
 * Discover Credit Card Scraper
 * Uses verified card data with rotating categories
 */

const { generateCardId, mapCategory } = require('../utils/categories');

// Discover it quarterly categories for 2025
const DISCOVER_ROTATING_2025 = {
  Q1: ['dining', 'homeImprovement', 'streaming'],
  Q2: ['grocery', 'wholesale'],
  Q3: ['gas', 'evCharging', 'transit', 'utilities'],
  Q4: ['amazon', 'drugstore']
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
    note: '$1,000 quarterly cap is combined for gas and dining',
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
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/cardart/cardart-student-iridescent-390-243.png',
    imageColor: '#FF6600'
  }
];

async function scrapeDiscover() {
  console.log('🏦 Discover: Processing credit cards...');

  const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
  const currentYear = new Date().getFullYear();

  const cards = DISCOVER_CARDS.map(cardData => {
    const categoryRewards = (cardData.categories || [])
      .map(cat => {
        const mappedCategory = mapCategory(cat.category);
        if (!mappedCategory) return null;
        return {
          category: mappedCategory,
          multiplier: cat.multiplier,
          isPercentage: true,
          cap: cat.cap || null,
          capPeriod: cat.capPeriod || null
        };
      })
      .filter(Boolean);

    // Build rotating categories for cards with rotating rewards
    let rotatingCategories = null;
    if (cardData.rotating) {
      const quarterKey = `Q${currentQuarter}`;
      const rawCategories = DISCOVER_ROTATING_2025[quarterKey] || ['grocery', 'gas'];
      const mappedCategories = rawCategories.map(cat => mapCategory(cat)).filter(Boolean);

      rotatingCategories = [{
        quarter: currentQuarter,
        year: currentYear,
        categories: mappedCategories,
        multiplier: cardData.rotating.multiplier,
        isPercentage: true,
        cap: cardData.rotating.cap,
        activationRequired: cardData.rotating.activationRequired
      }];
    }

    console.log(`  ✅ ${cardData.name} - $${cardData.annualFee} fee, ${categoryRewards.length} categories${rotatingCategories ? ' (rotating)' : ''}`);

    return {
      id: generateCardId('Discover', cardData.name),
      name: cardData.name,
      issuer: 'Discover',
      network: 'discover',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: true,
      categoryRewards: categoryRewards,
      rotatingCategories: rotatingCategories,
      selectableConfig: null,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#FF6600',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} Discover cards`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing Discover Scraper...\n');
  scrapeDiscover()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
        if (card.rotatingCategories) {
          console.log(`    (Q${card.rotatingCategories[0].quarter} rotating: ${card.rotatingCategories[0].categories.join(', ')})`);
        }
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeDiscover;
