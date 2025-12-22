/**
 * Other Credit Card Issuers Scraper
 * Barclays, Credit Unions, Fintech, Retail, and Other Issuers
 * Uses verified card data
 */

const { generateCardId, mapCategory } = require('../utils/categories');

// ============================================================================
// BARCLAYS CARDS
// ============================================================================
const BARCLAYS_CARDS = [
  {
    name: 'AAdvantage Aviator Red World Elite',
    issuer: 'Barclays',
    annualFee: 99,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 2, note: 'American Airlines purchases' }
    ],
    imageURL: null,
    imageColor: '#C8102E'
  },
  {
    name: 'AAdvantage Aviator Silver',
    issuer: 'Barclays',
    annualFee: 149,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 2, note: 'American Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#808080'
  },
  {
    name: 'JetBlue Plus Card',
    issuer: 'Barclays',
    annualFee: 99,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 6, note: 'JetBlue purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://cards.barclaycardus.com/content/dam/bcuspublic/card-plastic/card-front/JBE_card_Plus_WE_Flat_230x157.png',
    imageColor: '#003876'
  },
  {
    name: 'JetBlue Card',
    issuer: 'Barclays',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 3, note: 'JetBlue purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://cards.barclaycardus.com/content/dam/bcuspublic/card-plastic/card-front/JBM_card_NoFee_WM_Flat_230x157.png',
    imageColor: '#003876'
  },
  {
    name: 'Wyndham Rewards Earner Plus',
    issuer: 'Barclays',
    annualFee: 75,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'hotels', multiplier: 6, note: 'Wyndham purchases' },
      { category: 'gas', multiplier: 4 },
      { category: 'grocery', multiplier: 4 },
      { category: 'utilities', multiplier: 4 }
    ],
    imageURL: 'https://cards.barclaycardus.com/content/dam/bcuspublic/card-plastic/card-front/WYF_card_rRGB_Fee_EarnerPlus_VS_Flat_230x157.png',
    imageColor: '#0072CE'
  },
  {
    name: 'Wyndham Rewards Earner',
    issuer: 'Barclays',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'hotels', multiplier: 5, note: 'Wyndham purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'grocery', multiplier: 2 },
      { category: 'utilities', multiplier: 2 }
    ],
    imageURL: 'https://cards.barclaycardus.com/content/dam/bcuspublic/card-plastic/card-front/WYZ_card_rRGB_NoFee_Earner_VS_Flat_230x157.png',
    imageColor: '#0072CE'
  },
  {
    name: 'Hawaiian Airlines World Elite',
    issuer: 'Barclays',
    annualFee: 99,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 3, note: 'Hawaiian Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#6B2D5B'
  },
  {
    name: 'Frontier Airlines World Mastercard',
    issuer: 'Barclays',
    annualFee: 79,
    rewardType: 'miles',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'airlines', multiplier: 3, note: 'Frontier purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'entertainment', multiplier: 2 }
    ],
    imageURL: 'https://cards.barclaycardus.com/content/dam/bcuspublic/card-plastic/card-front/FTA_CD_Flat_Card_Art_230x157.png',
    imageColor: '#004225'
  },
  {
    name: 'Priceline VIP Rewards Visa',
    issuer: 'Barclays',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'Priceline purchases' },
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#0064D2'
  }
];

// ============================================================================
// CREDIT UNION CARDS
// ============================================================================
const CREDIT_UNION_CARDS = [
  // Navy Federal
  {
    name: 'Navy Federal More Rewards',
    issuer: 'Navy Federal',
    annualFee: 0,
    rewardType: 'points',
    network: 'amex',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'transit', multiplier: 3 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#003865'
  },
  {
    name: 'Navy Federal cashRewards',
    issuer: 'Navy Federal',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: null,
    imageColor: '#003865'
  },
  {
    name: 'Navy Federal Flagship Rewards',
    issuer: 'Navy Federal',
    annualFee: 49,
    rewardType: 'points',
    network: 'visa',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 3 }
    ],
    imageURL: null,
    imageColor: '#0A2240'
  },
  {
    name: 'Navy Federal Go Rewards',
    issuer: 'Navy Federal',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#003865'
  },

  // PenFed
  {
    name: 'PenFed Platinum Rewards',
    issuer: 'PenFed',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'gas', multiplier: 5 },
      { category: 'grocery', multiplier: 3 }
    ],
    imageURL: null,
    imageColor: '#003399'
  },
  {
    name: 'PenFed Power Cash Rewards',
    issuer: 'PenFed',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2,
    categories: [],
    imageURL: null,
    imageColor: '#007934'
  },
  {
    name: 'PenFed Pathfinder Rewards',
    issuer: 'PenFed',
    annualFee: 95,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 4 },
      { category: 'streaming', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: null,
    imageColor: '#1A1F71'
  },

  // Alliant
  {
    name: 'Alliant Cashback Visa',
    issuer: 'Alliant',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2.5,
    categories: [],
    imageURL: null,
    imageColor: '#005695'
  },

  // USAA
  {
    name: 'USAA Cashback Rewards Plus',
    issuer: 'USAA',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [],
    imageURL: null,
    imageColor: '#003366'
  },
  {
    name: 'USAA Preferred Cash Rewards',
    issuer: 'USAA',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1.5,
    categories: [
      { category: 'gas', multiplier: 5, cap: 3000, capPeriod: 'yearly' },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#003366'
  },
  {
    name: 'USAA Limitless Cashback',
    issuer: 'USAA',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 2.5,
    categories: [],
    imageURL: null,
    imageColor: '#1A2E5A'
  }
];

