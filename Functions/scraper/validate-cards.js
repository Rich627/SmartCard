/**
 * Credit Card Data Validation Script
 * Validates all card data for quality and consistency
 */

const scrapeChase = require('./scrapers/chase');
const scrapeAmex = require('./scrapers/amex');
const scrapeCiti = require('./scrapers/citi');
const scrapeCapitalOne = require('./scrapers/capitalone');
const scrapeDiscover = require('./scrapers/discover');
const scrapeWellsFargo = require('./scrapers/wellsfargo');
const scrapeBofa = require('./scrapers/bofa');
const scrapeUsBank = require('./scrapers/usbank');
const scrapeOthers = require('./scrapers/others');

// Standard categories that the app recognizes
const STANDARD_CATEGORIES = [
  // General spending
  'dining', 'grocery', 'gas', 'travel', 'transit', 'streaming',
  'drugstore', 'utilities', 'phone', 'internet', 'fitness',
  // Shopping
  'onlineShopping', 'departmentStores', 'wholesale', 'homeImprovement',
  // Travel specifics
  'hotels', 'airlines', 'carRental', 'entertainment', 'travelPortal', 'travelPortalFlights',
  // Business
  'officeSupplies', 'shipping', 'advertising', 'evCharging',
  // Retailers
  'amazon', 'wholefoods', 'walmart', 'walmartOnline', 'target', 'costco', 'apple',
  // Airlines
  'united', 'southwest', 'delta', 'americanairlines', 'jetblue', 'frontier',
  'hawaiian', 'alaska', 'britishairways', 'iberia', 'aerlingus', 'aircanada', 'cathaypacific',
  // Hotels
  'marriott', 'hilton', 'hyatt', 'ihg', 'wyndham',
  // Services
  'doordash', 'instacart', 'starbucks', 'priceline', 'paypal', 'verizon',
  // Special
  'rent', 'delivery', 'other'
];

async function validateCards() {
  console.log('🔍 Starting card data validation...\n');

  const allCards = await getAllCards();
  console.log(`📊 Total cards: ${allCards.length}\n`);

  const issues = {
    missingRewards: [],
    duplicateCategories: [],
    unknownCategories: [],
    missingImages: [],
    invalidData: []
  };

  for (const card of allCards) {
    // Check for missing rewards
    if (card.categoryRewards.length === 0 && card.baseReward <= 1 && !card.rotatingCategories && !card.selectableConfig) {
      // Skip cards that are explicitly no-rewards or basic 1% cards
      const noRewardsCards = [
        'Citi Diamond Preferred',
        'Capital One Platinum',
        'Wells Fargo Reflect',
        'Target RedCard Credit',
        'Chase Freedom Student'  // Basic 1% student card
      ];
      if (!noRewardsCards.includes(card.name)) {
        issues.missingRewards.push({
          name: card.name,
          issuer: card.issuer,
          baseReward: card.baseReward
        });
      }
    }

    // Check for duplicate categories
    const categories = card.categoryRewards.map(r => r.category);
    const duplicates = categories.filter((c, i) => categories.indexOf(c) !== i);
    if (duplicates.length > 0) {
      issues.duplicateCategories.push({
        name: card.name,
        issuer: card.issuer,
        duplicates: [...new Set(duplicates)]
      });
    }

    // Check for unknown categories
    const unknownCats = categories.filter(c => !STANDARD_CATEGORIES.includes(c));
    if (unknownCats.length > 0) {
      issues.unknownCategories.push({
        name: card.name,
        issuer: card.issuer,
        categories: unknownCats
      });
    }

    // Check for missing images
    if (!card.imageURL) {
      issues.missingImages.push({
        name: card.name,
        issuer: card.issuer
      });
    }

    // Check for invalid data
    if (!card.name || !card.issuer || card.annualFee === undefined) {
      issues.invalidData.push({
        name: card.name || 'UNKNOWN',
        issuer: card.issuer || 'UNKNOWN',
        issue: 'Missing required fields'
      });
    }
  }

  // Print results
  console.log('=' .repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('=' .repeat(60));

  if (issues.missingRewards.length > 0) {
    console.log(`\n❌ Cards with missing rewards (${issues.missingRewards.length}):`);
    issues.missingRewards.forEach(card => {
      console.log(`   - ${card.issuer}: ${card.name} (base: ${card.baseReward})`);
    });
  } else {
    console.log('\n✅ All cards have rewards defined');
  }

  if (issues.duplicateCategories.length > 0) {
    console.log(`\n❌ Cards with duplicate categories (${issues.duplicateCategories.length}):`);
    issues.duplicateCategories.forEach(card => {
      console.log(`   - ${card.issuer}: ${card.name} (${card.duplicates.join(', ')})`);
    });
  } else {
    console.log('\n✅ No duplicate categories found');
  }

  if (issues.unknownCategories.length > 0) {
    console.log(`\n⚠️  Cards with unknown categories (${issues.unknownCategories.length}):`);
    issues.unknownCategories.forEach(card => {
      console.log(`   - ${card.issuer}: ${card.name} (${card.categories.join(', ')})`);
    });
  } else {
    console.log('\n✅ All categories are recognized');
  }

  if (issues.missingImages.length > 0) {
    console.log(`\n❌ Cards with missing images (${issues.missingImages.length}):`);
    issues.missingImages.forEach(card => {
      console.log(`   - ${card.issuer}: ${card.name}`);
    });
  } else {
    console.log('\n✅ All cards have images');
  }

  if (issues.invalidData.length > 0) {
    console.log(`\n❌ Cards with invalid data (${issues.invalidData.length}):`);
    issues.invalidData.forEach(card => {
      console.log(`   - ${card.issuer}: ${card.name} - ${card.issue}`);
    });
  } else {
    console.log('\n✅ All cards have valid data');
  }

  // Summary
  const totalIssues =
    issues.missingRewards.length +
    issues.duplicateCategories.length +
    issues.missingImages.length +
    issues.invalidData.length;

  console.log('\n' + '=' .repeat(60));
  if (totalIssues === 0) {
    console.log('🎉 VALIDATION PASSED - All cards are valid!');
  } else {
    console.log(`⚠️  VALIDATION FOUND ${totalIssues} ISSUE(S)`);
  }
  console.log('=' .repeat(60));

  // Print category statistics
  console.log('\n📈 Category Statistics:');
  const categoryCount = {};
  allCards.forEach(card => {
    card.categoryRewards.forEach(r => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });
  });
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  sortedCategories.forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} cards`);
  });

  return {
    totalCards: allCards.length,
    issues,
    valid: totalIssues === 0
  };
}

async function getAllCards() {
  const results = await Promise.all([
    scrapeChase(),
    scrapeAmex(),
    scrapeCiti(),
    scrapeCapitalOne(),
    scrapeDiscover(),
    scrapeWellsFargo(),
    scrapeBofa(),
    scrapeUsBank(),
    scrapeOthers()
  ]);

  return results.flat();
}

// Run validation
validateCards().catch(console.error);
