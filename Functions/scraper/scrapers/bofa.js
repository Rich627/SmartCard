/**
 * Bank of America Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/702702702702702702702702702702/en_US/702702702702702702702702702702/702702702702702702702702702702_702702702702702702702702702702_702.png',
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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Premium_Rewards/premium_rewards_background.png',
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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Premium_Rewards_Elite/premium_rewards_elite_background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Bank of America Travel Rewards',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Travel_Rewards/travel_rewards_background.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Bank of America Unlimited Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Unlimited_Cash/unlimited_cash_background.png',
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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Co-Brand/en_US/Alaska/alaska_signature_background.png',
    imageColor: '#01426A'
  }
];

async function scrapeBofa() {
  return BOFA_CARDS.map(card => formatCard('Bank of America', card));
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
    imageColor: cardData.imageColor || '#C41230',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeBofa;
