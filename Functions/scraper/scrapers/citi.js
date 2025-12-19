/**
 * Citi Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

const CITI_CARDS = [
  {
    name: 'Citi Double Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [],
    imageURL: 'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png',
    imageColor: '#003B70'
  },
  {
    name: 'Citi Custom Cash',
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
      capPeriod: 'monthly'
    },
    imageURL: 'https://www.citi.com/CRD/images/citi-custom-cash/citi-custom-cash_222x140.png',
    imageColor: '#00BCD4'
  },
  {
    name: 'Citi Premier',
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
    name: 'Citi Strata Premier',
    annualFee: 95,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 10, note: 'hotels through thankyou.com' },
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-strata-premier/citi-strata-premier_222x140.png',
    imageColor: '#1A365D'
  },
  {
    name: 'Citi Rewards+',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-rewards-plus/citi-rewards-plus_222x140.png',
    imageColor: '#5C4A9E'
  },
  {
    name: 'Citi Diamond Preferred',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [],
    note: '0% intro APR card, no bonus categories',
    imageURL: 'https://www.citi.com/CRD/images/citi-diamond-preferred/citi-diamond-preferred_222x140.png',
    imageColor: '#4B6584'
  },
  {
    name: 'Costco Anywhere Visa',
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
    name: 'Citi AAdvantage Platinum Select',
    annualFee: 99,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'americanairlines', multiplier: 2, note: 'American Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.citi.com/CRD/images/citi-aadvantage-platinum/citi-aadvantage-platinum_222x140.png',
    imageColor: '#0078D2'
  }
];

async function scrapeCiti() {
  return CITI_CARDS.map(card => formatCard('Citi', card));
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
    network: cardData.network || 'mastercard',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: cardData.selectableConfig || null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#003B70',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeCiti;
