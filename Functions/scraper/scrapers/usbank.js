/**
 * US Bank Credit Card Scraper
 * Uses verified card data
 */

const { generateCardId, mapCategory } = require('../utils/categories');

const USBANK_CARDS = [
  {
    name: 'US Bank Altitude Go Visa Signature',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4, cap: 2000, capPeriod: 'quarterly' },
      { category: 'grocery', multiplier: 2 },
      { category: 'streaming', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'evCharging', multiplier: 2 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/illustrations/card-art/credit-cards/altitude-go-visa-signature-credit-card.png',
    imageColor: '#00529B'
  },
  {
    name: 'US Bank Altitude Connect Visa Signature',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'via Altitude Rewards' },
      { category: 'gas', multiplier: 4 },
      { category: 'evCharging', multiplier: 4 },
      { category: 'streaming', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-altitude-connect-consumer.png',
    imageColor: '#0072CE'
  },
  {
    name: 'US Bank Altitude Reserve Visa Infinite',
    annualFee: 400,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 }
    ],
    note: '3X on mobile wallet purchases (cap coming Dec 2025)',
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-altitude-reserve-visa-infinite-benefits-vertical-card-art.png',
    imageColor: '#002855'
  },
  {
    name: 'US Bank Cash+ Visa Signature',
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
    name: 'US Bank Smartly Visa Signature',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    imageURL: 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-bank-smartly-card-art.png',
    imageColor: '#00A9E0'
  }
];

async function scrapeUsBank() {
  console.log('🏦 US Bank: Processing credit cards...');

  const cards = USBANK_CARDS.map(cardData => {
    const categoryRewards = (cardData.categories || [])
      .map(cat => {
        const mappedCategory = mapCategory(cat.category);
        if (!mappedCategory) return null;
        return {
          category: mappedCategory,
          multiplier: cat.multiplier,
          isPercentage: cardData.rewardType === 'cashback',
          cap: cat.cap || null,
          capPeriod: cat.capPeriod || null
        };
      })
      .filter(Boolean);

    let selectableConfig = null;
    if (cardData.selectableConfig) {
      const mappedCategories = cardData.selectableConfig.availableCategories
        .map(cat => mapCategory(cat))
        .filter(Boolean);

      selectableConfig = {
        maxSelections: cardData.selectableConfig.maxSelections,
        availableCategories: mappedCategories,
        multiplier: cardData.selectableConfig.multiplier,
        isPercentage: cardData.rewardType === 'cashback',
        cap: cardData.selectableConfig.cap || null,
        capPeriod: cardData.selectableConfig.capPeriod || null
      };
    }

    console.log(`  ✅ ${cardData.name} - $${cardData.annualFee} fee, ${categoryRewards.length} categories`);

    return {
      id: generateCardId('US Bank', cardData.name),
      name: cardData.name,
      issuer: 'US Bank',
      network: cardData.network || 'visa',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: selectableConfig,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#00529B',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} US Bank cards`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing US Bank Scraper...\n');
  scrapeUsBank()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeUsBank;
