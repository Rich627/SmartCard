# Credit Card Data Scraper Maintenance Guide

## Current Architecture

```
+---------------------------------------------------------------+
|  GITHUB ACTIONS (Fully Automated)                             |
|  File: /.github/workflows/monthly-scraper.yml                 |
|                                                               |
|  Runs on the 1st of each month at 8:00 UTC                   |
|  1. Run Puppeteer scraper                                     |
|  2. Upload directly to Firestore                              |
|  3. Fully automated, no manual intervention needed            |
|                                                               |
|  Free (GitHub provides 2000 minutes/month)                    |
|  Supports Puppeteer                                           |
|  Can be triggered manually                                    |
+---------------------------------------------------------------+
                              |
                        Auto Upload
                              |
+---------------------------------------------------------------+
|  FIRESTORE (Database)                                         |
|  Collection: cards                                            |
|  Stores reward data for 136 credit cards                      |
+---------------------------------------------------------------+
```

## Automation Details

GitHub Actions automatically runs on the 1st of each month:
1. Starts an Ubuntu environment
2. Installs Node.js and Puppeteer
3. Runs the scraper to fetch the latest data
4. Uploads to Firestore

## When Should Data Be Updated?

Credit card rewards typically don't change often. Updates are needed in these cases:

| Scenario | Frequency | Example |
|----------|-----------|---------|
| Quarterly rotating categories | Every quarter | Chase Freedom Flex 5% category changes |
| Annual fee adjustments | Rare | Amex Gold $250 -> $325 |
| New card launches | Occasional | New co-branded card releases |
| Reward changes | Rare | Multiplier adjustments, category additions/removals |

**Recommended update frequency**: Check once per quarter (early January, April, July, October)

## Manual Trigger

If you need to update immediately (without waiting for the monthly auto-run):

1. Go to GitHub Repo > **Actions**
2. Click **Monthly Credit Card Scraper**
3. Click **Run workflow** > **Run workflow**
4. Wait for completion (approximately 2-3 minutes)

## Local Testing

To test the scraper locally:

```bash
cd Functions/scraper
npm install
node index.js
node upload-to-firestore.js
```

## Manually Editing Specific Cards

If you only need to modify data for a specific card, edit the corresponding scraper file:

| Issuer | File Path |
|--------|-----------|
| Chase | `/Functions/scraper/scrapers/chase.js` |
| American Express | `/Functions/scraper/scrapers/amex.js` |
| Citi | `/Functions/scraper/scrapers/citi.js` |
| Capital One | `/Functions/scraper/scrapers/capitalone.js` |
| Discover | `/Functions/scraper/scrapers/discover.js` |
| Bank of America | `/Functions/scraper/scrapers/bofa.js` |
| Wells Fargo | `/Functions/scraper/scrapers/wellsfargo.js` |
| US Bank | `/Functions/scraper/scrapers/usbank.js` |
| Others (Barclays, credit unions, etc.) | `/Functions/scraper/scrapers/others.js` |

## Quarterly Rotating Category Updates

Chase Freedom Flex and Discover it have quarterly rotating categories that need to be updated each quarter:

### Chase Freedom Flex
File: `/Functions/scraper/scrapers/chase.js`

```javascript
// Find this code block and update
const CHASE_ROTATING = {
  1: ['grocery', 'fitness', 'hairSalon'],        // Q1: Jan-Mar
  2: ['amazon', 'streaming'],                     // Q2: Apr-Jun
  3: ['instacart', 'entertainment', 'gas'],       // Q3: Jul-Sep
  4: ['chaseTravel', 'departmentStores', 'paypal'] // Q4: Oct-Dec
};
```

### Discover it
File: `/Functions/scraper/scrapers/discover.js`

```javascript
const DISCOVER_ROTATING = {
  Q1: ['grocery', 'fitness'],
  Q2: ['gas', 'homeImprovement', 'evCharging'],
  Q3: ['dining', 'drugstore'],
  Q4: ['amazon', 'walmart', 'target', 'onlineShopping']
};
```

## Related Resources

- [Chase Freedom 5% Calendar](https://www.chase.com/personal/credit-cards/freedom/calendar)
- [Discover 5% Calendar](https://www.discover.com/credit-cards/cashback-bonus/cashback-calendar.html)
- [NerdWallet Credit Cards](https://www.nerdwallet.com/best/credit-cards)
- [The Points Guy](https://thepointsguy.com/credit-cards/)

---

Last updated: 2025-12-18
