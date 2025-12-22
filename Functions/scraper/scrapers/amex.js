/**
 * American Express Credit Card Scraper
 * Extracts embedded JSON data from Amex website
 */

const https = require('https');
const { generateCardId, mapCategory } = require('../utils/categories');

// Card slugs that appear in Amex's embedded data
const AMEX_CARDS = [
  // Core Cards
  { slug: 'platinum', name: 'American Express Platinum Card', annualFee: 695, rewardType: 'points' },
  { slug: 'gold-card', name: 'American Express Gold Card', annualFee: 250, rewardType: 'points' },
  { slug: 'green', name: 'American Express Green Card', annualFee: 150, rewardType: 'points' },

  // Blue Cash Series
  { slug: 'blue-cash-preferred', name: 'Blue Cash Preferred Card', annualFee: 95, rewardType: 'cashback' },
  { slug: 'blue-cash-everyday', name: 'Blue Cash Everyday Card', annualFee: 0, rewardType: 'cashback' },
  { slug: 'cash-magnet', name: 'Cash Magnet Card', annualFee: 0, rewardType: 'cashback' },

  // Everyday Series
  { slug: 'amex-everyday', name: 'Amex EveryDay Card', annualFee: 0, rewardType: 'points' },
  { slug: 'amex-everyday-preferred', name: 'Amex EveryDay Preferred Card', annualFee: 95, rewardType: 'points' },

  // Hilton
  { slug: 'hilton-honors', name: 'Hilton Honors American Express Card', annualFee: 0, rewardType: 'points' },
  { slug: 'hilton-honors-surpass', name: 'Hilton Honors American Express Surpass Card', annualFee: 150, rewardType: 'points' },
  { slug: 'hilton-honors-aspire', name: 'Hilton Honors American Express Aspire Card', annualFee: 550, rewardType: 'points' },

  // Marriott
  { slug: 'marriott-bonvoy', name: 'Marriott Bonvoy American Express Card', annualFee: 95, rewardType: 'points' },
  { slug: 'marriott-bonvoy-bevy', name: 'Marriott Bonvoy Bevy American Express Card', annualFee: 250, rewardType: 'points' },
  { slug: 'marriott-bonvoy-brilliant', name: 'Marriott Bonvoy Brilliant American Express Card', annualFee: 650, rewardType: 'points' },

  // Delta
  { slug: 'delta-skymiles-blue-american-express-card', name: 'Delta SkyMiles Blue American Express Card', annualFee: 0, rewardType: 'miles' },
  { slug: 'delta-skymiles-gold-american-express-card', name: 'Delta SkyMiles Gold American Express Card', annualFee: 150, rewardType: 'miles' },
  { slug: 'delta-skymiles-platinum-american-express-card', name: 'Delta SkyMiles Platinum American Express Card', annualFee: 350, rewardType: 'miles' },
  { slug: 'delta-skymiles-reserve-american-express-card', name: 'Delta SkyMiles Reserve American Express Card', annualFee: 650, rewardType: 'miles' }
];

// Image URLs for Amex cards
const AMEX_IMAGES = {
  'platinum': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-card.png',
  'gold-card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png',
  'green': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/green-card.png',
  'blue-cash-preferred': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-preferred.png',
  'blue-cash-everyday': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-everyday.png',
  'cash-magnet': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/cash-magnet.png',
  'amex-everyday': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/amex-everyday.png',
  'amex-everyday-preferred': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/amex-everyday-preferred.png',
  'hilton-honors': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors.png',
  'hilton-honors-surpass': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors-surpass.png',
  'hilton-honors-aspire': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors-aspire.png',
  'marriott-bonvoy': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy.png',
  'marriott-bonvoy-bevy': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy-bevy.png',
  'marriott-bonvoy-brilliant': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy-brilliant.png',
  'delta-skymiles-blue-american-express-card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-blue.png',
  'delta-skymiles-gold-american-express-card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-gold.png',
  'delta-skymiles-platinum-american-express-card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-platinum.png',
  'delta-skymiles-reserve-american-express-card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-reserve.png'
};

