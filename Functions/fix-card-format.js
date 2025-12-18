/**
 * Fix card data format to match Swift Codable models
 */

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = require("./service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Mapping tables
const networkMap = {
  "visa": "Visa",
  "mastercard": "Mastercard",
  "amex": "Amex",
  "discover": "Discover"
};

const rewardTypeMap = {
  "cashback": "Cash Back",
  "points": "Points",
  "miles": "Miles"
};

const categoryMap = {
  "dining": "Dining",
  "grocery": "Grocery",
  "gas": "Gas",
  "travel": "Travel",
  "streaming": "Streaming",
  "drugstore": "Drugstore",
  "homeImprovement": "Home Improvement",
  "entertainment": "Entertainment",
  "onlineShopping": "Online Shopping",
  "transit": "Transit",
  "utilities": "Utilities",
  "wholesale": "Wholesale Clubs",
  "paypal": "PayPal",
  "amazon": "Amazon",
  "fitness": "Fitness",
  "phone": "Phone/Internet",
  "internet": "Internet/Cable",
  "shipping": "Shipping",
  "advertising": "Advertising",
  "officeSupplies": "Office Supplies",
  "evCharging": "EV Charging",
  "apple": "Apple",
  "wholeFoods": "Whole Foods",
  "target": "Target",
  "walmart": "Walmart",
  "macys": "Macys",
  "kohls": "Kohls",
  "gap": "Gap",
  "nordstrom": "Nordstrom",
  "electronics": "Electronics",
  "other": "Other"
};

const capPeriodMap = {
  "monthly": "Monthly",
  "quarterly": "Quarterly",
  "yearly": "Yearly"
};

function fixCategoryReward(reward) {
  if (!reward) return reward;
  return {
    ...reward,
    category: categoryMap[reward.category] || reward.category,
    capPeriod: reward.capPeriod ? (capPeriodMap[reward.capPeriod] || reward.capPeriod) : null
  };
}

function fixRotatingCategory(rotating) {
  if (!rotating) return rotating;
  return {
    ...rotating,
    categories: rotating.categories.map(c => categoryMap[c] || c),
  };
}

function fixSelectableConfig(config) {
  if (!config) return config;
  return {
    ...config,
    availableCategories: config.availableCategories.map(c => categoryMap[c] || c),
    capPeriod: config.capPeriod ? (capPeriodMap[config.capPeriod] || config.capPeriod) : null
  };
}

function fixSignUpBonus(bonus) {
  if (!bonus) return bonus;
  return {
    ...bonus,
    bonusType: rewardTypeMap[bonus.bonusType] || bonus.bonusType
  };
}

function fixCard(card) {
  return {
    ...card,
    network: networkMap[card.network] || card.network,
    rewardType: rewardTypeMap[card.rewardType] || card.rewardType,
    categoryRewards: card.categoryRewards ? card.categoryRewards.map(fixCategoryReward) : [],
    rotatingCategories: card.rotatingCategories ? card.rotatingCategories.map(fixRotatingCategory) : null,
    selectableConfig: fixSelectableConfig(card.selectableConfig),
    signUpBonus: fixSignUpBonus(card.signUpBonus),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  };
}

async function fixAllCards() {
  console.log("Fetching all cards from Firestore...");
  const snapshot = await db.collection("cards").get();
  console.log(`Found ${snapshot.size} cards to fix`);

  let fixedCount = 0;
  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    const card = doc.data();
    const fixedCard = fixCard(card);
    batch.set(doc.ref, fixedCard);
    fixedCount++;
  });

  console.log("Committing fixes...");
  await batch.commit();
  console.log(`Successfully fixed ${fixedCount} cards!`);

  // Verify one card
  const testDoc = await db.collection("cards").doc("chase-sapphire-preferred").get();
  if (testDoc.exists) {
    const data = testDoc.data();
    console.log("\nVerification (Chase Sapphire Preferred):");
    console.log(`  network: ${data.network}`);
    console.log(`  rewardType: ${data.rewardType}`);
    if (data.categoryRewards && data.categoryRewards.length > 0) {
      console.log(`  first category: ${data.categoryRewards[0].category}`);
    }
  }
}

fixAllCards()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error fixing cards:", error);
    process.exit(1);
  });
