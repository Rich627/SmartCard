/**
 * American Express Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

const AMEX_CARDS = [
  {
    name: 'American Express Gold Card',
    annualFee: 250,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4 },
      { category: 'grocery', multiplier: 4, cap: 25000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/gold-card.png',
    imageColor: '#B8860B'
  },
  {
    name: 'American Express Platinum Card',
    annualFee: 695,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'flights booked through Amex Travel' },
      { category: 'travel', multiplier: 5, note: 'prepaid hotels through Amex Travel' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/platinum-card.png',
    imageColor: '#E5E4E2'
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
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/green-card.png',
    imageColor: '#228B22'
  },
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
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/blue-cash-preferred.png',
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
    imageColor: '#5DADE2'
  },
  {
    name: 'Amex EveryDay',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 }
    ],
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
    imageColor: '#8E44AD'
  },
  {
    name: 'Delta SkyMiles Gold',
    annualFee: 150,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 2, note: 'Delta purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageColor: '#C41E3A'
  },
  {
    name: 'Delta SkyMiles Platinum',
    annualFee: 350,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, note: 'Delta purchases' },
      { category: 'travel', multiplier: 2, note: 'hotels' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageColor: '#0A2647'
  },
  {
    name: 'Delta SkyMiles Reserve',
    annualFee: 650,
    rewardType: 'miles',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, note: 'Delta purchases' }
    ],
    imageColor: '#1E3A5F'
  },
  {
    name: 'Hilton Honors',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'travel', multiplier: 7, note: 'Hilton hotels' },
      { category: 'dining', multiplier: 5 },
      { category: 'grocery', multiplier: 5 },
      { category: 'gas', multiplier: 5 }
    ],
    imageColor: '#104C97'
  },
  {
    name: 'Hilton Honors Surpass',
    annualFee: 150,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'travel', multiplier: 12, note: 'Hilton hotels' },
      { category: 'dining', multiplier: 6 },
      { category: 'grocery', multiplier: 6 },
      { category: 'gas', multiplier: 6 }
    ],
    imageColor: '#0D3B66'
  },
  {
    name: 'Hilton Honors Aspire',
    annualFee: 550,
    rewardType: 'points',
    network: 'amex',
    baseReward: 3,
    categories: [
      { category: 'travel', multiplier: 14, note: 'Hilton hotels' },
      { category: 'travel', multiplier: 7, note: 'flights' },
      { category: 'dining', multiplier: 7 }
    ],
    imageColor: '#1B1B3A'
  },
  {
    name: 'Marriott Bonvoy Brilliant',
    annualFee: 650,
    rewardType: 'points',
    network: 'amex',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 6, note: 'Marriott hotels' },
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 3, note: 'flights' }
    ],
    imageColor: '#8A2432'
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
    imageColor: '#2E86AB'
  },
  {
    name: 'Business Gold Card',
    annualFee: 375,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    selectableConfig: {
      maxSelections: 2,
      availableCategories: ['advertising', 'shipping', 'gas', 'travel', 'phone', 'officeSupplies'],
      multiplier: 4,
      cap: 150000,
      capPeriod: 'yearly'
    },
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/business-gold.png',
    imageColor: '#B8860B'
  }
];

async function scrapeAmex() {
  return AMEX_CARDS.map(card => formatCard('American Express', card));
}

function formatCard(issuer, cardData) {
  const categoryRewards = (cardData.categories || []).map(cat => ({
    category: cat.category,
    multiplier: cat.multiplier,
    isPercentage: cardData.rewardType === 'cashback',
    cap: cat.cap || null,
    capPeriod: cat.capPeriod || null
  }));

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
    selectableConfig: cardData.selectableConfig || null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#006FCF',
    imageURL: cardData.imageURL || null
  };

  return card;
}

module.exports = scrapeAmex;
