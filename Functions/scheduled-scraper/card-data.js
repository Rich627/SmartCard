/**
 * Consolidated credit card data for Cloud Function
 *
 * This file contains all credit card reward data in a single module
 * for use with Firebase Cloud Functions.
 *
 * Last updated: 2025-01
 */

function generateCardId(issuer, cardName) {
  return `${issuer.toLowerCase().replace(/\s+/g, '-')}-${cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

// ============================================================================
// CHASE CARDS
// ============================================================================
const CHASE_CARDS = [
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'onlineShopping', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png',
    imageColor: '#0A3161'
  },
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 550,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 10, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_reserve_card.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: true, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'drugstore', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_redesign_light.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: true, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'drugstore', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    rotatingCategories: getRotatingCategories('chase'),
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_flex_card.png',
    imageColor: '#00A4E4'
  },
  {
    name: 'Chase Freedom Rise',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_rise_card.png',
    imageColor: '#4A90D9'
  },
  {
    name: 'Ink Business Preferred',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: 150000, capPeriod: 'yearly' },
      { category: 'shipping', multiplier: 3, isPercentage: false, cap: 150000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 3, isPercentage: false, cap: 150000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 3, isPercentage: false, cap: 150000, capPeriod: 'yearly' },
      { category: 'advertising', multiplier: 3, isPercentage: false, cap: 150000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_business_preferred2.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Ink Business Cash',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'officeSupplies', multiplier: 5, isPercentage: true, cap: 25000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 5, isPercentage: true, cap: 25000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 5, isPercentage: true, cap: 25000, capPeriod: 'yearly' },
      { category: 'gas', multiplier: 2, isPercentage: true, cap: 25000, capPeriod: 'yearly' },
      { category: 'dining', multiplier: 2, isPercentage: true, cap: 25000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_business_cash_background.png',
    imageColor: '#2D6A4F'
  },
  {
    name: 'Ink Business Unlimited',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_unlimited_background.png',
    imageColor: '#4895EF'
  },
  {
    name: 'Amazon Prime Rewards Visa',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'amazon', multiplier: 5, isPercentage: true, cap: null, capPeriod: null },
      { category: 'wholeFoods', multiplier: 5, isPercentage: true, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: true, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 2, isPercentage: true, cap: null, capPeriod: null },
      { category: 'drugstore', multiplier: 2, isPercentage: true, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 2, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://m.media-amazon.com/images/G/01/credit/CBCC_Premium_RGB_600x388.png',
    imageColor: '#FF9900'
  },
  {
    name: 'World of Hyatt Credit Card',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 4, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'fitness', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/hyatt_background.png',
    imageColor: '#2C3E50'
  },
  {
    name: 'IHG One Rewards Premier',
    issuer: 'Chase',
    network: 'mastercard',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 3,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 26, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 5, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ihg_rewards_premier.png',
    imageColor: '#005F3D'
  },
  {
    name: 'United Quest Card',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 250,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_quest_background.png',
    imageColor: '#002244'
  },
  {
    name: 'United Explorer Card',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_explorer_background.png',
    imageColor: '#002244'
  },
  {
    name: 'Southwest Rapid Rewards Priority',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 149,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'internet', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'phone', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/southwest_priority_background.png',
    imageColor: '#304CB2'
  },
  {
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 2,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 6, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/marriott_background.png',
    imageColor: '#8A2432'
  }
];

// ============================================================================
// AMERICAN EXPRESS CARDS
// ============================================================================
const AMEX_CARDS = [
  {
    name: 'American Express Gold Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 250,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'dining', multiplier: 4, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 4, isPercentage: false, cap: 25000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/gold-card.png',
    imageColor: '#B8860B'
  },
  {
    name: 'American Express Platinum Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 695,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/platinum-card.png',
    imageColor: '#E5E4E2'
  },
  {
    name: 'American Express Green Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 150,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/green-card.png',
    imageColor: '#228B22'
  },
  {
    name: 'Blue Cash Preferred',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 95,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'grocery', multiplier: 6, isPercentage: true, cap: 6000, capPeriod: 'yearly' },
      { category: 'streaming', multiplier: 6, isPercentage: true, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/blue-cash-preferred.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Blue Cash Everyday',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'grocery', multiplier: 3, isPercentage: true, cap: 6000, capPeriod: 'yearly' },
      { category: 'gas', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'onlineShopping', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/blue-cash-everyday.png',
    imageColor: '#5DADE2'
  },
  {
    name: 'Hilton Honors',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 3,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 7, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 5, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/hilton-honors.png',
    imageColor: '#104C97'
  },
  {
    name: 'Hilton Honors Surpass',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 150,
    rewardType: 'points',
    baseReward: 3,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 12, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 6, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 6, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 6, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/hilton-surpass.png',
    imageColor: '#0D3B66'
  },
  {
    name: 'Hilton Honors Aspire',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 550,
    rewardType: 'points',
    baseReward: 3,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 14, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 7, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/hilton-aspire.png',
    imageColor: '#1B1B3A'
  },
  {
    name: 'Delta SkyMiles Gold',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 150,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/delta-gold.png',
    imageColor: '#C41E3A'
  },
  {
    name: 'Delta SkyMiles Platinum',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 350,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/delta-platinum.png',
    imageColor: '#0A2647'
  },
  {
    name: 'Delta SkyMiles Reserve',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 650,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/delta-reserve.png',
    imageColor: '#1E3A5F'
  },
  {
    name: 'Marriott Bonvoy Brilliant',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 650,
    rewardType: 'points',
    baseReward: 2,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 6, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/marriott-brilliant.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Blue Business Plus',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'other', multiplier: 2, isPercentage: false, cap: 50000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/blue-business-plus.png',
    imageColor: '#2E86AB'
  },
  {
    name: 'Business Gold Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 375,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [],
    selectableConfig: {
      maxSelections: 2,
      availableCategories: ['advertising', 'shipping', 'gas', 'travel', 'phone', 'officeSupplies'],
      multiplier: 4,
      isPercentage: false,
      cap: 150000,
      capPeriod: 'yearly'
    },
    imageURL: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/open/category/cardarts/business-gold.png',
    imageColor: '#B8860B'
  }
];

// ============================================================================
// CITI CARDS
// ============================================================================
const CITI_CARDS = [
  {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 2,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png',
    imageColor: '#003B70'
  },
  {
    name: 'Citi Custom Cash',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['dining', 'grocery', 'gas', 'travel', 'drugstore', 'homeImprovement', 'fitness', 'streaming', 'transit'],
      multiplier: 5,
      isPercentage: true,
      cap: 500,
      capPeriod: 'monthly'
    },
    imageURL: 'https://www.citi.com/CRD/images/custom-cash/custom-cash-background.png',
    imageColor: '#00BCD4'
  },
  {
    name: 'Citi Premier',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.citi.com/CRD/images/premier/citi-premier-background.png',
    imageColor: '#002D62'
  },
  {
    name: 'Citi Strata Premier',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 10, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.citi.com/CRD/images/strata-premier/strata-premier-background.png',
    imageColor: '#1A365D'
  },
  {
    name: 'Costco Anywhere Visa',
    issuer: 'Citi',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'gas', multiplier: 4, isPercentage: true, cap: 7000, capPeriod: 'yearly' },
      { category: 'travel', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'wholesale', multiplier: 2, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.citi.com/CRD/images/costco/costco-background.png',
    imageColor: '#E21836'
  }
];

// ============================================================================
// CAPITAL ONE CARDS
// ============================================================================
const CAPITALONE_CARDS = [
  {
    name: 'Capital One Savor',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 95,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'dining', multiplier: 4, isPercentage: true, cap: null, capPeriod: null },
      { category: 'entertainment', multiplier: 4, isPercentage: true, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 4, isPercentage: true, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savor-background.png',
    imageColor: '#ED1B24'
  },
  {
    name: 'Capital One SavorOne',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'dining', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'entertainment', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 3, isPercentage: true, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 3, isPercentage: true, cap: null, capPeriod: null }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/savorone-background.png',
    imageColor: '#C41230'
  },
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 395,
    rewardType: 'miles',
    baseReward: 2,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 10, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venturex-background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Capital One Venture',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 2,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/venture-background.png',
    imageColor: '#004977'
  },
  {
    name: 'Capital One VentureOne',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 0,
    rewardType: 'miles',
    baseReward: 1.25,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/ventureone-background.png',
    imageColor: '#0066A1'
  },
  {
    name: 'Capital One Quicksilver',
    issuer: 'Capital One',
    network: 'mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://ecm.capitalone.com/WCM/card/products/quicksilver-background.png',
    imageColor: '#004879'
  }
];

// ============================================================================
// DISCOVER CARDS
// ============================================================================
const DISCOVER_CARDS = [
  {
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [],
    rotatingCategories: getRotatingCategories('discover'),
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/cash-back/background.png',
    imageColor: '#FF6600'
  },
  {
    name: 'Discover it Chrome',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'gas', multiplier: 2, isPercentage: true, cap: 1000, capPeriod: 'quarterly' },
      { category: 'dining', multiplier: 2, isPercentage: true, cap: 1000, capPeriod: 'quarterly' }
    ],
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/chrome/background.png',
    imageColor: '#868686'
  },
  {
    name: 'Discover it Miles',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    rewardType: 'miles',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/miles/background.png',
    imageColor: '#1E90FF'
  },
  {
    name: 'Discover it Student Cash Back',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [],
    rotatingCategories: getRotatingCategories('discover'),
    imageURL: 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/student/background.png',
    imageColor: '#FF6600'
  }
];

// ============================================================================
// BANK OF AMERICA CARDS
// ============================================================================
const BOFA_CARDS = [
  {
    name: 'Bank of America Customized Cash Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [
      { category: 'onlineShopping', multiplier: 2, isPercentage: true, cap: null, capPeriod: null }
    ],
    selectableConfig: {
      maxSelections: 1,
      availableCategories: ['gas', 'onlineShopping', 'dining', 'travel', 'drugstore', 'homeImprovement'],
      multiplier: 3,
      isPercentage: true,
      cap: 2500,
      capPeriod: 'quarterly'
    },
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Cash_Rewards/customized-cash-background.png',
    imageColor: '#C41230'
  },
  {
    name: 'Bank of America Premium Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1.5,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Premium_Rewards/premium_rewards_background.png',
    imageColor: '#012169'
  },
  {
    name: 'Bank of America Premium Rewards Elite',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 550,
    rewardType: 'points',
    baseReward: 1.5,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Premium_Rewards_Elite/premium_rewards_elite_background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Bank of America Travel Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1.5,
    baseIsPercentage: false,
    categoryRewards: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Travel_Rewards/travel_rewards_background.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Bank of America Unlimited Cash Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Rewards/en_US/Unlimited_Cash/unlimited_cash_background.png',
    imageColor: '#C41230'
  },
  {
    name: 'Alaska Airlines Visa',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Co-Brand/en_US/Alaska/alaska_signature_background.png',
    imageColor: '#01426A'
  }
];

// ============================================================================
// WELLS FARGO CARDS
// ============================================================================
const WELLSFARGO_CARDS = [
  {
    name: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 2,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-Background/active-cash-background.png',
    imageColor: '#D71E28'
  },
  {
    name: 'Wells Fargo Autograph',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'travel', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'phone', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-Background/autograph-background.png',
    imageColor: '#FFCD00'
  },
  {
    name: 'Wells Fargo Autograph Journey',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'transit', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-Background/autograph-journey-background.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Wells Fargo Reflect',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 0,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://creditcards.wellsfargo.com/W-Card-Background/reflect-background.png',
    imageColor: '#5DADE2'
  },
  {
    name: 'Bilt Mastercard',
    issuer: 'Wells Fargo',
    network: 'mastercard',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null },
      { category: 'travel', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.biltrewards.com/static/media/card-front.png',
    imageColor: '#000000'
  }
];

// ============================================================================
// US BANK CARDS
// ============================================================================
const USBANK_CARDS = [
  {
    name: 'US Bank Altitude Go',
    issuer: 'US Bank',
    network: 'visa',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'dining', multiplier: 4, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'evCharging', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-go-background.png',
    imageColor: '#00529B'
  },
  {
    name: 'US Bank Altitude Connect',
    issuer: 'US Bank',
    network: 'visa',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'gas', multiplier: 4, isPercentage: false, cap: null, capPeriod: null },
      { category: 'evCharging', multiplier: 4, isPercentage: false, cap: null, capPeriod: null },
      { category: 'streaming', multiplier: 2, isPercentage: false, cap: null, capPeriod: null },
      { category: 'grocery', multiplier: 2, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-connect-background.png',
    imageColor: '#0072CE'
  },
  {
    name: 'US Bank Altitude Reserve',
    issuer: 'US Bank',
    network: 'visa',
    annualFee: 400,
    rewardType: 'points',
    baseReward: 1,
    baseIsPercentage: false,
    categoryRewards: [
      { category: 'travel', multiplier: 5, isPercentage: false, cap: null, capPeriod: null },
      { category: 'dining', multiplier: 3, isPercentage: false, cap: null, capPeriod: null }
    ],
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/altitude-reserve-background.png',
    imageColor: '#002855'
  },
  {
    name: 'US Bank Cash+',
    issuer: 'US Bank',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    baseIsPercentage: true,
    categoryRewards: [],
    selectableConfig: {
      maxSelections: 2,
      availableCategories: ['gas', 'grocery', 'dining', 'homeImprovement', 'utilities', 'phone', 'fitness', 'streaming', 'transit', 'electronics'],
      multiplier: 5,
      isPercentage: true,
      cap: 2000,
      capPeriod: 'quarterly'
    },
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/cash-plus-background.png',
    imageColor: '#0047AB'
  },
  {
    name: 'US Bank Smartly',
    issuer: 'US Bank',
    network: 'visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 2,
    baseIsPercentage: true,
    categoryRewards: [],
    imageURL: 'https://www.usbank.com/content/dam/usbank/credit-cards/smartly-background.png',
    imageColor: '#00A9E0'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getRotatingCategories(issuer) {
  const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
  const currentYear = new Date().getFullYear();

  // Q1 2025 rotating categories (example - update quarterly)
  const ROTATING_2025 = {
    chase: {
      Q1: ['grocery', 'fitness'],
      Q2: ['gas', 'homeImprovement', 'evCharging'],
      Q3: ['dining', 'drugstore'],
      Q4: ['amazon', 'walmart', 'target']
    },
    discover: {
      Q1: ['grocery', 'fitness'],
      Q2: ['gas', 'homeImprovement', 'evCharging'],
      Q3: ['dining', 'drugstore'],
      Q4: ['amazon', 'walmart', 'target', 'onlineShopping']
    }
  };

  const quarterKey = `Q${currentQuarter}`;
  const categories = ROTATING_2025[issuer]?.[quarterKey] || ['grocery', 'gas'];

  return [
    {
      quarter: currentQuarter,
      year: currentYear,
      categories: categories,
      multiplier: 5,
      isPercentage: true,
      cap: 1500,
      activationRequired: true
    }
  ];
}

function getAllCards() {
  const allCards = [
    ...CHASE_CARDS,
    ...AMEX_CARDS,
    ...CITI_CARDS,
    ...CAPITALONE_CARDS,
    ...DISCOVER_CARDS,
    ...BOFA_CARDS,
    ...WELLSFARGO_CARDS,
    ...USBANK_CARDS
  ];

  // Add IDs and ensure all required fields
  return allCards.map(card => ({
    id: generateCardId(card.issuer, card.name),
    ...card,
    rotatingCategories: card.rotatingCategories || null,
    selectableConfig: card.selectableConfig || null,
    signUpBonus: card.signUpBonus || null
  }));
}

module.exports = {
  getAllCards,
  CHASE_CARDS,
  AMEX_CARDS,
  CITI_CARDS,
  CAPITALONE_CARDS,
  DISCOVER_CARDS,
  BOFA_CARDS,
  WELLSFARGO_CARDS,
  USBANK_CARDS
};
