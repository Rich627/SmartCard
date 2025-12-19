/**
 * Chase Credit Card Scraper
 * Real web scraper with fallback to cached data
 */

const BaseScraper = require('../utils/BaseScraper');
const { generateCardId, mapCategory } = require('../utils/categories');

const CHASE_CARDS = [
  // ========== SAPPHIRE SERIES ==========
  {
    name: 'Chase Sapphire Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'grocery', multiplier: 3, note: 'online grocery purchases' },
      { category: 'streaming', multiplier: 3 },
      { category: 'travel', multiplier: 2, note: 'other travel purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_preferred_card.png',
    imageColor: '#0A3161'
  },
  {
    name: 'Chase Sapphire Reserve',
    annualFee: 550,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 10, note: 'hotels/car rentals through Chase Travel' },
      { category: 'travelPortalFlights', multiplier: 5, note: 'flights through Chase Travel' },
      { category: 'travel', multiplier: 3, note: 'all other travel' },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_reserve_card_Halo.png',
    imageColor: '#1A1F71'
  },

  // ========== FREEDOM SERIES ==========
  {
    name: 'Chase Freedom Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'drugstore', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_unlimited_card_alt.png',
    imageColor: '#0066B2'
  },
  {
    name: 'Chase Freedom Flex',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'travelPortal', multiplier: 5, note: 'through Chase Travel' },
      { category: 'dining', multiplier: 3 },
      { category: 'drugstore', multiplier: 3 }
    ],
    rotating: { multiplier: 5, cap: 1500, capPeriod: 'quarterly', activationRequired: true },
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_flex_card_alt.png',
    imageColor: '#00A4E4'
  },
  {
    name: 'Chase Freedom Rise',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_rise_alt_card2.png',
    imageColor: '#4A90D9'
  },
  {
    name: 'Chase Freedom Student',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_unlimited_card_alt.png',
    imageColor: '#0066B2'
  },

  // ========== INK BUSINESS SERIES ==========
  {
    name: 'Ink Business Preferred',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'travel', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'shipping', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 3, cap: 150000, capPeriod: 'yearly' },
      { category: 'advertising', multiplier: 3, cap: 150000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ink_preferred_card.png',
    imageColor: '#1A1F71'
  },
  {
    name: 'Ink Business Cash',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'officeSupplies', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'internet', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'phone', multiplier: 5, cap: 25000, capPeriod: 'yearly' },
      { category: 'gas', multiplier: 2, cap: 25000, capPeriod: 'yearly' },
      { category: 'dining', multiplier: 2, cap: 25000, capPeriod: 'yearly' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ink_cash_card.png',
    imageColor: '#2D6A4F'
  },
  {
    name: 'Ink Business Unlimited',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1.5,
    categories: [],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ink_unlimited_card.png',
    imageColor: '#4895EF'
  },
  {
    name: 'Ink Business Premier',
    annualFee: 195,
    rewardType: 'cashback',
    baseReward: 2,
    categories: [
      { category: 'travel', multiplier: 2.5 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ink_business_premier_card.png',
    imageColor: '#1A1F71'
  },

  // ========== UNITED AIRLINES ==========
  {
    name: 'United Quest Card',
    annualFee: 250,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 3, note: 'United purchases' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/united_quest_card.png',
    imageColor: '#002244'
  },
  {
    name: 'United Explorer Card',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'hotels', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/united_explorer_card.png',
    imageColor: '#002244'
  },
  {
    name: 'United Gateway Card',
    annualFee: 0,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'transit', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/united_gateway_card.png',
    imageColor: '#0033A0'
  },
  {
    name: 'United Club Infinite Card',
    annualFee: 525,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 4, note: 'United purchases' },
      { category: 'travel', multiplier: 2, note: 'all other travel' },
      { category: 'dining', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/united_club_infinite_card.png',
    imageColor: '#002244'
  },
  {
    name: 'United Business Card',
    annualFee: 99,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'united', multiplier: 2, note: 'United purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'officeSupplies', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/united_biz_card.png',
    imageColor: '#002244'
  },

  // ========== SOUTHWEST AIRLINES ==========
  {
    name: 'Southwest Rapid Rewards Priority',
    annualFee: 149,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 3, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/swa_priority_card-2.png',
    imageColor: '#304CB2'
  },
  {
    name: 'Southwest Rapid Rewards Plus',
    annualFee: 69,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 2, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/swa_plus_card_New.png',
    imageColor: '#FFBF27'
  },
  {
    name: 'Southwest Rapid Rewards Premier',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 2, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 2 },
      { category: 'internet', multiplier: 2 },
      { category: 'phone', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/swa_premier_card.png',
    imageColor: '#304CB2'
  },
  {
    name: 'Southwest Rapid Rewards Performance Business',
    annualFee: 199,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'southwest', multiplier: 4, note: 'Southwest purchases' },
      { category: 'transit', multiplier: 3 },
      { category: 'internet', multiplier: 3 },
      { category: 'phone', multiplier: 3 },
      { category: 'advertising', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/swa_performance_biz_card.png',
    imageColor: '#304CB2'
  },

  // ========== HOTEL CARDS ==========
  {
    name: 'Marriott Bonvoy Boundless',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/marriott-bonvoy-boundless-card.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Bold',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'marriott', multiplier: 3, note: 'Marriott hotels' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/marriott_bonvoy_bold_card_NAF.png',
    imageColor: '#8A2432'
  },
  {
    name: 'Marriott Bonvoy Bountiful',
    annualFee: 250,
    rewardType: 'points',
    baseReward: 2,
    categories: [
      { category: 'marriott', multiplier: 6, note: 'Marriott hotels' },
      { category: 'dining', multiplier: 4 },
      { category: 'grocery', multiplier: 3 },
      { category: 'gas', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/marriott_bonvoy_bountiful_card.png',
    imageColor: '#8A2432'
  },
  {
    name: 'IHG One Rewards Premier',
    annualFee: 99,
    rewardType: 'points',
    baseReward: 3,
    categories: [
      { category: 'ihg', multiplier: 26, note: 'IHG hotels' },
      { category: 'travel', multiplier: 5, note: 'travel, gas stations' },
      { category: 'dining', multiplier: 5 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ihg_premier_card.png',
    imageColor: '#005F3D'
  },
  {
    name: 'IHG One Rewards Traveler',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 3,
    categories: [
      { category: 'ihg', multiplier: 17, note: 'IHG hotels' },
      { category: 'gas', multiplier: 3 },
      { category: 'dining', multiplier: 3 },
      { category: 'utilities', multiplier: 3 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ihg-traveler-card.png',
    imageColor: '#005F3D'
  },
  {
    name: 'World of Hyatt Credit Card',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'hyatt', multiplier: 4, note: 'Hyatt purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'airlines', multiplier: 2 },
      { category: 'fitness', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/world_of_hyatt_card.png',
    imageColor: '#2C3E50'
  },
  {
    name: 'World of Hyatt Business Card',
    annualFee: 199,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'hyatt', multiplier: 4, note: 'Hyatt purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'fitness', multiplier: 2 },
      { category: 'shipping', multiplier: 2 },
      { category: 'advertising', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/world_hyatt_biz_card.png',
    imageColor: '#2C3E50'
  },

  // ========== CO-BRAND CARDS ==========
  {
    name: 'Amazon Prime Rewards Visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 5 },
      { category: 'wholefoods', multiplier: 5 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'drugstore', multiplier: 2 },
      { category: 'transit', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/prime-visa.png',
    imageColor: '#FF9900'
  },
  {
    name: 'Amazon Rewards Visa',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'amazon', multiplier: 3 },
      { category: 'wholefoods', multiplier: 3 },
      { category: 'dining', multiplier: 2 },
      { category: 'gas', multiplier: 2 },
      { category: 'drugstore', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/amazon-visa.png',
    imageColor: '#232F3E'
  },
  {
    name: 'Disney Visa Card',
    annualFee: 0,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'entertainment', multiplier: 1, note: 'Disney purchases' },
      { category: 'gas', multiplier: 1 },
      { category: 'grocery', multiplier: 1 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/disney-rewards2025.png',
    imageColor: '#006E96'
  },
  {
    name: 'Disney Premier Visa Card',
    annualFee: 49,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'entertainment', multiplier: 2, note: 'Disney purchases' },
      { category: 'gas', multiplier: 2 },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/disney_Mickey70_premier_card.png',
    imageColor: '#1E3A5F'
  },
  {
    name: 'Instacart Mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'instacart', multiplier: 5, note: 'Instacart purchases' },
      { category: 'grocery', multiplier: 2, note: 'other grocery' },
      { category: 'gas', multiplier: 2 },
      { category: 'dining', multiplier: 2 },
      { category: 'streaming', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/instacart_card.png',
    imageColor: '#43B02A'
  },
  {
    name: 'Aeroplan Credit Card',
    annualFee: 95,
    rewardType: 'points',
    baseReward: 1,
    categories: [
      { category: 'aircanada', multiplier: 3, note: 'Air Canada purchases' },
      { category: 'dining', multiplier: 2 },
      { category: 'grocery', multiplier: 1.5 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/aeroplan_card.png',
    imageColor: '#C8102E'
  },
  {
    name: 'British Airways Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'britishairways', multiplier: 3, note: 'British Airways purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/british-airways.png',
    imageColor: '#075AAA'
  },
  {
    name: 'Iberia Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'iberia', multiplier: 3, note: 'Iberia purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/iberia_card.png',
    imageColor: '#CB2127'
  },
  {
    name: 'Aer Lingus Visa',
    annualFee: 95,
    rewardType: 'miles',
    baseReward: 1,
    categories: [
      { category: 'aerlingus', multiplier: 3, note: 'Aer Lingus purchases' }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/aer_lingus_card.png',
    imageColor: '#006272'
  },
  {
    name: 'DoorDash Rewards Mastercard',
    annualFee: 0,
    rewardType: 'cashback',
    baseReward: 1,
    categories: [
      { category: 'doordash', multiplier: 4, note: 'DoorDash orders' },
      { category: 'dining', multiplier: 3, note: 'other dining' },
      { category: 'grocery', multiplier: 2 }
    ],
    imageURL: 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/doordash_card.png',
    imageColor: '#FF3008'
  }
];

/**
 * Chase Scraper class - extends BaseScraper
 */
class ChaseScraper extends BaseScraper {
  constructor() {
    super('Chase', {
      fallbackCards: CHASE_CARDS.map(card => formatCard('Chase', card)),
      baseUrl: 'https://creditcards.chase.com',
      timeout: 45000
    });
  }

  /**
   * Scrape live data from Chase website
   */
  async scrapeLive() {
    await this.launchBrowser();
    const page = await this.browser.newPage();

    // Navigate to all cards page
    const url = `${this.baseUrl}/all-credit-cards`;
    console.log(`    📄 載入 ${url}`);

    const success = await this.safeGoto(page, url);
    if (!success) return [];

    await this.randomDelay(2000, 4000);

    // Extract card links and basic info from the listing page
    const cardLinks = await page.evaluate(() => {
      const links = [];
      // Find all card product links
      const cardElements = document.querySelectorAll('a[href*="/credit-cards/"]');
      const seen = new Set();

      cardElements.forEach(el => {
        const href = el.getAttribute('href');
        // Filter to actual card product pages
        if (href && (href.includes('/cash-back-credit-cards/') ||
            href.includes('/travel-credit-cards/') ||
            href.includes('/business-credit-cards/') ||
            href.includes('/a]')) &&
            !href.includes('/compare') &&
            !href.includes('/application')) {

          const fullUrl = href.startsWith('http') ? href : `https://creditcards.chase.com${href}`;
          if (!seen.has(fullUrl)) {
            seen.add(fullUrl);
            links.push(fullUrl);
          }
        }
      });
      return links;
    });

    console.log(`    🔗 找到 ${cardLinks.length} 個卡片連結`);

    // Visit each card page and extract details
    const scrapedCards = [];
    const maxCards = Math.min(cardLinks.length, 10); // Limit to 10 for testing

    for (let i = 0; i < maxCards; i++) {
      const cardUrl = cardLinks[i];
      console.log(`    📋 抓取卡片 ${i + 1}/${maxCards}: ${cardUrl.split('/').pop()}`);

      try {
        await this.randomDelay(1500, 3000);
        await this.safeGoto(page, cardUrl);
        await this.randomDelay(1000, 2000);

        const cardData = await page.evaluate(() => {
          const data = {};

          // Card name - typically in h1 or main heading
          const h1 = document.querySelector('h1');
          if (h1) {
            data.name = h1.textContent.trim().replace(/®|™|℠/g, '').trim();
          }

          // Annual fee - look for "ANNUAL FEE" text
          const allText = document.body.innerText;
          const annualFeeMatch = allText.match(/ANNUAL FEE[:\s]*\$?([\d,]+|\d+)/i);
          if (annualFeeMatch) {
            data.annualFee = parseInt(annualFeeMatch[1].replace(',', ''), 10);
          } else if (allText.toLowerCase().includes('no annual fee') ||
                     allText.toLowerCase().includes('$0 annual fee')) {
            data.annualFee = 0;
          }

          // Rewards - look for percentage or X multipliers
          const rewards = [];
          const rewardPatterns = [
            /(\d+(?:\.\d+)?)[x%]\s+(?:cash\s*back|points?|miles?)\s+(?:on\s+)?(.+?)(?:\.|,|$)/gi,
            /unlimited\s+(\d+(?:\.\d+)?)[%]\s+cash\s*back/i,
            /earn\s+(\d+)[x%]\s+(?:points?|miles?)\s+(?:on\s+)?(.+?)(?:\.|,|$)/gi
          ];

          // Extract from "AT A GLANCE" or similar sections
          const listItems = document.querySelectorAll('li, p');
          listItems.forEach(li => {
            const text = li.textContent;
            rewardPatterns.forEach(pattern => {
              const match = text.match(pattern);
              if (match) {
                rewards.push(text.trim());
              }
            });
          });

          data.rawRewards = rewards.slice(0, 10);

          // Card image
          const cardImg = document.querySelector('img[src*="cardart"], img[alt*="card"]');
          if (cardImg) {
            data.imageUrl = cardImg.src;
          }

          return data;
        });

        if (cardData.name) {
          scrapedCards.push({
            ...cardData,
            applicationUrl: cardUrl,
            issuer: 'Chase'
          });
        }
      } catch (error) {
        console.log(`      ⚠️  無法抓取: ${error.message}`);
      }
    }

    return scrapedCards;
  }

  /**
   * Override merge to update specific fields from live data
   */
  mergeWithFallback(liveData) {
    const merged = [...this.fallbackCards];

    for (const liveCard of liveData) {
      // Try to match by name (fuzzy match)
      const liveNameLower = liveCard.name.toLowerCase();
      const existingIndex = merged.findIndex(c => {
        const fallbackNameLower = c.name.toLowerCase();
        return fallbackNameLower === liveNameLower ||
               fallbackNameLower.includes(liveNameLower) ||
               liveNameLower.includes(fallbackNameLower);
      });

      if (existingIndex >= 0) {
        // Update with live data
        const existing = merged[existingIndex];
        merged[existingIndex] = {
          ...existing,
          // Only update if live data has the value
          ...(liveCard.annualFee !== undefined && { annualFee: liveCard.annualFee }),
          ...(liveCard.imageUrl && { imageURL: liveCard.imageUrl }),
          ...(liveCard.applicationUrl && { applicationUrl: liveCard.applicationUrl })
        };
        console.log(`      ✅ 更新: ${existing.name}`);
      }
    }

    return merged;
  }
}

async function scrapeChase() {
  const scraper = new ChaseScraper();
  return await scraper.scrape();
}

function formatCard(issuer, cardData) {
  // Map categories to iOS SpendingCategory enum values
  const categoryRewards = (cardData.categories || [])
    .map(cat => {
      const mappedCategory = mapCategory(cat.category);
      if (!mappedCategory) {
        console.warn(`  ⚠️  Unknown category '${cat.category}' in ${cardData.name}, skipping`);
        return null;
      }
      return {
        category: mappedCategory,
        multiplier: cat.multiplier,
        isPercentage: cardData.rewardType === 'cashback',
        cap: cat.cap || null,
        capPeriod: cat.capPeriod || null
      };
    })
    .filter(Boolean);

  const card = {
    id: generateCardId(issuer, cardData.name),
    name: cardData.name,
    issuer: issuer,
    network: cardData.network || 'visa',
    annualFee: cardData.annualFee,
    rewardType: cardData.rewardType,
    baseReward: cardData.baseReward,
    baseIsPercentage: cardData.rewardType === 'cashback',
    categoryRewards: categoryRewards,
    rotatingCategories: null,
    selectableConfig: null,
    signUpBonus: cardData.signUpBonus || null,
    imageColor: cardData.imageColor || '#1A1F71',
    imageURL: cardData.imageURL || null
  };

  if (cardData.rotating) {
    const currentQuarter = Math.floor((new Date().getMonth()) / 3) + 1;
    const currentYear = new Date().getFullYear();

    // 2025 rotating categories (updated Dec 2025)
    // Note: These are raw categories that will be mapped to iOS SpendingCategory
    const CHASE_ROTATING = {
      1: ['grocery', 'fitness', 'fitness'],  // hairSalon maps to fitness
      2: ['amazon', 'streaming'],
      3: ['grocery', 'entertainment', 'gas', 'evCharging'],  // instacart maps to grocery
      4: ['travel', 'other', 'paypal']  // chaseTravel->travel, departmentStores->other
    };

    // Map rotating categories to iOS values
    const rawCategories = CHASE_ROTATING[currentQuarter] || ['grocery', 'gas'];
    const mappedCategories = [...new Set(rawCategories.map(cat => mapCategory(cat)).filter(Boolean))];

    card.rotatingCategories = [{
      quarter: currentQuarter,
      year: currentYear,
      categories: mappedCategories,
      multiplier: cardData.rotating.multiplier,
      isPercentage: cardData.rewardType === 'cashback',
      cap: cardData.rotating.cap,
      activationRequired: cardData.rotating.activationRequired
    }];
  }

  return card;
}

// Run standalone for testing
if (require.main === module) {
  console.log('🏦 Testing Chase Scraper...\n');
  scrapeChase()
    .then(cards => {
      console.log(`\n✅ Total cards: ${cards.length}`);
      cards.slice(0, 3).forEach(card => {
        console.log(`  - ${card.name}: $${card.annualFee} annual fee`);
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = scrapeChase;
