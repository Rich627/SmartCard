/**
 * US Bank Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

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
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-go-background.png',
    imageColor: '#00529B'
  },
  {
    name: 'US Bank Altitude Connect',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'travel and hotels booked through Altitude Rewards' },
      { category: 'gas', multiplier: 4 },
      { category: 'evCharging', multiplier: 4 },
      { category: 'streaming', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-connect-background.png',
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
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-reserve-background.png',
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
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/cash-plus-background.png',
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
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/smartly-background.png',
    imageColor: '#00A9E0'
  }
];

async function scrapeUsBank() {
  return USBANK_CARDS.map(card => formatCard('US Bank', card));
}

function formatCard(issuer, cardData) {
  const categoryRewards = (cardData.categories || []).map(cat => ({
    category: cat.category,
    multiplier: cat.multiplier,
    isPercentage: cardData.rewardType === 'cashback',
    cap: cat.cap || null,
    capPeriod: cat.capPeriod || null
  }));

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
    selectableConfig: cardData.selectableConfig || null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#00529B',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeUsBank;
