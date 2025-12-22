/**
 * Capital One Credit Card Scraper
 * Uses verified card data (Capital One website is heavily JS-rendered)
 */

const { generateCardId, mapCategory } = require('../utils/categories');

const CAPITALONE_CARDS = [
  {
    name: 'Capital One Savor Cash Rewards',
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
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/savorone.png',
    imageColor: '#ED1B24'
  },
  {
    name: 'Capital One SavorOne Cash Rewards',
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
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/savorone.png',
    imageColor: '#C41230'
  },
  {
    name: 'Capital One Venture X Rewards',
    annualFee: 395,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 10, note: 'hotels/car rentals via Capital One Travel' },
      { category: 'airlines', multiplier: 5, note: 'flights via Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/venture-x.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Capital One Venture Rewards',
    annualFee: 95,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 5, note: 'hotels/cars via Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/venture.png',
    imageColor: '#004977'
  },
  {
    name: 'Capital One VentureOne Rewards',
    annualFee: 0,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1.25,
    categories: [
      { category: 'travel', multiplier: 5, note: 'hotels/cars via Capital One Travel' }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/og/ventureone.png',
    imageColor: '#0066A1'
  },
  {
    name: 'Capital One Quicksilver Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/quicksilver.png',
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
    imageURL: 'https://ecm.capitalone.com/WCM/card/pages/open-graph/platinumog.png',
    imageColor: '#5C6BC0'
  }
];

async function scrapeCapitalOne() {
  console.log('🏦 Capital One: Processing credit cards...');

  const cards = CAPITALONE_CARDS.map(cardData => {
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

    console.log(`  ✅ ${cardData.name} - $${cardData.annualFee} fee, ${categoryRewards.length} categories`);

    return {
      id: generateCardId('Capital One', cardData.name),
      name: cardData.name,
      issuer: 'Capital One',
      network: cardData.network || 'mastercard',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: null,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#004977',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} Capital One cards`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing Capital One Scraper...\n');
  scrapeCapitalOne()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeCapitalOne;
