/**
 * Wells Fargo Credit Card Scraper
 * Uses verified card data
 */

const { generateCardId, mapCategory } = require('../utils/categories');

const WELLSFARGO_CARDS = [
  {
    name: 'Wells Fargo Active Cash Card',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/ActiveCash/WF_ActiveCash_VS_Collateral_Front_RGB.png',
    imageColor: '#D71E28'
  },
  {
    name: 'Wells Fargo Autograph Card',
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
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/Autograph/Autograph-No-Fee-Card-RGB_d.png',
    imageColor: '#FFCD00'
  },
  {
    name: 'Wells Fargo Autograph Journey Card',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'hotels', multiplier: 5 },
      { category: 'airlines', multiplier: 4 },
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/AutographJourney/WF_Autograph_Journey_Card_d.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Wells Fargo Reflect Card',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 0,
    categories: [],
    note: 'Balance transfer card, no rewards',
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/Reflect/Reflect_homepage.png',
    imageColor: '#5DADE2'
  },
  {
    name: 'Bilt Mastercard',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 2 }
    ],
    note: 'Earn points on rent payments with no fee',
    imageURL: 'https://static.biltrewards.com/assets/seo/bilt_card2_coming_soon_seo.jpg',
    imageColor: '#000000'
  }
];

async function scrapeWellsFargo() {
  console.log('🏦 Wells Fargo: Processing credit cards...');

  const cards = WELLSFARGO_CARDS.map(cardData => {
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
      id: generateCardId('Wells Fargo', cardData.name),
      name: cardData.name,
      issuer: 'Wells Fargo',
      network: cardData.network || 'visa',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: null,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#D71E28',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} Wells Fargo cards`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing Wells Fargo Scraper...\n');
  scrapeWellsFargo()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeWellsFargo;
