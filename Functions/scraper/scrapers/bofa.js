/**
 * Bank of America Credit Card Scraper
 * Uses verified card data (BofA website is heavily JS-rendered)
 */

const { generateCardId, mapCategory } = require('../utils/categories');

const BOFA_CARDS = [
  {
    name: 'Bank of America Customized Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'grocery', multiplier: 2 },
      { category: 'wholesale', multiplier: 2 }
    ],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['gas', 'onlineShopping', 'dining', 'travel', 'drugstore', 'homeImprovement'],
      multiplier: 3,
      cap: 2500,
      capPeriod: 'quarterly'
    },
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8ckn_cshsigcm_v_250x158.png',
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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8CAL_prmsigcm_v_250_158.png',
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
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8cud_premrewelite_v_250x158.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Bank of America Travel Rewards',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1.5,
    categories: [
      { category: 'travel', multiplier: 3, note: 'via BofA Travel Center' }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8blm_trvsigcm_v_250x158.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Bank of America Unlimited Cash Rewards',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8cty_cshsigcm_v_250x157.png',
    imageColor: '#C41230'
  },
  {
    name: 'Alaska Airlines Visa Signature',
    annualFee: 95,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 3, note: 'Alaska Airlines purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'streaming', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/1bbt_sigcm_v_atmos_ascent_250.png',
    imageColor: '#01426A'
  }
];

async function scrapeBofa() {
  console.log('🏦 Bank of America: Processing credit cards...');

  const cards = BOFA_CARDS.map(cardData => {
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
      id: generateCardId('Bank of America', cardData.name),
      name: cardData.name,
      issuer: 'Bank of America',
      network: cardData.network || 'visa',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: selectableConfig,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#C41230',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} Bank of America cards`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing Bank of America Scraper...\n');
  scrapeBofa()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeBofa;