/**
 * Fetch page content
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity'
      },
      timeout: 20000
    };

    const req = https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchPage(redirectUrl).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

/**
 * Extract embedded cardData JSON from HTML
 * Uses simple string matching to find card reward sections
 */
function extractCardData(html) {
  const cardDataMap = {};

  for (const card of AMEX_CARDS) {
    const slug = card.slug;
    // Search for: slug\",[[\"^ \",\"header
    // In JS string: slug + '\\",[[\\\"^ \\\",\\\"header'
    const searchPattern = slug + '\\",[[\\\"^ \\\",\\\"header';
    const idx = html.indexOf(searchPattern);

    if (idx !== -1) {
      // Find the end of this reward array (next ]])
      const endIdx = html.indexOf(']]', idx);
      if (endIdx !== -1) {
        const content = html.substring(idx, endIdx + 2);
        const rewards = parseRewardArray(content, card.rewardType);
        if (rewards.length > 0) {
          cardDataMap[slug] = rewards;
        }
      }
    }
  }

  return cardDataMap;
}

/**
 * Parse a reward array from embedded JSON string
 * Content has backslash-escaped quotes: \"header\",\"6%\"
 */
function parseRewardArray(content, rewardType) {
  const rewards = [];

  // Pattern to match: \"header\",\"VALUE\",\"subHeader\",\"TYPE\",\"title\",\"CATEGORY\"
  // In regex: \" needs to be escaped as \\\"
  const rewardPattern = /\\"header\\",\\"([^"\\]+)\\",\\"subHeader\\",\\"([^"\\]+)\\",\\"title\\",\\"([^"\\]+)\\"/g;
  let match;

  while ((match = rewardPattern.exec(content)) !== null) {
    const header = match[1];   // "4X" or "6%"
    const subHeader = match[2]; // "POINTS", "MILES", "CASH BACK"
    const title = match[3];    // "On Groceries", "On Flights"

    // Parse multiplier
    const multiplierMatch = header.match(/(\d+(?:\.\d+)?)/);
    if (!multiplierMatch) continue;

    const multiplier = parseFloat(multiplierMatch[1]);
    const isPercentage = header.includes('%') || subHeader.toLowerCase().includes('cash');

    // Skip base rewards (1X, 1%)
    if (multiplier <= 1) continue;

    // Map title to category
    const category = mapTitleToCategory(title);
    if (!category) continue;

    // Avoid duplicates
    if (!rewards.find(r => r.category === category)) {
      rewards.push({
        category: category,
        multiplier: multiplier,
        isPercentage: isPercentage,
        cap: parseCap(title),
        capPeriod: null
      });
    }
  }

  return rewards;
}

/**
 * Parse spending cap from title text
 */
function parseCap(title) {
  const capMatch = title.match(/up to \$?([\d,]+)/i);
  if (capMatch) {
    return parseInt(capMatch[1].replace(/,/g, ''), 10);
  }
  return null;
}

/**
 * Map reward title to standard category
 */
function mapTitleToCategory(title) {
  const text = title.toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&#\d+;/g, '')
    .trim();

  // Skip generic/base rewards
  if (text.includes('other purchase') || text.includes('other eligible') ||
      text.includes('for each dollar') || text.includes('per dollar')) {
    return null;
  }

  // Airlines / Flights
  if (text.includes('flight') || text.includes('airline') || text.includes('delta')) {
    return 'airlines';
  }

  // Hotels
  if (text.includes('hotel') || text.includes('resort') || text.includes('hilton') || text.includes('marriott')) {
    return 'hotels';
  }

  // Dining
  if (text.includes('restaurant') || text.includes('dining')) {
    return 'dining';
  }

  // Grocery
  if (text.includes('groceries') || text.includes('grocery') || text.includes('supermarket')) {
    return 'grocery';
  }

  // Gas
  if (text.includes('gas')) {
    return 'gas';
  }

  // Streaming
  if (text.includes('streaming')) {
    return 'streaming';
  }

  // Transit
  if (text.includes('transit')) {
    return 'transit';
  }

  // Online Shopping
  if (text.includes('online') && (text.includes('retail') || text.includes('shopping'))) {
    return 'onlineShopping';
  }

  // Travel (including AmexTravel)
  if (text.includes('travel') || text.includes('prepaid hotel')) {
    return 'travel';
  }

  return null;
}

