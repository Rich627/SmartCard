const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const cors = require("cors")({ origin: false });
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

admin.initializeApp();

// Plaid configuration - uses Firebase environment config
// Set with: firebase functions:config:set plaid.client_id="xxx" plaid.secret="xxx" plaid.env="sandbox"
const plaidEnv = functions.config().plaid?.env || "sandbox";
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[plaidEnv] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": functions.config().plaid?.client_id || "",
      "PLAID-SECRET": functions.config().plaid?.secret || "",
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);
const db = admin.firestore();

// =============================================================================
// Helpers
// =============================================================================

/**
 * Authenticate request via Firebase Auth ID token.
 * Returns the decoded token (contains uid, email, sign_in_provider, etc.).
 */
async function authenticateRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}

/**
 * Check if the authenticated user is anonymous.
 * Anonymous users are restricted from Plaid financial operations.
 */
function isAnonymousUser(decodedToken) {
  return decodedToken.firebase?.sign_in_provider === "anonymous";
}

/**
 * Apply security defaults: method check + security headers.
 * Returns true if request was rejected (caller should return early).
 */
function applySecurityDefaults(req, res, { allowedMethod = "POST" } = {}) {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.set("Cache-Control", "no-store");

  if (req.method !== allowedMethod) {
    res.status(405).json({ error: "Method not allowed" });
    return true;
  }
  return false;
}

/**
 * Validate that a value is a non-empty string within length limits.
 */
function validateString(value, fieldName, { maxLength = 1024, required = true } = {}) {
  if (required && (value === undefined || value === null || value === "")) {
    return `${fieldName} is required`;
  }
  if (value !== undefined && value !== null) {
    if (typeof value !== "string") {
      return `${fieldName} must be a string`;
    }
    if (value.length > maxLength) {
      return `${fieldName} exceeds maximum length`;
    }
  }
  return null;
}

/**
 * Validate ISO date string.
 */
function validateISODate(value, fieldName, { required = false } = {}) {
  if (!required && (value === undefined || value === null || value === "")) {
    return null;
  }
  if (required && (value === undefined || value === null || value === "")) {
    return `${fieldName} is required`;
  }
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return `${fieldName} must be a valid date`;
  }
  return null;
}

// =============================================================================
// AES-256-GCM Encryption
// =============================================================================

const ENCRYPTION_KEY_HEX = functions.config().encryption?.key;

function getEncryptionKey() {
  if (!ENCRYPTION_KEY_HEX || ENCRYPTION_KEY_HEX.length !== 64) {
    throw new Error("Encryption key not configured or invalid length");
  }
  return Buffer.from(ENCRYPTION_KEY_HEX, "hex");
}

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns "iv:authTag:ciphertext" in hex.
 */
function encrypt(plaintext) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an encrypted string (AES-256-GCM).
 * Supports backward compatibility: if the string doesn't contain ':'
 * separators, treat it as legacy base64.
 */
function decryptAccessToken(encryptedString) {
  if (!encryptedString) return null;

  // Legacy base64 format (no ':' separators)
  if (!encryptedString.includes(":")) {
    return Buffer.from(encryptedString, "base64").toString("utf-8");
  }

  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const ciphertext = parts[2];

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// =============================================================================
// Rate Limiting (Firestore-based)
// =============================================================================

/**
 * Check and enforce rate limit for a given uid + endpoint.
 * Returns true if rate limit exceeded.
 */
async function checkRateLimit(uid, endpoint, maxRequests, windowSeconds = 60) {
  const docRef = db.collection("rate_limits").doc(`${uid}_${endpoint}`);

  try {
    const exceeded = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      const now = Date.now();
      const windowMs = windowSeconds * 1000;

      if (!doc.exists) {
        transaction.set(docRef, { requests: [now] });
        return false;
      }

      const data = doc.data();
      // Filter to only requests within the window
      const recentRequests = (data.requests || []).filter((ts) => now - ts < windowMs);

      if (recentRequests.length >= maxRequests) {
        return true;
      }

      recentRequests.push(now);
      transaction.update(docRef, { requests: recentRequests });
      return false;
    });

    return exceeded;
  } catch (error) {
    // Fail closed: reject the request if rate limiting check fails
    console.error("Rate limit check failed:", error);
    return true;
  }
}

