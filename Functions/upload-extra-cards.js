/**
 * Upload additional cards to Firestore
 */

const admin = require("firebase-admin");
const cardsData = require("./cards-data-extra.json");

// Check if already initialized
if (!admin.apps.length) {
  const serviceAccount = require("./service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function uploadCards() {
  const cards = cardsData.cards;
  console.log(`Uploading ${cards.length} additional cards to Firestore...`);

  const batch = db.batch();
  let count = 0;

  for (const card of cards) {
    const docRef = db.collection("cards").doc(card.id);

    const cardWithTimestamp = {
      ...card,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, cardWithTimestamp);
    count++;

    if (count === 500) {
      await batch.commit();
      console.log(`Committed batch of ${count} cards`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Committed final batch of ${count} cards`);
  }

  console.log(`\nSuccessfully uploaded ${cards.length} additional cards!`);

  // Get total count
  const snapshot = await db.collection("cards").get();
  console.log(`Total cards in Firestore: ${snapshot.size}`);

  // Summary by issuer
  console.log("\nNew cards by issuer:");
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
