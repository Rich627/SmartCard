const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Plaid configuration - uses Firebase environment config
// Set with: firebase functions:config:set plaid.client_id="xxx" plaid.secret="xxx"
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Change to 'development' or 'production' later
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": functions.config().plaid?.client_id || "",
      "PLAID-SECRET": functions.config().plaid?.secret || "",
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

// Store for access tokens (in production, store in Firestore with encryption)
const db = admin.firestore();

/**
 * Create a Link token for Plaid Link
 */
exports.createLinkToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { client_user_id } = req.body;

        const response = await plaidClient.linkTokenCreate({
          user: {
            client_user_id: client_user_id || "anonymous",
          },
          client_name: "SmartCard",
          products: ["transactions"],
          country_codes: ["US"],
          language: "en",
        });

        res.json({ link_token: response.data.link_token });
      } catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({ error: error.message });
      }
    });
  });

/**
 * Exchange public token for access token and get account info
 */
exports.exchangePublicToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { public_token, institution_name, user_id } = req.body;

        // Exchange public token for access token
        const tokenResponse = await plaidClient.itemPublicTokenExchange({
          public_token: public_token,
        });

        const accessToken = tokenResponse.data.access_token;
        const itemId = tokenResponse.data.item_id;

        // Get account info
        const accountsResponse = await plaidClient.accountsGet({
          access_token: accessToken,
        });

        const accounts = accountsResponse.data.accounts.map((account) => ({
          account_id: account.account_id,
          name: account.name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
        }));

        // Store access token in Firestore (encrypted in production)
        // Use user_id if provided, otherwise use item_id as key
        const storageKey = user_id || itemId;
        await db.collection("plaid_tokens").doc(storageKey).set({
          access_token: accessToken, // In production, encrypt this!
          item_id: itemId,
          institution_name: institution_name,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({
          item_id: itemId,
          accounts: accounts,
        });
      } catch (error) {
        console.error("Error exchanging token:", error);
        res.status(500).json({ error: error.message });
      }
    });
  });

/**
 * Get transactions for an account
 */
exports.getTransactions = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { account_id, start_date, end_date, user_id } = req.body;

        // Get access token from Firestore
        const tokenDoc = await db.collection("plaid_tokens").doc(user_id).get();
        if (!tokenDoc.exists) {
          return res.status(404).json({ error: "No linked account found" });
        }

        const accessToken = tokenDoc.data().access_token;

        // Format dates
        const startDate = start_date
          ? new Date(start_date).toISOString().split("T")[0]
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0];
        const endDate = end_date
          ? new Date(end_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        // Fetch transactions
        const response = await plaidClient.transactionsGet({
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          options: {
            account_ids: account_id ? [account_id] : undefined,
            count: 100,
          },
        });

        const transactions = response.data.transactions.map((tx) => ({
          transaction_id: tx.transaction_id,
          account_id: tx.account_id,
          amount: tx.amount,
          date: tx.date,
          name: tx.name,
          merchant_name: tx.merchant_name,
          category: tx.category,
          pending: tx.pending,
        }));

        res.json({ transactions: transactions });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: error.message });
      }
    });
  });

/**
 * Sync transactions (webhook handler for Plaid)
 */
exports.plaidWebhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { webhook_type, webhook_code, item_id } = req.body;

      console.log(`Plaid webhook: ${webhook_type} - ${webhook_code}`);

      if (webhook_type === "TRANSACTIONS") {
        // Handle transaction updates
        // You can trigger a sync here
        console.log(`Transaction update for item: ${item_id}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

/**
 * Remove a linked account
 */
exports.unlinkAccount = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const { user_id } = req.body;

        // Get access token
        const tokenDoc = await db.collection("plaid_tokens").doc(user_id).get();
        if (!tokenDoc.exists) {
          return res.status(404).json({ error: "No linked account found" });
        }

        const accessToken = tokenDoc.data().access_token;

        // Remove from Plaid
        await plaidClient.itemRemove({
          access_token: accessToken,
        });

        // Delete from Firestore
        await db.collection("plaid_tokens").doc(user_id).delete();

        res.json({ success: true });
      } catch (error) {
        console.error("Error unlinking account:", error);
        res.status(500).json({ error: error.message });
      }
    });
  });