// =============================================================================
// Plaid Webhook Signature Verification
// =============================================================================

/**
 * Verify Plaid webhook signature using JWT + JWK.
 */
async function verifyPlaidWebhook(req) {
  const signedJwt = req.headers["plaid-verification"];
  if (!signedJwt) {
    return false;
  }

  try {
    // Decode JWT header to get kid
    const decodedHeader = jwt.decode(signedJwt, { complete: true });
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      return false;
    }

    const kid = decodedHeader.header.kid;

    // Fetch the verification key from Plaid
    const keyResponse = await plaidClient.webhookVerificationKeyGet({ key_id: kid });
    const jwk = keyResponse.data.key;
    const pem = jwkToPem(jwk);

    // Verify JWT with max age to prevent replay attacks
    const decoded = jwt.verify(signedJwt, pem, {
      algorithms: ["ES256"],
      maxAge: "5m",
      clockTolerance: 30,
    });

    // Verify body hash using raw request body to avoid re-serialization issues
    const bodyHash = crypto
      .createHash("sha256")
      .update(req.rawBody || JSON.stringify(req.body))
      .digest("hex");

    if (decoded.request_body_sha256 !== bodyHash) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return false;
  }
}

// =============================================================================
// Endpoints
// =============================================================================

/**
 * Create a Link token for Plaid Link
 */
exports.createLinkToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (applySecurityDefaults(req, res)) return;

    try {
      const decodedToken = await authenticateRequest(req);
      if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const uid = decodedToken.uid;

      // Rate limit: 10 req/min
      if (await checkRateLimit(uid, "createLinkToken", 10)) {
        return res.status(429).json({ error: "Too many requests" });
      }

      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: uid,
        },
        client_name: "SmartCard",
        products: ["transactions"],
        country_codes: ["US"],
        language: "en",
      });

      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.error("Error creating link token:", error);
      res.status(500).json({ error: "An internal error occurred" });
    }
  });
});

/**
 * Exchange public token for access token and get account info
 */
exports.exchangePublicToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (applySecurityDefaults(req, res)) return;

    try {
      const decodedToken = await authenticateRequest(req);
      if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isAnonymousUser(decodedToken)) {
        return res.status(403).json({ error: "Account upgrade required for Plaid operations" });
      }

      const uid = decodedToken.uid;

      // Rate limit: 5 req/min
      if (await checkRateLimit(uid, "exchangePublicToken", 5)) {
        return res.status(429).json({ error: "Too many requests" });
      }

      const { public_token, institution_name } = req.body;

      // Input validation
      const errors = [
        validateString(public_token, "public_token"),
        validateString(institution_name, "institution_name", { maxLength: 256 }),
      ].filter(Boolean);

      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
      }

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

      // Store access token in Firestore with AES-256-GCM encryption
      const encryptedToken = encrypt(accessToken);
      await db.collection("plaid_tokens").doc(uid).set({
        access_token_encrypted: encryptedToken,
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
      res.status(500).json({ error: "An internal error occurred" });
    }
  });
});

/**
 * Get transactions for an account
 */
exports.getTransactions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (applySecurityDefaults(req, res)) return;

    try {
      const decodedToken = await authenticateRequest(req);
      if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isAnonymousUser(decodedToken)) {
        return res.status(403).json({ error: "Account upgrade required for Plaid operations" });
      }

      const uid = decodedToken.uid;

      // Rate limit: 30 req/min
      if (await checkRateLimit(uid, "getTransactions", 30)) {
        return res.status(429).json({ error: "Too many requests" });
      }

      const { account_id, start_date, end_date } = req.body;

      // Input validation
      const errors = [
        validateString(account_id, "account_id", { required: false, maxLength: 256 }),
        validateISODate(start_date, "start_date"),
        validateISODate(end_date, "end_date"),
      ].filter(Boolean);

      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
      }

      // Get access token from Firestore using verified uid
      const tokenDoc = await db.collection("plaid_tokens").doc(uid).get();
      if (!tokenDoc.exists) {
        return res.status(404).json({ error: "No linked account found" });
      }

      const tokenData = tokenDoc.data();
      const accessToken = decryptAccessToken(tokenData.access_token_encrypted)
        || tokenData.access_token;

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
      res.status(500).json({ error: "An internal error occurred" });
    }
  });
});

