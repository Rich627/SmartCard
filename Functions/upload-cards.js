/**
 * Upload cards to Firestore
 *
 * Usage:
 * 1. Download service account key from Firebase Console
 *    (Project Settings → Service Accounts → Generate New Private Key)
 * 2. Save as 'service-account.json' in this folder
 * 3. Run: node upload-cards.js
 */

const admin = require("firebase-admin");
const cardsData = require("./cards-data.json");

// Initialize Firebase Admin with service account
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadCards() {
  const cards = cardsData.cards;
  console.log(`Uploading ${cards.length} cards to Firestore...`);

  const batch = db.batch();
  let count = 0;

  for (const card of cards) {
    const docRef = db.collection("cards").doc(card.id);

    // Add lastUpdated timestamp
    const cardWithTimestamp = {
      ...card,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, cardWithTimestamp);
    count++;

    // Firestore batch limit is 500
    if (count === 500) {
      await batch.commit();
      console.log(`Committed batch of ${count} cards`);
      count = 0;
    }
  }

  // Commit remaining
  if (count > 0) {
    await batch.commit();
    console.log(`Committed final batch of ${count} cards`);
  }

  console.log(`Successfully uploaded ${cards.length} cards to Firestore!`);
  console.log("\nCards by issuer:");

  // Summary
  const issuers = {};
  cards.forEach(card => {
    issuers[card.issuer] = (issuers[card.issuer] || 0) + 1;
  });
  Object.entries(issuers).sort((a, b) => b[1] - a[1]).forEach(([issuer, count]) => {
    console.log(`  ${issuer}: ${count}`);
  });
}

uploadCards()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error uploading cards:", error);
    process.exit(1);
  });
