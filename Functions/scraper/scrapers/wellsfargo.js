/**
 * Wells Fargo Credit Card Scraper
 */

const { generateCardId } = require('../utils/categories');

const WELLSFARGO_CARDS = [
  {
    name: 'Wells Fargo Active Cash',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    imageURL: 'https://creditcards.wellsfargo.com/W-702702702702702702702702702702/CardArt/702702702702702702702702702702_702702.png',
    imageColor: '#D71E28'
  },
  {
    name: 'Wells Fargo Autograph',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'transit', multiplier: 3 },
      { category: 'streaming', multiplier: 3 },
      { category: 'phone', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-702702702702702702702702702702/CardArt/autograph_702.png',
    imageColor: '#FFCD00'
  },
  {
    name: 'Wells Fargo Autograph Journey',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'hotels through Wells Fargo Travel' },
      { category: 'travel', multiplier: 4, note: 'airlines, hotels, car rentals' },
      { category: 'dining', multiplier: 3 },
      { category: 'transit', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-702702702702702702702702702702/CardArt/autograph_journey_702.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Wells Fargo Reflect',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 0,
    categories: [],
    note: 'Balance transfer card with 0% intro APR, no rewards',
    imageURL: 'https://creditcards.wellsfargo.com/W-702702702702702702702702702702/CardArt/reflect_702.png',
    imageColor: '#5DADE2'
  },
  {
    name: 'Wells Fargo Bilt',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 2 },
      { category: 'other', multiplier: 1, note: 'rent payments with no fee' }
    ],
    note: 'Earn points on rent payments',
    imageURL: 'https://www.biltrewards.com/static/media/card-front.702702702702.png',
    imageColor: '#000000'
  }
];

async function scrapeWellsFargo() {
  return WELLSFARGO_CARDS.map(card => formatCard('Wells Fargo', card));
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
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#D71E28',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeWellsFargo;