/**
 * Sync transactions (webhook handler for Plaid)
 * Uses Plaid webhook signature verification instead of Firebase Auth.
 */
exports.plaidWebhook = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (applySecurityDefaults(req, res)) return;

    try {
      // Verify Plaid webhook signature
      const isValid = await verifyPlaidWebhook(req);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid webhook signature" });
      }

      const { webhook_type, webhook_code, item_id } = req.body;

      // Input validation
      const errors = [
        validateString(webhook_type, "webhook_type", { maxLength: 128 }),
        validateString(webhook_code, "webhook_code", { maxLength: 128 }),
        validateString(item_id, "item_id", { maxLength: 256 }),
      ].filter(Boolean);

      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0] });
      }

      console.log(`Plaid webhook: ${webhook_type} - ${webhook_code}`);

      if (webhook_type === "TRANSACTIONS") {
        // Fetch the token for this item
        const tokensSnapshot = await db.collection("plaid_tokens")
          .where("item_id", "==", item_id)
          .limit(1)
          .get();

        if (!tokensSnapshot.empty) {
          const tokenData = tokensSnapshot.docs[0].data();
          const accessToken = decryptAccessToken(tokenData.access_token_encrypted)
            || tokenData.access_token;
          const userId = tokensSnapshot.docs[0].id;

          if (webhook_code === "SYNC_UPDATES_AVAILABLE" || webhook_code === "DEFAULT_UPDATE") {
            // Fetch recent transactions and store them
            const endDate = new Date().toISOString().split("T")[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString().split("T")[0];

            const response = await plaidClient.transactionsGet({
              access_token: accessToken,
              start_date: startDate,
              end_date: endDate,
              options: { count: 100 },
            });

            const batch = db.batch();
            for (const tx of response.data.transactions) {
              const ref = db.collection("users").doc(userId)
                .collection("plaid_transactions").doc(tx.transaction_id);
              batch.set(ref, {
                transaction_id: tx.transaction_id,
                account_id: tx.account_id,
                amount: tx.amount,
                date: tx.date,
                name: tx.name,
                merchant_name: tx.merchant_name,
                category: tx.category,
                pending: tx.pending,
                synced_at: admin.firestore.FieldValue.serverTimestamp(),
              });
            }
            await batch.commit();
            console.log(`Synced ${response.data.transactions.length} transactions for item: ${item_id}`);
          }
        } else {
          console.warn(`No token found for item: ${item_id}`);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "An internal error occurred" });
    }
  });
});

/**
 * Remove a linked account
 */
exports.unlinkAccount = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (applySecurityDefaults(req, res)) return;

    try {
      const decodedToken = await authenticateRequest(req);
      if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isAnonymousUser(decodedToken)) {
        return res.status(403).json({ error: "Account upgrade required for Plaid operations" });
      }

      const uid = decodedToken.uid;

      // Rate limit: 5 req/min
      if (await checkRateLimit(uid, "unlinkAccount", 5)) {
        return res.status(429).json({ error: "Too many requests" });
      }

      // Get access token using verified uid
      const tokenDoc = await db.collection("plaid_tokens").doc(uid).get();
      if (!tokenDoc.exists) {
        return res.status(404).json({ error: "No linked account found" });
      }

      const tokenData = tokenDoc.data();
      const accessToken = decryptAccessToken(tokenData.access_token_encrypted)
        || tokenData.access_token;

      // Remove from Plaid
      await plaidClient.itemRemove({
        access_token: accessToken,
      });

      // Delete from Firestore
      await db.collection("plaid_tokens").doc(uid).delete();

      res.json({ success: true });
    } catch (error) {
      console.error("Error unlinking account:", error);
      res.status(500).json({ error: "An internal error occurred" });
    }
  });
});
