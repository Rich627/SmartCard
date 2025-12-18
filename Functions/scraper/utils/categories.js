/**
 * Category mapping utilities
 *
 * Maps various reward category names to our standardized SpendingCategory enum
 */

// Our standardized categories (must match SpendingCategory.swift)
const CATEGORIES = {
  dining: 'dining',
  grocery: 'grocery',
  gas: 'gas',
  travel: 'travel',
  streaming: 'streaming',
  drugstore: 'drugstore',
  homeImprovement: 'homeImprovement',
  entertainment: 'entertainment',
  onlineShopping: 'onlineShopping',
  transit: 'transit',
  utilities: 'utilities',
  wholesale: 'wholesale',
  paypal: 'paypal',
  amazon: 'amazon',
  fitness: 'fitness',
  phone: 'phone',
  internet: 'internet',
  shipping: 'shipping',
  advertising: 'advertising',
  officeSupplies: 'officeSupplies',
  evCharging: 'evCharging',
  apple: 'apple',
  wholeFoods: 'wholeFoods',
  target: 'target',
  walmart: 'walmart',
  macys: 'macys',
  kohls: 'kohls',
  gap: 'gap',
  nordstrom: 'nordstrom',
  electronics: 'electronics',
  other: 'other'
};

// Map various category names from different issuers to our standard categories
const CATEGORY_MAPPINGS = {
  // Dining variations
  'dining': CATEGORIES.dining,
  'restaurants': CATEGORIES.dining,
  'restaurant': CATEGORIES.dining,
  'food': CATEGORIES.dining,
  'food & dining': CATEGORIES.dining,
  'dining at restaurants': CATEGORIES.dining,
  'u.s. restaurants': CATEGORIES.dining,
  'worldwide dining': CATEGORIES.dining,
  'takeout': CATEGORIES.dining,
  'food delivery': CATEGORIES.dining,

  // Grocery variations
  'grocery': CATEGORIES.grocery,
  'groceries': CATEGORIES.grocery,
  'grocery stores': CATEGORIES.grocery,
  'supermarkets': CATEGORIES.grocery,
  'u.s. supermarkets': CATEGORIES.grocery,

  // Gas variations
  'gas': CATEGORIES.gas,
  'gas stations': CATEGORIES.gas,
  'fuel': CATEGORIES.gas,
  'u.s. gas stations': CATEGORIES.gas,

  // Travel variations
  'travel': CATEGORIES.travel,
  'hotels': CATEGORIES.travel,
  'flights': CATEGORIES.travel,
  'airfare': CATEGORIES.travel,
  'car rentals': CATEGORIES.travel,
  'airlines': CATEGORIES.travel,
  'travel purchases': CATEGORIES.travel,
  'travel booked through chase': CATEGORIES.travel,
  'travel purchased through amex': CATEGORIES.travel,

  // Streaming variations
  'streaming': CATEGORIES.streaming,
  'streaming services': CATEGORIES.streaming,
  'select streaming services': CATEGORIES.streaming,
  'u.s. streaming subscriptions': CATEGORIES.streaming,

  // Drugstore variations
  'drugstore': CATEGORIES.drugstore,
  'drugstores': CATEGORIES.drugstore,
  'pharmacy': CATEGORIES.drugstore,
  'pharmacies': CATEGORIES.drugstore,

  // Home improvement variations
  'home improvement': CATEGORIES.homeImprovement,
  'home improvement stores': CATEGORIES.homeImprovement,

  // Entertainment variations
  'entertainment': CATEGORIES.entertainment,
  'movies': CATEGORIES.entertainment,
  'concerts': CATEGORIES.entertainment,

  // Online shopping variations
  'online shopping': CATEGORIES.onlineShopping,
  'online retail': CATEGORIES.onlineShopping,
  'e-commerce': CATEGORIES.onlineShopping,

  // Transit variations
  'transit': CATEGORIES.transit,
  'public transit': CATEGORIES.transit,
  'commuting': CATEGORIES.transit,
  'rideshare': CATEGORIES.transit,
  'lyft': CATEGORIES.transit,
  'uber': CATEGORIES.transit,

  // Wholesale variations
  'wholesale': CATEGORIES.wholesale,
  'wholesale clubs': CATEGORIES.wholesale,
  'warehouse stores': CATEGORIES.wholesale,
  'costco': CATEGORIES.wholesale,
  'sam\'s club': CATEGORIES.wholesale,

  // Specific merchants
  'amazon': CATEGORIES.amazon,
  'amazon.com': CATEGORIES.amazon,
  'whole foods': CATEGORIES.wholeFoods,
  'whole foods market': CATEGORIES.wholeFoods,
  'target': CATEGORIES.target,
  'walmart': CATEGORIES.walmart,
  'walmart.com': CATEGORIES.walmart,
  'paypal': CATEGORIES.paypal,

  // Utilities
  'utilities': CATEGORIES.utilities,
  'utility bills': CATEGORIES.utilities,

  // Phone/Internet
  'phone': CATEGORIES.phone,
  'phone plans': CATEGORIES.phone,
  'wireless': CATEGORIES.phone,
  'cell phone': CATEGORIES.phone,
  'internet': CATEGORIES.internet,
  'cable': CATEGORIES.internet,

  // EV Charging
  'ev charging': CATEGORIES.evCharging,
  'electric vehicle charging': CATEGORIES.evCharging,

  // Fitness
  'fitness': CATEGORIES.fitness,
  'gym': CATEGORIES.fitness,
  'gyms': CATEGORIES.fitness,
  'health clubs': CATEGORIES.fitness,

  // Office
  'office supplies': CATEGORIES.officeSupplies,
  'office supply stores': CATEGORIES.officeSupplies,

  // Advertising
  'advertising': CATEGORIES.advertising,
  'online advertising': CATEGORIES.advertising,
  'social media advertising': CATEGORIES.advertising,

  // Shipping
  'shipping': CATEGORIES.shipping,

  // Apple
  'apple': CATEGORIES.apple,
  'apple purchases': CATEGORIES.apple,

  // Default
  'everything else': CATEGORIES.other,
  'all other purchases': CATEGORIES.other,
  'other': CATEGORIES.other
};

