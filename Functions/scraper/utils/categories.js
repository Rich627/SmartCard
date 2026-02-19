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
  disney: 'disney',
  hotels: 'hotels',
  airlines: 'airlines',
  other: 'other'
};

// Map various category names from different issuers to our standard categories
const CATEGORY_MAPPINGS = {
  // ========== DINING ==========
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
  'doordash': CATEGORIES.dining,
  'starbucks': CATEGORIES.dining,
  'delivery': CATEGORIES.dining,

  // ========== GROCERY ==========
  'grocery': CATEGORIES.grocery,
  'groceries': CATEGORIES.grocery,
  'grocery stores': CATEGORIES.grocery,
  'supermarkets': CATEGORIES.grocery,
  'u.s. supermarkets': CATEGORIES.grocery,
  'instacart': CATEGORIES.grocery,

  // ========== GAS ==========
  'gas': CATEGORIES.gas,
  'gas stations': CATEGORIES.gas,
  'fuel': CATEGORIES.gas,
  'u.s. gas stations': CATEGORIES.gas,

  // ========== TRAVEL (includes airlines, hotels, travel portals) ==========
  'travel': CATEGORIES.travel,
  'flights': CATEGORIES.travel,
  'airfare': CATEGORIES.travel,
  'car rentals': CATEGORIES.travel,
  'carRental': CATEGORIES.travel,
  'travel purchases': CATEGORIES.travel,
  'travel booked through chase': CATEGORIES.travel,
  'travel purchased through amex': CATEGORIES.travel,
  'priceline': CATEGORIES.travel,

  // Travel portal variations
  'travelPortal': CATEGORIES.travel,
  'travelportal': CATEGORIES.travel,
  'travelPortalFlights': CATEGORIES.travel,
  'travelportalflights': CATEGORIES.travel,
  'chaseTravel': CATEGORIES.travel,
  'chasetravel': CATEGORIES.travel,

  // Airlines
  'airlines': CATEGORIES.airlines,
  'delta': CATEGORIES.airlines,
  'united': CATEGORIES.airlines,
  'southwest': CATEGORIES.airlines,
  'americanairlines': CATEGORIES.airlines,
  'jetblue': CATEGORIES.airlines,
  'frontier': CATEGORIES.airlines,
  'hawaiian': CATEGORIES.airlines,
  'alaska': CATEGORIES.airlines,
  'britishairways': CATEGORIES.airlines,
  'iberia': CATEGORIES.airlines,
  'aerlingus': CATEGORIES.airlines,
  'aircanada': CATEGORIES.airlines,
  'cathaypacific': CATEGORIES.airlines,
  'aeroplan': CATEGORIES.airlines,

  // Hotel Brands
  'hilton': CATEGORIES.hotels,
  'marriott': CATEGORIES.hotels,
  'hyatt': CATEGORIES.hotels,
  'ihg': CATEGORIES.hotels,
  'wyndham': CATEGORIES.hotels,
  'hotels': CATEGORIES.hotels,

  // ========== STREAMING ==========
  'streaming': CATEGORIES.streaming,
  'streaming services': CATEGORIES.streaming,
  'select streaming services': CATEGORIES.streaming,
  'u.s. streaming subscriptions': CATEGORIES.streaming,

  // ========== DRUGSTORE ==========
  'drugstore': CATEGORIES.drugstore,
  'drugstores': CATEGORIES.drugstore,
  'pharmacy': CATEGORIES.drugstore,
  'pharmacies': CATEGORIES.drugstore,

  // ========== HOME IMPROVEMENT ==========
  'homeImprovement': CATEGORIES.homeImprovement,
  'homeimprovement': CATEGORIES.homeImprovement,
  'home improvement': CATEGORIES.homeImprovement,
  'home improvement stores': CATEGORIES.homeImprovement,

  // ========== ENTERTAINMENT ==========
  'entertainment': CATEGORIES.entertainment,
  'movies': CATEGORIES.entertainment,
  'concerts': CATEGORIES.entertainment,

  // ========== ONLINE SHOPPING ==========
  'onlineShopping': CATEGORIES.onlineShopping,
  'onlineshopping': CATEGORIES.onlineShopping,
  'online shopping': CATEGORIES.onlineShopping,
  'online retail': CATEGORIES.onlineShopping,
  'e-commerce': CATEGORIES.onlineShopping,

  // ========== TRANSIT ==========
  'transit': CATEGORIES.transit,
  'public transit': CATEGORIES.transit,
  'commuting': CATEGORIES.transit,
  'rideshare': CATEGORIES.transit,
  'lyft': CATEGORIES.transit,
  'uber': CATEGORIES.transit,

  // ========== WHOLESALE ==========
  'wholesale': CATEGORIES.wholesale,
  'wholesale clubs': CATEGORIES.wholesale,
  'warehouse stores': CATEGORIES.wholesale,
  'costco': CATEGORIES.wholesale,
  'sam\'s club': CATEGORIES.wholesale,

  // ========== SPECIFIC MERCHANTS ==========
  'amazon': CATEGORIES.amazon,
  'amazon.com': CATEGORIES.amazon,

  // Whole Foods (case variations)
  'wholeFoods': CATEGORIES.wholeFoods,
  'wholefoods': CATEGORIES.wholeFoods,
  'whole foods': CATEGORIES.wholeFoods,
  'whole foods market': CATEGORIES.wholeFoods,

  'target': CATEGORIES.target,

  // Walmart (including online)
  'walmart': CATEGORIES.walmart,
  'walmart.com': CATEGORIES.walmart,
  'walmartOnline': CATEGORIES.walmart,
  'walmartonline': CATEGORIES.walmart,

  'paypal': CATEGORIES.paypal,
  'apple': CATEGORIES.apple,
  'apple purchases': CATEGORIES.apple,
  'disney': CATEGORIES.disney,
  'disney purchases': CATEGORIES.disney,
  'disneyland': CATEGORIES.disney,
  'disney world': CATEGORIES.disney,

  // ========== UTILITIES ==========
  'utilities': CATEGORIES.utilities,
  'utility bills': CATEGORIES.utilities,

  // ========== PHONE/INTERNET ==========
  'phone': CATEGORIES.phone,
  'phone plans': CATEGORIES.phone,
  'wireless': CATEGORIES.phone,
  'cell phone': CATEGORIES.phone,
  'verizon': CATEGORIES.phone,
  'internet': CATEGORIES.internet,
  'cable': CATEGORIES.internet,

  // ========== EV CHARGING ==========
  'evCharging': CATEGORIES.evCharging,
  'evcharging': CATEGORIES.evCharging,
  'ev charging': CATEGORIES.evCharging,
  'electric vehicle charging': CATEGORIES.evCharging,

  // ========== FITNESS ==========
  'fitness': CATEGORIES.fitness,
  'gym': CATEGORIES.fitness,
  'gyms': CATEGORIES.fitness,
  'health clubs': CATEGORIES.fitness,
  'hairSalon': CATEGORIES.fitness,
  'hairsalon': CATEGORIES.fitness,

  // ========== OFFICE ==========
  'officeSupplies': CATEGORIES.officeSupplies,
  'officesupplies': CATEGORIES.officeSupplies,
  'office supplies': CATEGORIES.officeSupplies,
  'office supply stores': CATEGORIES.officeSupplies,

  // ========== ADVERTISING ==========
  'advertising': CATEGORIES.advertising,
  'online advertising': CATEGORIES.advertising,
  'social media advertising': CATEGORIES.advertising,

  // ========== SHIPPING ==========
  'shipping': CATEGORIES.shipping,

  // ========== OTHER (catch-all) ==========
  'other': CATEGORIES.other,
  'everything else': CATEGORIES.other,
  'all other purchases': CATEGORIES.other,
  'departmentStores': CATEGORIES.other,
  'departmentstores': CATEGORIES.other,
  'rent': CATEGORIES.other,
  'electronics': CATEGORIES.electronics
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
 * Generate a unique card ID
 */
function generateCardId(issuer, cardName) {
  return `${issuer.toLowerCase().replace(/\s+/g, '-')}-${cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

/**
 * Check if a category is valid (exists in iOS SpendingCategory enum)
 */
function isValidCategory(category) {
  return Object.values(CATEGORIES).includes(category);
}

/**
 * Get all valid iOS categories
 */
function getValidCategories() {
  return Object.values(CATEGORIES);
}

module.exports = {
  CATEGORIES,
  CATEGORY_MAPPINGS,
  mapCategory,
  generateCardId,
  isValidCategory,
  getValidCategories
};
