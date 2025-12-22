/**
 * Fix remaining broken image URLs
 * Set broken URLs to null so iOS app uses imageColor as fallback
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'scraped-cards.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Cards with broken image URLs - set to null to use imageColor fallback
const BROKEN_CARDS = [
  // 403 - Credit unions block direct access
  'Navy Federal cashRewards',
  'Navy Federal Flagship Rewards',
  'Navy Federal Go Rewards',
  'PenFed Platinum Rewards',
  'PenFed Power Cash Rewards',
  'PenFed Pathfinder Rewards',
  'Alliant Cashback Visa',

  // 404 - No public image URLs available
  'Delta SkyMiles Gold Business',
  'Delta SkyMiles Platinum Business',
  'Amazon Business Prime',
  'Plum Card',
  'Citi Diamond Preferred',
  'Citi AAdvantage Platinum Select',
  'Walmart Rewards Card',
  'Costco Anywhere Visa by Citi',
  'Cathay Pacific Credit Card',
  'Verizon Visa Card',
];

console.log('Fixing broken image URLs...\n');

let fixed = 0;
data.cards.forEach(card => {
  if (BROKEN_CARDS.includes(card.name)) {
    console.log(`🔧 ${card.name}`);
    console.log(`   imageColor: ${card.imageColor} (will be used as fallback)`);
    card.imageURL = null;
    fixed++;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log(`\n✅ Fixed ${fixed} cards`);
console.log('These cards will now use imageColor as fallback in the iOS app');