/**
 * Map a category string to our standardized category
 */
function mapCategory(rawCategory) {
  if (!rawCategory) return null;

  const normalized = rawCategory.toLowerCase().trim();

  // Direct match
  if (CATEGORY_MAPPINGS[normalized]) {
    return CATEGORY_MAPPINGS[normalized];
  }

  // Partial match
  for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  console.warn(`Unknown category: "${rawCategory}"`);
  return null;
}

/**
 * Parse a multiplier string like "3x" or "3%" into number and type
 */
function parseMultiplier(str) {
  if (!str) return null;

  const cleaned = str.toLowerCase().replace(/[^0-9.x%]/g, '');

  if (cleaned.includes('%')) {
    const num = parseFloat(cleaned.replace('%', ''));
    return { multiplier: num, isPercentage: true };
  }

  if (cleaned.includes('x')) {
    const num = parseFloat(cleaned.replace('x', ''));
    return { multiplier: num, isPercentage: false };
  }

  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    // Assume percentage for cashback cards, points for others
    return { multiplier: num, isPercentage: true };
  }

  return null;
}

/**
 * Parse a spending cap string like "$1,500" or "$6,000/quarter"
 */
function parseCap(str) {
  if (!str) return null;

  const cleaned = str.toLowerCase();

  // Extract amount
  const amountMatch = cleaned.match(/\$?([\d,]+)/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

  // Determine period
  let period = 'quarterly'; // default
  if (cleaned.includes('month')) {
    period = 'monthly';
  } else if (cleaned.includes('year') || cleaned.includes('annual')) {
    period = 'yearly';
  }

  return { cap: amount, capPeriod: period };
}

/**
 * Generate a unique card ID
 */
function generateCardId(issuer, cardName) {
  return `${issuer.toLowerCase().replace(/\s+/g, '-')}-${cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

module.exports = {
  CATEGORIES,
  mapCategory,
  parseMultiplier,
  parseCap,
  generateCardId
};
