/**
 * Firebase Cloud Function for scheduled credit card data scraping
 *
 * Deploys as a scheduled function that runs daily to update card data
 *
 * Deploy with:
 * firebase deploy --only functions:scheduledCardScraper
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Import scraper logic (embedded to avoid complex dependencies in Cloud Functions)
const CARD_DATA = require('./card-data');

/**
 * Scheduled function - runs daily at 6 AM UTC
 */
exports.scheduledCardScraper = functions.pubsub
  .schedule('0 6 * * *')
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('Starting scheduled card data update...');

    try {
      const cards = CARD_DATA.getAllCards();
      console.log(`Processing ${cards.length} cards...`);

      // Batch write to Firestore
      let batch = db.batch();
      let batchCount = 0;

      for (const card of cards) {
        const docRef = db.collection('cards').doc(card.id);
        const cardWithMeta = {
          ...card,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        batch.set(docRef, cardWithMeta, { merge: true });
        batchCount++;

        if (batchCount >= 450) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} cards`);
          batch = db.batch();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} cards`);
      }

      console.log(`Successfully updated ${cards.length} cards`);
      return null;
    } catch (error) {
      console.error('Error updating cards:', error);
      throw error;
    }
  });

/**
 * HTTP trigger for manual updates
 */
exports.updateCardsManual = functions.https.onRequest(async (req, res) => {
  // Verify admin token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    res.status(401).send('Invalid token');
    return;
  }

  try {
    const cards = CARD_DATA.getAllCards();

    let batch = db.batch();
    let batchCount = 0;

    for (const card of cards) {
      const docRef = db.collection('cards').doc(card.id);
      batch.set(docRef, {
        ...card,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      batchCount++;

      if (batchCount >= 450) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    res.json({
      success: true,
      cardsUpdated: cards.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
