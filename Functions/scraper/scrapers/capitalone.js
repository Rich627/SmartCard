/**
 * Capital One Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

const CAPITALONE_CARDS = [
  {
    name: 'Capital One Savor',
    annualFee: 95,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 4 },
      { category: 'entertainment', multiplier: 4 },
      { category: 'streaming', multiplier: 4 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savor-background.png',
    imageColor: '#ED1B24'
  },
  {
    name: 'Capital One SavorOne',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'entertainment', multiplier: 3 },
      { category: 'streaming', multiplier: 3 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savorone-background.png',
    imageColor: '#C41230'
  },
  {
    name: 'Capital One Venture X',
    annualFee: 395,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 10, note: 'hotels and car rentals booked through Capital One Travel' },
      { category: 'travelPortalFlights', multiplier: 5, note: 'flights booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venturex-background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Capital One Venture',
    annualFee: 95,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels and car rentals booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venture-background.png',
    imageColor: '#004977'
  },
  {
    name: 'Capital One VentureOne',
    annualFee: 0,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1.25,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/ventureone-background.png',
    imageColor: '#0066A1'
  },
  {
    name: 'Capital One Quicksilver',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/quicksilver-background.png',
    imageColor: '#004879'
  },
  {
    name: 'Capital One Platinum',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 0,
    categories: [],
    note: 'Credit building card, no rewards',
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/platinum-background.png',
    imageColor: '#5C6BC0'
  },
  {
    name: 'Capital One Spark Cash Plus',
    annualFee: 150,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'hotels and car rentals booked through Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/spark-cash-plus-background.png',
    imageColor: '#2E7D32'
  }
];

async function scrapeCapitalOne() {
  return CAPITALONE_CARDS.map(card => formatCard('Capital One', card));
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
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#004977',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeCapitalOne;
