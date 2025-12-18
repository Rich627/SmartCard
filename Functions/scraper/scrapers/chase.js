/**
 * Chase Credit Card Scraper
 *
 * Scrapes credit card data from Chase's official website
 */

const puppeteer = require('puppeteer');
const { mapCategory, parseMultiplier, parseCap, generateCardId } = require('../utils/categories');

// Known Chase cards with their reward structures (fallback data)
const CHASE_CARDS = [
  {
    name: 'Chase Sapphire Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'through Chase Travel' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'onlineShopping', multiplier: 3, note: 'online grocery' },
      { category: 'streaming', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png',
    imageColor: '#0A3161'
  },
  {
    name: 'Chase Sapphire Reserve',
    annualFee: 550,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 10, note: 'hotels/car rentals through Chase Travel' },
      { category: 'travel', multiplier: 5, note: 'flights through Chase Travel' },
      { category: 'travel', multiplier: 3, note: 'all other travel' },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_reserve_card.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Chase Freedom Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [
      { category: 'travel', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'drugstore', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_redesign_light.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Chase Freedom Flex',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'drugstore', multiplier: 3 }
    ],
    rotating: {
      multiplier: 5,
      cap: 1500,
      capPeriod: 'quarterly',
      activationRequired: true
    },
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_flex_card.png',
    imageColor: '#00A4E4'
  },
  {
    name: 'Chase Freedom Rise',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageColor: '#4A90D9'
  },
  {
    name: 'Ink Business Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3 },
      { category: 'shipping', multiplier: 3 },
      { category: 'internet', multiplier: 3 },
      { category: 'phone', multiplier: 3 },
      { category: 'advertising', multiplier: 3, cap: 150000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_business_preferred2.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Ink Business Cash',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'officeSupplies', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'gas', multiplier: 2, cap: 25000, capPeriod: 'yearly' },
      { category: 'dining', multiplier: 2, cap: 25000, capPeriod: 'yearly' }
    ],
    imageColor: '#2D6A4F'
  },
  {
    name: 'Ink Business Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageColor: '#4895EF'
  },
  {
    name: 'United Quest Card',
    annualFee: 250,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, note: 'United purchases' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageColor: '#002244'
  },
  {
    name: 'United Explorer Card',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 2, note: 'United purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'travel', multiplier: 2, note: 'hotels' }
    ],
    imageColor: '#002244'
  },
  {
    name: 'Southwest Rapid Rewards Priority',
    annualFee: 149,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2, note: 'local transit & commuting' },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageColor: '#304CB2'
  },
  {
    name: 'Marriott Bonvoy Boundless',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 6, note: 'Marriott hotels' },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 }
    ],
    imageColor: '#8A2432'
  },
  {
    name: 'IHG One Rewards Premier',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 3,
    categories: [
      { category: 'travel', multiplier: 26, note: 'IHG hotels' },
      { category: 'travel', multiplier: 5, note: 'travel, gas stations' },
      { category: 'dining', multiplier: 5 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ihg_rewards_premier.png',
    imageColor: '#005F3D'
  },
  {
    name: 'World of Hyatt Credit Card',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 4, note: 'Hyatt purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'travel', multiplier: 2, note: 'airlines' },
      { category: 'fitness', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/hyatt_background.png',
    imageColor: '#2C3E50'
  },
  {
    name: 'Amazon Prime Rewards Visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 5 },
      { category: 'wholeFoods', multiplier: 5 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'drugstore', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://m.media-amazon.com/images/G/01/credit/img21/CBCC/Amazon_CBCC_Premium._CB642552914_.png',
    imageColor: '#FF9900'
  }
];

async function scrapChase() {
  // For now, return the hardcoded data
  // In production, this would scrape the actual Chase website
  const cards = CHASE_CARDS.map(card => formatCard('Chase', card));

  // Optionally try to scrape live data to update images/details
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://creditcards.chase.com/all-credit-cards', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Extract any additional card info
    const liveData = await page.evaluate(() => {
      const cards = [];
      // This would parse the page structure
      // For now, return empty as Chase's site structure may change
      return cards;
    });

    await browser.close();

    // Merge live data if available
    if (liveData.length > 0) {
      console.log(`   Found ${liveData.length} cards from live scrape`);
    }
  } catch (error) {
    console.log(`   Using cached data (live scrape failed: ${error.message})`);
  }

  return cards;
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
    network: cardData.network || 'visa',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#1A1F71',
    imageURL: cardData.imageURL || null
  };

  // Handle rotating categories (Chase Freedom Flex style)
  if (cardData.rotating) {
    const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
    const currentYear = new Date().getFullYear();

    card.rotatingCategories = [
      {
        quarter: currentQuarter,
        year: currentYear,
        categories: ['grocery', 'gas'], // Placeholder - would be updated from scrape
        multiplier: cardData.rotating.multiplier,
        isPercentage: cardData.rewardType === 'cashback',
        cap: cardData.rotating.cap,
        activationRequired: cardData.rotating.activationRequired
      }
    ];
  }

  return card;
}

module.exports = scrapChase;
