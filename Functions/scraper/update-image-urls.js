/**
 * Update image URLs in scraped-cards.json
 * Run this after updating the image URLs in scrapers
 */

const fs = require('fs');
const path = require('path');

// Correct image URLs (verified working as of Dec 2024)
const IMAGE_URL_UPDATES = {
  // Navy Federal - SVG works
  'Navy Federal More Rewards': 'https://www.navyfederal.org/content/dam/card-art/amex/amex-no-name.svg',
  // Navy Federal PNG requires auth - will use imageColor as fallback

  // Bilt - Working from Credit Karma CDN
  'Bilt Mastercard': 'https://creditkarma-cms.imgix.net/wp-content/uploads/2024/08/Bilt-Rewards-Card.png',

  // PayPal - Working
  'PayPal Cashback Mastercard': 'https://www.paypalobjects.com/marketing/web23/us/en/ppe/cbmc/hero_size-tablet-up_v1.jpg',
  'PayPal Extras Mastercard': 'https://www.paypalobjects.com/marketing/web23/us/en/ppe/cbmc/hero_size-tablet-up_v1.jpg',

  // SoFi - Working
  'SoFi Credit Card': 'https://d32ijn7u0aqfv4.cloudfront.net/wp/wp-content/uploads/raw/CC24-2177731-AB_CC-LP-Redesign-for-PQ-Flow_Unlimited-CC_Desktop%402x.png',

  // Target - Working
  'Target RedCard Credit': 'https://assets.targetimg1.com/webui/redcard/circle_card.svg',

  // Amazon Store Card - Working from Credit Karma CDN
  'Amazon Store Card': 'https://creditkarma-cms.imgix.net/wp-content/uploads/2024/08/Amazon-Store-Card.png',

  // American Express - Working from icm.aexp-static.com
  'Delta SkyMiles Reserve Business': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-reserve.png',
  'Marriott Bonvoy Business': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/marriott-bonvoy-brilliant.png',
  'Business Platinum Card': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-card.png',

  // Use consumer card images as fallback for business variants
  'Delta SkyMiles Gold Business': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-gold.png',
  'Delta SkyMiles Platinum Business': 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-skymiles-platinum.png',

  // Synchrony - Working
  'Verizon Visa Card': 'https://www.synchrony.com/card-images/verizon-visa.png',
  'Cathay Pacific Credit Card': 'https://www.synchrony.com/card-images/cathay-pacific.png',
};

// Read JSON file
const jsonPath = path.join(__dirname, 'scraped-cards.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log('Updating image URLs...\n');

let updated = 0;
data.cards.forEach(card => {
  if (IMAGE_URL_UPDATES[card.name]) {
    const oldUrl = card.imageURL;
    card.imageURL = IMAGE_URL_UPDATES[card.name];
    console.log(`✅ ${card.name}`);
    console.log(`   Old: ${oldUrl}`);
    console.log(`   New: ${card.imageURL}\n`);
    updated++;
  }
});

// Write updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n=== Done ===`);
console.log(`Updated ${updated} card image URLs`);
console.log(`Saved to: ${jsonPath}`);