/**
 * Fallback: extract from HTML patterns (if JSON extraction fails)
 */
function extractFromHtmlPatterns(html) {
  const cardDataMap = {};

  // Try to find reward patterns in HTML
  const patterns = [
    { regex: /(\d+)[xX]\s*(?:Membership\s*Rewards\s*)?points?\s*(?:at|on)\s+([^<,.\n]{3,40})/gi, isPercentage: false },
    { regex: /(\d+)%\s*(?:cash\s*back\s*)?(?:at|on)\s+([^<,.\n]{3,40})/gi, isPercentage: true }
  ];

  // This would require knowing which card page we're on
  return cardDataMap;
}

/**
 * Main scrape function
 */
async function scrapeAmex() {
  console.log('🏦 American Express: Scraping credit cards...');

  try {
    // Fetch any Amex card page to get the embedded data
    console.log('  📥 Fetching Amex website for embedded data...');
    const html = await fetchPage('https://www.americanexpress.com/us/credit-cards/card/platinum/');

    // Extract card data from embedded JSON
    const cardDataMap = extractCardData(html);
    console.log(`  📊 Found reward data for ${Object.keys(cardDataMap).length} cards`);

    // Build card objects
    const cards = [];

    for (const cardInfo of AMEX_CARDS) {
      const rewards = cardDataMap[cardInfo.slug] || [];

      // Map rewards to iOS format
      const categoryRewards = rewards
        .map(r => {
          const mappedCategory = mapCategory(r.category);
          if (!mappedCategory) return null;
          return {
            category: mappedCategory,
            multiplier: r.multiplier,
            isPercentage: r.isPercentage,
            cap: r.cap,
            capPeriod: r.capPeriod
          };
        })
        .filter(Boolean);

      const baseReward = getBaseReward(cardInfo.rewardType, cardInfo.name);

      const card = {
        id: generateCardId('American Express', cardInfo.name),
        name: cardInfo.name,
        issuer: 'American Express',
        network: 'amex',
        annualFee: cardInfo.annualFee,
        rewardType: cardInfo.rewardType === 'cashback' ? 'cashback' :
                    cardInfo.rewardType === 'miles' ? 'miles' : 'points',
        baseReward: baseReward,
        baseIsPercentage: cardInfo.rewardType === 'cashback',
        categoryRewards: categoryRewards,
        rotatingCategories: null,
        selectableConfig: null,
        signUpBonus: null,
        imageColor: '#006FCF',
        imageURL: AMEX_IMAGES[cardInfo.slug] || null
      };

      cards.push(card);

      if (categoryRewards.length > 0) {
        console.log(`  ✅ ${cardInfo.name} - $${cardInfo.annualFee} fee, ${categoryRewards.length} categories`);
      } else {
        console.log(`  ⚠️ ${cardInfo.name} - No category rewards found (base rate only)`);
      }
    }

    console.log(`  📊 Total: ${cards.length} Amex cards`);
    return cards;

  } catch (error) {
    console.log(`  ❌ Error fetching Amex data: ${error.message}`);
    console.log('  ⚠️ Using fallback data');
    return getFallbackCards();
  }
}

/**
 * Get base reward rate
 */
function getBaseReward(rewardType, cardName) {
  const name = cardName.toLowerCase();

  if (name.includes('cash magnet')) return 1.5;
  if (name.includes('blue cash everyday')) return 1;
  if (name.includes('blue cash preferred')) return 1;
  if (rewardType === 'cashback') return 1;

  return 1; // Default for points/miles
}

/**
 * Fallback card data when scraping fails
 */