// ============================================================================
// FINTECH CARDS
// ============================================================================
const FINTECH_CARDS = [
  // PayPal
  {
    name: 'PayPal Cashback Mastercard',
    issuer: 'PayPal',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [
      { category: 'onlineShopping', multiplier: 3, note: 'PayPal purchases' }
    ],
    imageURL: 'https://www.paypalobjects.com/marketing/web23/us/en/ppe/cbmc/hero_size-mobile-up_v1.jpg',
    imageColor: '#003087'
  },

  // Venmo
  {
    name: 'Venmo Credit Card',
    issuer: 'Venmo',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['grocery', 'gas', 'dining', 'entertainment', 'transit', 'utilities'],
      multiplier: 3,
      cap: null,
      capPeriod: null,
      note: 'Auto-selects highest spend category'
    },
    imageURL: 'https://runway-media-production.global.ssl.fastly.net/us/originals/2020/10/Credit_Card_Visual06-e1601663957985.png',
    imageColor: '#008CFF'
  },

  // SoFi
  {
    name: 'SoFi Credit Card',
    issuer: 'SoFi',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [],
    imageURL: 'https://d32ijn7u0aqfv4.cloudfront.net/wp/wp-content/uploads/raw/CC24-2177731-AB_CC-LP-Redesign-for-PQ-Flow_Unlimited-CC_Desktop%402x.png',
    imageColor: '#4C00FF'
  },

  // Robinhood
  {
    name: 'Robinhood Gold Card',
    issuer: 'Robinhood',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 3,
    categories: [
      { category: 'travel', multiplier: 5, note: 'Travel booked via Robinhood portal' }
    ],
    imageURL: 'https://cdn.robinhood.com/app_assets/credit-card/gold/web/shadow_card_desktop.png',
    imageColor: '#C5A85F'
  },

  // Apple Card
  {
    name: 'Apple Card',
    issuer: 'Apple',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'apple', multiplier: 3 },
      { category: 'other', multiplier: 2, note: 'Apple Pay purchases' }
    ],
    imageURL: null,
    imageColor: '#FFFFFF'
  }
];

// ============================================================================
// RETAIL CARDS
// ============================================================================
const RETAIL_CARDS = [
  {
    name: 'Target RedCard Credit',
    issuer: 'Target',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 0,
    categories: [
      { category: 'target', multiplier: 5 }
    ],
    imageURL: null,
    imageColor: '#CC0000'
  },
  {
    name: 'Walmart Rewards Card',
    issuer: 'Walmart',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'walmart', multiplier: 5, note: 'Walmart.com and Walmart app' },
      { category: 'grocery', multiplier: 2, note: 'Walmart stores' },
      { category: 'travel', multiplier: 2 },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#0071CE'
  },
  {
    name: 'Amazon Store Card',
    issuer: 'Amazon',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 0,
    categories: [
      { category: 'amazon', multiplier: 5 }
    ],
    imageURL: null,
    imageColor: '#FF9900'
  }
];

// ============================================================================
// SYNCHRONY CARDS
// ============================================================================
const SYNCHRONY_CARDS = [
  {
    name: 'Verizon Visa Card',
    issuer: 'Synchrony',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'phone', multiplier: 4, note: 'Verizon purchases' },
      { category: 'grocery', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: null,
    imageColor: '#CD040B'
  },
  {
    name: 'Sam\'s Club Mastercard',
    issuer: 'Synchrony',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'gas', multiplier: 5, cap: 6000, capPeriod: 'yearly' },
      { category: 'wholesale', multiplier: 3, note: 'Sam\'s Club purchases' },
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 3 }
    ],
    imageURL: null,
    imageColor: '#0067A5'
  }
];

async function scrapeOthers() {
  console.log('🏦 Others: Processing credit cards...');

  const allCards = [
    ...BARCLAYS_CARDS,
    ...CREDIT_UNION_CARDS,
    ...FINTECH_CARDS,
    ...RETAIL_CARDS,
    ...SYNCHRONY_CARDS
  ];

  const cards = allCards.map(cardData => {
    const categoryRewards = (cardData.categories || [])
      .map(cat => {
        const mappedCategory = mapCategory(cat.category);
        if (!mappedCategory) {
          console.warn(`  ⚠️ Unknown category '${cat.category}' in ${cardData.name}`);
          return null;
        }
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
      id: generateCardId(cardData.issuer, cardData.name),
      name: cardData.name,
      issuer: cardData.issuer,
      network: cardData.network || 'visa',
      annualFee: cardData.annualFee,
      rewardType: cardData.rewardType,
      baseReward: cardData.baseReward,
      baseIsPercentage: cardData.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: selectableConfig,
      signUpBonus: null,
      imageColor: cardData.imageColor || '#333333',
      imageURL: cardData.imageURL
    };
  });

  console.log(`  📊 Total: ${cards.length} cards from other issuers`);
  return cards;
}

if (require.main === module) {
  console.log('🧪 Testing Others Scraper...\n');
  scrapeOthers()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);

      // Group by issuer
      const byIssuer = {};
      cards.forEach(card => {
        if (!byIssuer[card.issuer]) byIssuer[card.issuer] = [];
        byIssuer[card.issuer].push(card);
      });

      Object.entries(byIssuer).forEach(([issuer, issuerCards]) => {
        console.log(`\n${issuer}: ${issuerCards.length} cards`);
        issuerCards.forEach(card => {
          console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
        });
      });
    })
    .catch(err => console.error('❌ Error:', err.message));
}

module.exports = scrapeOthers;
