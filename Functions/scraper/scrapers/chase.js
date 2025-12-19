/**
 * Chase Credit Card Scraper
 * Complete list of Chase consumer and business credit cards
 */

const puppeteer = require('puppeteer');
const { generateCardId, mapCategory } = require('../utils/categories');

const CHASE_CARDS = [
  // ========== SAPPHIRE SERIES ==========
  {
    name: 'Chase Sapphire Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3, note: 'online grocery purchases' },
      { category: 'streaming', multiplier: 3 },
      { category: 'travel', multiplier: 2, note: 'other travel purchases' }
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
      { category: 'travelPortal', multiplier: 10, note: 'hotels/car rentals through Chase Travel' },
      { category: 'travelPortalFlights', multiplier: 5, note: 'flights through Chase Travel' },
      { category: 'travel', multiplier: 3, note: 'all other travel' },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_reserve_card.png',
    imageColor: '#1A1F71'
  },

  // ========== FREEDOM SERIES ==========
  {
    name: 'Chase Freedom Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
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
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'drugstore', multiplier: 3 }
    ],
    rotating: { multiplier: 5, cap: 1500, capPeriod: 'quarterly', activationRequired: true },
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_flex_card.png',
    imageColor: '#00A4E4'
  },
  {
    name: 'Chase Freedom Rise',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_rise_card.png',
    imageColor: '#4A90D9'
  },
  {
    name: 'Chase Freedom Student',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_student_card.png',
    imageColor: '#0066B2'
  },

  // ========== INK BUSINESS SERIES ==========
  {
    name: 'Ink Business Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'shipping', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
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
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_cash_background.png',
    imageColor: '#2D6A4F'
  },
  {
    name: 'Ink Business Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_unlimited_background.png',
    imageColor: '#4895EF'
  },
  {
    name: 'Ink Business Premier',
    annualFee: 195,
    rewardType: 'cashback',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 2.5 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ink_premier_background.png',
    imageColor: '#1A1F71'
  },

  // ========== UNITED AIRLINES ==========
  {
    name: 'United Quest Card',
    annualFee: 250,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 3, note: 'United purchases' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_quest_background.png',
    imageColor: '#002244'
  },
  {
    name: 'United Explorer Card',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'hotels', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_explorer_background.png',
    imageColor: '#002244'
  },
  {
    name: 'United Gateway Card',
    annualFee: 0,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'transit', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_gateway_background.png',
    imageColor: '#0033A0'
  },
  {
    name: 'United Club Infinite Card',
    annualFee: 525,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 4, note: 'United purchases' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_club_infinite_background.png',
    imageColor: '#002244'
  },
  {
    name: 'United Business Card',
    annualFee: 99,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'officeSupplies', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/united_business_background.png',
    imageColor: '#002244'
  },

  // ========== SOUTHWEST AIRLINES ==========
  {
    name: 'Southwest Rapid Rewards Priority',
    annualFee: 149,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 3, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/southwest_priority_background.png',
    imageColor: '#304CB2'
  },
  {
    name: 'Southwest Rapid Rewards Plus',
    annualFee: 69,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 2, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/southwest_plus_background.png',
    imageColor: '#FFBF27'
  },
  {
    name: 'Southwest Rapid Rewards Premier',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 2, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/southwest_premier_background.png',
    imageColor: '#304CB2'
  },
  {
    name: 'Southwest Rapid Rewards Performance Business',
    annualFee: 199,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 4, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 3 },
      { category: 'internet', multiplier: 3 },
      { category: 'phone', multiplier: 3 },
      { category: 'advertising', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/southwest_performance_business_background.png',
    imageColor: '#304CB2'
  },

  // ========== HOTEL CARDS ==========
  {
    name: 'Marriott Bonvoy Boundless',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/marriott_background.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Bold',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'marriott', multiplier: 3, note: 'Marriott hotels' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/marriott_bold_background.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Bountiful',
    annualFee: 250,
    rewardType: 'points',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'dining', multiplier: 4 },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/marriott_bountiful_background.png',
    imageColor: '#8A2432'
  },
  {
    name: 'IHG One Rewards Premier',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 3,
    categories: [
      { category: 'ihg', multiplier: 26, note: 'IHG hotels' },
      { category: 'travel', multiplier: 5, note: 'travel, gas stations' },
      { category: 'dining', multiplier: 5 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ihg_rewards_premier.png',
    imageColor: '#005F3D'
  },
  {
    name: 'IHG One Rewards Traveler',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 3,
    categories: [
      { category: 'ihg', multiplier: 17, note: 'IHG hotels' },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'utilities', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/ihg_traveler_background.png',
    imageColor: '#005F3D'
  },
  {
    name: 'World of Hyatt Credit Card',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'hyatt', multiplier: 4, note: 'Hyatt purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'airlines', multiplier: 2 },
      { category: 'fitness', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/hyatt_background.png',
    imageColor: '#2C3E50'
  },
  {
    name: 'World of Hyatt Business Card',
    annualFee: 199,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'hyatt', multiplier: 4, note: 'Hyatt purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'fitness', multiplier: 2 },
      { category: 'shipping', multiplier: 2 },
      { category: 'advertising', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/hyatt_business_background.png',
    imageColor: '#2C3E50'
  },

  // ========== CO-BRAND CARDS ==========
  {
    name: 'Amazon Prime Rewards Visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 5 },
      { category: 'wholefoods', multiplier: 5 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'drugstore', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://m.media-amazon.com/images/G/01/credit/CBCC_Premium_RGB_600x388.png',
    imageColor: '#FF9900'
  },
  {
    name: 'Amazon Rewards Visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 3 },
      { category: 'wholefoods', multiplier: 3 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'drugstore', multiplier: 2 }
    ],
    imageURL: 'https://m.media-amazon.com/images/G/01/credit/card-background-amazon.png',
    imageColor: '#232F3E'
  },
  {
    name: 'Disney Visa Card',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'entertainment', multiplier: 1, note: 'Disney purchases' },
      { category: 'gas', multiplier: 1 },
      { category: 'grocery', multiplier: 1 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/disney_premier_background.png',
    imageColor: '#006E96'
  },
  {
    name: 'Disney Premier Visa Card',
    annualFee: 49,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'entertainment', multiplier: 2, note: 'Disney purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/disney_premier_background.png',
    imageColor: '#1E3A5F'
  },
  {
    name: 'Instacart Mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'instacart', multiplier: 5, note: 'Instacart purchases' },
      { category: 'grocery', multiplier: 2, note: 'other grocery' },
      { category: 'gas', multiplier: 2 },
      { category: 'dining', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/instacart_background.png',
    imageColor: '#43B02A'
  },
  {
    name: 'Aeroplan Credit Card',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'aircanada', multiplier: 3, note: 'Air Canada purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 1.5 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/aeroplan_background.png',
    imageColor: '#C8102E'
  },
  {
    name: 'British Airways Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'britishairways', multiplier: 3, note: 'British Airways purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/british_airways_background.png',
    imageColor: '#075AAA'
  },
  {
    name: 'Iberia Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'iberia', multiplier: 3, note: 'Iberia purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/iberia_background.png',
    imageColor: '#CB2127'
  },
  {
    name: 'Aer Lingus Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'aerlingus', multiplier: 3, note: 'Aer Lingus purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/aerlingus_background.png',
    imageColor: '#006272'
  },
  {
    name: 'DoorDash Rewards Mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'doordash', multiplier: 4, note: 'DoorDash orders' },
      { category: 'dining', multiplier: 3, note: 'other dining' },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/doordash_background.png',
    imageColor: '#FF3008'
  },
  {
    name: 'Starbucks Rewards Visa Card',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'starbucks', multiplier: 3, note: 'Starbucks purchases' },
      { category: 'grocery', multiplier: 1 }
    ],
    imageURL: 'https://creditcards.chase.com/K-Marketplace/images/cardart/starbucks_background.png',
    imageColor: '#00704A'
  }
];

async function scrapeChase() {
  const cards = CHASE_CARDS.map(card => formatCard('Chase', card));

  // Try to scrape live data for images
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set longer timeout and user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto('https://creditcards.chase.com/all-credit-cards', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Extract card images from the page
    const liveImages = await page.evaluate(() => {
      const images = {};
      const cardElements = document.querySelectorAll('[data-card-name], .card-art img, .cardart img');
      cardElements.forEach(el => {
        const cardName = el.getAttribute('data-card-name') || el.getAttribute('alt') || '';
        const imgSrc = el.tagName === 'IMG' ? el.src : el.querySelector('img')?.src;
        if (cardName && imgSrc) {
          images[cardName.toLowerCase()] = imgSrc;
        }
      });
      return images;
    });

    await browser.close();

    // Merge live images
    cards.forEach(card => {
      const key = card.name.toLowerCase();
      if (liveImages[key] && !card.imageURL) {
        card.imageURL = liveImages[key];
      }
    });
  } catch (error) {
    console.log(`   Using cached data (live scrape failed: ${error.message})`);
  }

  return cards;
}

function formatCard(issuer, cardData) {
  // Map categories to iOS SpendingCategory enum values
  const categoryRewards = (cardData.categories || [])
    .map(cat => {
      const mappedCategory = mapCategory(cat.category);
      if (!mappedCategory) {
        console.warn(`  ⚠️  Unknown category '${cat.category}' in ${cardData.name}, skipping`);
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

  if (cardData.rotating) {
    const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
    const currentYear = new Date().getFullYear();

    // 2025 rotating categories (updated Dec 2025)
    // Note: These are raw categories that will be mapped to iOS SpendingCategory
    const CHASE_ROTATING = {
      1: ['grocery', 'fitness', 'fitness'],  // hairSalon maps to fitness
      2: ['amazon', 'streaming'],
      3: ['grocery', 'entertainment', 'gas', 'evCharging'],  // instacart maps to grocery
      4: ['travel', 'other', 'paypal']  // chaseTravel->travel, departmentStores->other
    };

    // Map rotating categories to iOS values
    const rawCategories = CHASE_ROTATING[currentQuarter] || ['grocery', 'gas'];
    const mappedCategories = [...new Set(rawCategories.map(cat => mapCategory(cat)).filter(Boolean))];

    card.rotatingCategories = [{
      quarter: currentQuarter,
      year: currentYear,
      categories: mappedCategories,
      multiplier: cardData.rotating.multiplier,
      isPercentage: cardData.rewardType === 'cashback',
      cap: cardData.rotating.cap,
      activationRequired: cardData.rotating.activationRequired
    }];
  }

  return card;
}

module.exports = scrapeChase;