function getFallbackCards() {
  const fallbackData = [
    {
      name: 'American Express Platinum Card',
      annualFee: 695,
      rewardType: 'points',
      baseReward: 1,
      categories: [
        { category: 'airlines', multiplier: 5 },
        { category: 'travel', multiplier: 5 }
      ],
      imageURL: AMEX_IMAGES['platinum']
    },
    {
      name: 'American Express Gold Card',
      annualFee: 250,
      rewardType: 'points',
      baseReward: 1,
      categories: [
        { category: 'dining', multiplier: 4 },
        { category: 'grocery', multiplier: 4 },
        { category: 'airlines', multiplier: 3 }
      ],
      imageURL: AMEX_IMAGES['gold-card']
    },
    {
      name: 'American Express Green Card',
      annualFee: 150,
      rewardType: 'points',
      baseReward: 1,
      categories: [
        { category: 'travel', multiplier: 3 },
        { category: 'transit', multiplier: 3 },
        { category: 'dining', multiplier: 3 }
      ],
      imageURL: AMEX_IMAGES['green']
    },
    {
      name: 'Blue Cash Preferred Card',
      annualFee: 95,
      rewardType: 'cashback',
      baseReward: 1,
      categories: [
        { category: 'grocery', multiplier: 6, cap: 6000, capPeriod: 'yearly' },
        { category: 'streaming', multiplier: 6 },
        { category: 'gas', multiplier: 3 },
        { category: 'transit', multiplier: 3 }
      ],
      imageURL: AMEX_IMAGES['blue-cash-preferred']
    },
    {
      name: 'Blue Cash Everyday Card',
      annualFee: 0,
      rewardType: 'cashback',
      baseReward: 1,
      categories: [
        { category: 'grocery', multiplier: 3, cap: 6000, capPeriod: 'yearly' },
        { category: 'onlineShopping', multiplier: 3, cap: 6000, capPeriod: 'yearly' },
        { category: 'gas', multiplier: 3, cap: 6000, capPeriod: 'yearly' }
      ],
      imageURL: AMEX_IMAGES['blue-cash-everyday']
    },
    {
      name: 'Cash Magnet Card',
      annualFee: 0,
      rewardType: 'cashback',
      baseReward: 1.5,
      categories: [],
      imageURL: AMEX_IMAGES['cash-magnet']
    },
    {
      name: 'Amex EveryDay Card',
      annualFee: 0,
      rewardType: 'points',
      baseReward: 1,
      categories: [
        { category: 'grocery', multiplier: 2, cap: 6000, capPeriod: 'yearly' }
      ],
      imageURL: AMEX_IMAGES['amex-everyday']
    },
    {
      name: 'Amex EveryDay Preferred Card',
      annualFee: 95,
      rewardType: 'points',
      baseReward: 1,
      categories: [
        { category: 'grocery', multiplier: 3, cap: 6000, capPeriod: 'yearly' },
        { category: 'gas', multiplier: 2 }
      ],
      imageURL: AMEX_IMAGES['amex-everyday-preferred']
    },
    {
      name: 'Hilton Honors American Express Card',
      annualFee: 0,
      rewardType: 'points',
      baseReward: 3,
      categories: [
        { category: 'hotels', multiplier: 7 },
        { category: 'dining', multiplier: 5 },
        { category: 'grocery', multiplier: 5 },
        { category: 'gas', multiplier: 5 }
      ],
      imageURL: AMEX_IMAGES['hilton-honors']
    },
    {
      name: 'Hilton Honors American Express Surpass Card',
      annualFee: 150,
      rewardType: 'points',
      baseReward: 3,
      categories: [
        { category: 'hotels', multiplier: 12 },
        { category: 'dining', multiplier: 6 },
        { category: 'grocery', multiplier: 6 },
        { category: 'gas', multiplier: 6 },
        { category: 'onlineShopping', multiplier: 4 }
      ],
      imageURL: AMEX_IMAGES['hilton-honors-surpass']
    },
    {
      name: 'Hilton Honors American Express Aspire Card',
      annualFee: 550,
      rewardType: 'points',
      baseReward: 3,
      categories: [
        { category: 'hotels', multiplier: 14 },
        { category: 'airlines', multiplier: 7 },
        { category: 'dining', multiplier: 7 }
      ],
      imageURL: AMEX_IMAGES['hilton-honors-aspire']
    },
    {
      name: 'Marriott Bonvoy American Express Card',
      annualFee: 95,
      rewardType: 'points',
      baseReward: 2,
      categories: [
        { category: 'hotels', multiplier: 6 }
      ],
      imageURL: AMEX_IMAGES['marriott-bonvoy']
    },
    {
      name: 'Marriott Bonvoy Bevy American Express Card',
      annualFee: 250,
      rewardType: 'points',
      baseReward: 2,
      categories: [
        { category: 'hotels', multiplier: 6 },
        { category: 'dining', multiplier: 4 },
        { category: 'grocery', multiplier: 4 }
      ],
      imageURL: AMEX_IMAGES['marriott-bonvoy-bevy']
    },
    {
      name: 'Marriott Bonvoy Brilliant American Express Card',
      annualFee: 650,
      rewardType: 'points',
      baseReward: 2,
      categories: [
        { category: 'hotels', multiplier: 6 },
        { category: 'dining', multiplier: 3 },
        { category: 'airlines', multiplier: 3 }
      ],
      imageURL: AMEX_IMAGES['marriott-bonvoy-brilliant']
    },
    {
      name: 'Delta SkyMiles Blue American Express Card',
      annualFee: 0,
      rewardType: 'miles',
      baseReward: 1,
      categories: [
        { category: 'dining', multiplier: 2 },
        { category: 'airlines', multiplier: 2 }
      ],
      imageURL: AMEX_IMAGES['delta-skymiles-blue-american-express-card']
    },
    {
      name: 'Delta SkyMiles Gold American Express Card',
      annualFee: 150,
      rewardType: 'miles',
      baseReward: 1,
      categories: [
        { category: 'dining', multiplier: 2 },
        { category: 'grocery', multiplier: 2 },
        { category: 'airlines', multiplier: 2 }
      ],
      imageURL: AMEX_IMAGES['delta-skymiles-gold-american-express-card']
    },
    {
      name: 'Delta SkyMiles Platinum American Express Card',
      annualFee: 350,
      rewardType: 'miles',
      baseReward: 1,
      categories: [
        { category: 'airlines', multiplier: 3 },
        { category: 'hotels', multiplier: 3 },
        { category: 'dining', multiplier: 2 },
        { category: 'grocery', multiplier: 2 }
      ],
      imageURL: AMEX_IMAGES['delta-skymiles-platinum-american-express-card']
    },
    {
      name: 'Delta SkyMiles Reserve American Express Card',
      annualFee: 650,
      rewardType: 'miles',
      baseReward: 1,
      categories: [
        { category: 'airlines', multiplier: 3 }
      ],
      imageURL: AMEX_IMAGES['delta-skymiles-reserve-american-express-card']
    }
  ];

  return fallbackData.map(card => {
    const categoryRewards = (card.categories || []).map(c => ({
      category: mapCategory(c.category),
      multiplier: c.multiplier,
      isPercentage: card.rewardType === 'cashback',
      cap: c.cap || null,
      capPeriod: c.capPeriod || null
    })).filter(c => c.category);

    return {
      id: generateCardId('American Express', card.name),
      name: card.name,
      issuer: 'American Express',
      network: 'amex',
      annualFee: card.annualFee,
      rewardType: card.rewardType,
      baseReward: card.baseReward,
      baseIsPercentage: card.rewardType === 'cashback',
      categoryRewards: categoryRewards,
      rotatingCategories: null,
      selectableConfig: null,
      signUpBonus: null,
      imageColor: '#006FCF',
      imageURL: card.imageURL
    };
  });
}

// Test standalone
if (require.main === module) {
  console.log('🧪 Testing Amex Scraper...\n');
  scrapeAmex()
    .then(cards => {
      console.log(`\n✅ Total: ${cards.length} cards`);
      cards.forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee}, ${card.categoryRewards.length} categories`);
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeAmex;
