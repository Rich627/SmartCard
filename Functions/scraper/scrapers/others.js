/**
 * Other Credit Card Issuers Scraper
 * Barclays, Credit Unions, Fintech, and Other Issuers
 */

const { generateCardId } = require('../utils/categories');

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
      { category: 'americanairlines', multiplier: 2, note: 'American Airlines purchases' }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/aviator-red.png',
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
      { category: 'americanairlines', multiplier: 2, note: 'American Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/aviator-silver.png',
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
      { category: 'jetblue', multiplier: 6, note: 'JetBlue purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/jetblue-plus.png',
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
      { category: 'jetblue', multiplier: 3, note: 'JetBlue purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/jetblue.png',
    imageColor: '#003876'
  },
  {
    name: 'JetBlue Business Card',
    issuer: 'Barclays',
    annualFee: 99,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'jetblue', multiplier: 6, note: 'JetBlue purchases' },
      { category: 'phone', multiplier: 2 },
      { category: 'officeSupplies', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/jetblue-business.png',
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
      { category: 'wyndham', multiplier: 6, note: 'Wyndham purchases' },
      { category: 'gas', multiplier: 4 },
      { category: 'grocery', multiplier: 4 },
      { category: 'utilities', multiplier: 4 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/wyndham-plus.png',
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
      { category: 'wyndham', multiplier: 5, note: 'Wyndham purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'grocery', multiplier: 2 },
      { category: 'utilities', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/wyndham.png',
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
      { category: 'hawaiian', multiplier: 3, note: 'Hawaiian Airlines purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/hawaiian.png',
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
      { category: 'frontier', multiplier: 3, note: 'Frontier purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'entertainment', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/frontier.png',
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
      { category: 'priceline', multiplier: 5, note: 'Priceline purchases' },
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.barclaycardus.com/banking/cards/priceline.png',
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
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'transit', multiplier: 3 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.navyfederal.org/content/dam/nfcu/images/cards/more-rewards.png',
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
    imageURL: 'https://www.navyfederal.org/content/dam/nfcu/images/cards/cashrewards.png',
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
    imageURL: 'https://www.navyfederal.org/content/dam/nfcu/images/cards/flagship.png',
    imageColor: '#0A2240'
  },
  {
    name: 'Navy Federal Go Rewards',
    issuer: 'Navy Federal',
    annualFee: 0,
    rewardType: 'points',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'gas', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://www.navyfederal.org/content/dam/nfcu/images/cards/gorewards.png',
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
    imageURL: 'https://www.penfed.org/content/dam/penfed/cards/platinum-rewards.png',
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
    imageURL: 'https://www.penfed.org/content/dam/penfed/cards/power-cash.png',
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
    imageURL: 'https://www.penfed.org/content/dam/penfed/cards/pathfinder.png',
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
    imageURL: 'https://www.alliantcreditunion.org/images/cards/cashback.png',
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
    imageURL: 'https://www.usaa.com/content/dam/usaa/cards/cashback-plus.png',
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
    imageURL: 'https://www.usaa.com/content/dam/usaa/cards/preferred-cash.png',
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
    imageURL: 'https://www.usaa.com/content/dam/usaa/cards/limitless.png',
    imageColor: '#1A2E5A'
  }
];

// ============================================================================
// FINTECH CARDS
// ============================================================================
const FINTECH_CARDS = [
  // Bilt
  {
    name: 'Bilt Mastercard',
    issuer: 'Bilt',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'dining', multiplier: 3 },
      { category: 'travel', multiplier: 2 },
      { category: 'rent', multiplier: 1, note: 'rent payments with no fee' }
    ],
    imageURL: 'https://www.biltrewards.com/assets/images/bilt-card.png',
    imageColor: '#000000'
  },

  // PayPal
  {
    name: 'PayPal Cashback Mastercard',
    issuer: 'PayPal',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'mastercard',
    baseReward: 2,
    categories: [
      { category: 'paypal', multiplier: 3 }
    ],
    imageURL: 'https://www.paypal.com/content/dam/paypal/cards/cashback-mastercard.png',
    imageColor: '#003087'
  },
  {
    name: 'PayPal Extras Mastercard',
    issuer: 'PayPal',
    annualFee: 0,
    rewardType: 'points',
    network: 'mastercard',
    baseReward: 1,
    categories: [
      { category: 'paypal', multiplier: 3 },
      { category: 'gas', multiplier: 2 },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://www.paypal.com/content/dam/paypal/cards/extras.png',
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
    imageURL: 'https://venmo.com/content/dam/venmo/cards/venmo-credit-card.png',
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
    imageURL: 'https://www.sofi.com/content/dam/sofi/cards/credit-card.png',
    imageColor: '#4C00FF'
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
    imageURL: 'https://www.apple.com/v/apple-card/f/images/overview/hero__gb2doqnozq2e_large.png',
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
    imageURL: 'https://www.target.com/content/dam/target/cards/redcard.png',
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
      { category: 'walmartOnline', multiplier: 5, note: 'Walmart.com and Walmart app' },
      { category: 'walmart', multiplier: 2, note: 'Walmart stores' },
      { category: 'travel', multiplier: 2 },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://www.walmart.com/content/dam/walmart/cards/rewards.png',
    imageColor: '#0071CE'
  },
  {
    name: 'Costco Anywhere Visa by Citi',
    issuer: 'Costco',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'gas', multiplier: 4, cap: 7000, capPeriod: 'yearly' },
      { category: 'travel', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'wholesale', multiplier: 2 }
    ],
    imageURL: 'https://www.costco.com/content/dam/costco/cards/anywhere-visa.png',
    imageColor: '#E21836'
  },
  {
    name: 'Amazon Store Card',
    issuer: 'Amazon',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'other',
    baseReward: 0,
    categories: [
      { category: 'amazon', multiplier: 5 }
    ],
    imageURL: 'https://m.media-amazon.com/images/G/01/credit/store-card.png',
    imageColor: '#FF9900'
  }
];

// ============================================================================
// SYNCHRONY CARDS
// ============================================================================
const SYNCHRONY_CARDS = [
  {
    name: 'Cathay Pacific Credit Card',
    issuer: 'Synchrony',
    annualFee: 0,
    rewardType: 'miles',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'cathaypacific', multiplier: 3, note: 'Cathay Pacific purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://www.synchrony.com/content/dam/synchrony/cards/cathay-pacific.png',
    imageColor: '#005E50'
  },
  {
    name: 'Verizon Visa Card',
    issuer: 'Synchrony',
    annualFee: 0,
    rewardType: 'cashback',
    network: 'visa',
    baseReward: 1,
    categories: [
      { category: 'verizon', multiplier: 4, note: 'Verizon purchases' },
      { category: 'grocery', multiplier: 2 },
      { category: 'gas', multiplier: 2 }
    ],
    imageURL: 'https://www.verizon.com/content/dam/verizon/cards/visa.png',
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
    imageURL: 'https://www.samsclub.com/content/dam/samsclub/cards/mastercard.png',
    imageColor: '#0067A5'
  }
];

async function scrapeOthers() {
  const allCards = [
    ...BARCLAYS_CARDS,
    ...CREDIT_UNION_CARDS,
    ...FINTECH_CARDS,
    ...RETAIL_CARDS,
    ...SYNCHRONY_CARDS
  ];

  return allCards.map(card => formatCard(card));
}

function formatCard(cardData) {
  const categoryRewards = (cardData.categories || []).map(cat => ({
    category: cat.category,
    multiplier: cat.multiplier,
    isPercentage: cardData.rewardType === 'cashback',
    cap: cat.cap || null,
    capPeriod: cat.capPeriod || null
  }));

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
    selectableConfig: cardData.selectableConfig || null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#333333',
    imageURL: cardData.imageURL || null
  };
}

module.exports = scrapeOthers;
