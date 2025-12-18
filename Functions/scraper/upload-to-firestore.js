/**
 * Upload scraped credit card data to Firestore
 *
 * Usage:
 * 1. Make sure you have service-account.json in the parent directory
 * 2. Run: npm run upload
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: service-account.json not found in Functions directory');
  console.error('Download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadCards() {
  const scrapedDataPath = path.join(__dirname, 'scraped-cards.json');

  if (!fs.existsSync(scrapedDataPath)) {
    console.error('Error: scraped-cards.json not found. Run npm run scrape first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));
  const cards = data.cards;

  console.log(`📤 Uploading ${cards.length} cards to Firestore...`);
  console.log(`   Scraped at: ${data.scrapedAt}`);

  // Use batched writes
  let batch = db.batch();
  let batchCount = 0;
  let totalCount = 0;

  for (const card of cards) {
    const docRef = db.collection('cards').doc(card.id);

    // Add metadata
    const cardWithMeta = {
      ...card,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      scrapedAt: data.scrapedAt
    };

    batch.set(docRef, cardWithMeta, { merge: true });
    batchCount++;
    totalCount++;

    // Firestore batch limit is 500
    if (batchCount >= 450) {
      await batch.commit();
      console.log(`   ✅ Committed batch of ${batchCount} cards`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
    console.log(`   ✅ Committed final batch of ${batchCount} cards`);
  }

  // Summary by issuer
  console.log('\n📊 Summary by issuer:');
  const issuers = {};
  cards.forEach(card => {
    issuers[card.issuer] = (issuers[card.issuer] || 0) + 1;
  });

  Object.entries(issuers)
    .sort((a, b) => b[1] - a[1])
    .forEach(([issuer, count]) => {
      console.log(`   ${issuer}: ${count}`);
    });

  // Check for cards with images
  const withImages = cards.filter(c => c.imageURL).length;
  console.log(`\n🖼️  Cards with images: ${withImages}/${cards.length} (${Math.round(withImages/cards.length*100)}%)`);

  console.log(`\n✨ Successfully uploaded ${totalCount} cards to Firestore!`);
}

uploadCards()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error uploading cards:', error);
    process.exit(1);
  });
