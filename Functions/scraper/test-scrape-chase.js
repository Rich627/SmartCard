/**
 * Test scraper for Chase credit cards
 * Uses HTTP requests + HTML parsing (no browser needed)
 */

const https = require('https');
const http = require('http');

// Chase card URLs to scrape
const CHASE_CARD_URLS = [
  { name: 'Freedom Flex', url: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex' },
  { name: 'Freedom Unlimited', url: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited' },
  { name: 'Sapphire Preferred', url: 'https://creditcards.chase.com/travel-credit-cards/sapphire/preferred' },
  { name: 'Sapphire Reserve', url: 'https://creditcards.chase.com/travel-credit-cards/sapphire/reserve' }
];

/**
 * Fetch a URL with proper headers
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000
    };

    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        console.log(`   ↪ Redirect to: ${redirectUrl.substring(0, 60)}...`);
        return fetchPage(redirectUrl).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

/**
 * Parse Chase card rewards from HTML
 */
function parseChaseRewards(html, cardName) {
  const data = {
    name: cardName,
    annualFee: null,
    rewards: [],
    signUpBonus: null,
    introAPR: null,
    imageURL: null
  };

  // Extract annual fee
  const feeMatch = html.match(/\$(\d+)\s*annual\s*fee/i);
  if (feeMatch) {
    data.annualFee = parseInt(feeMatch[1], 10);
  }
  if (html.match(/\$0\s*annual\s*fee/i) || html.match(/no\s*annual\s*fee/i)) {
    data.annualFee = 0;
  }

  // Extract rewards patterns - look for patterns like "5% cash back on X" or "3x on Y"
  // Chase uses specific patterns in their HTML
  const rewardPatterns = [
    // "5% cash back" patterns
    { regex: /(\d+)%\s*(?:cash\s*back|back)\s*(?:on|at)\s+([^<\n.]+)/gi, isPercentage: true },
    // "5x points" patterns
    { regex: /(\d+)x\s*(?:points?)?\s*(?:on|at)\s+([^<\n.]+)/gi, isPercentage: false },
    // "Earn 5%" patterns
    { regex: /earn\s+(\d+)%\s*(?:cash\s*back|back)?\s*(?:on|at)\s+([^<\n.]+)/gi, isPercentage: true },
    // "Earn 5x" patterns
    { regex: /earn\s+(\d+)x\s*(?:points?)?\s*(?:on|at)\s+([^<\n.]+)/gi, isPercentage: false }
  ];

  for (const { regex, isPercentage } of rewardPatterns) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      const multiplier = parseInt(match[1], 10);
      let category = match[2].trim()
        .replace(/<[^>]+>/g, '')  // Remove HTML tags
        .replace(/&[^;]+;/g, '')   // Remove HTML entities
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .toLowerCase()
        .trim();

      // Extract just the category name (first few words)
      const words = category.split(' ').slice(0, 5).join(' ');
      if (words.length > 3 && words.length < 60 && multiplier >= 1 && multiplier <= 10) {
        // Check for duplicates
        const existing = data.rewards.find(r =>
          r.category.includes(words) || words.includes(r.category)
        );
        if (!existing) {
          data.rewards.push({
            multiplier,
            category: words,
            isPercentage
          });
        }
      }
    }
  }

  // Extract sign-up bonus
  const bonusPatterns = [
    /\$(\d{1,3}(?:,\d{3})*)\s*bonus/i,
    /(\d{1,3}(?:,\d{3})*)\s*bonus\s*points/i,
    /earn\s*(?:a\s*)?\$?(\d{1,3}(?:,\d{3})*)\s*(?:bonus|points)/i
  ];
  for (const pattern of bonusPatterns) {
    const match = html.match(pattern);
    if (match) {
      data.signUpBonus = match[1].replace(/,/g, '');
      break;
    }
  }

  // Extract intro APR
  const aprMatch = html.match(/0%\s*(?:intro\s*)?APR\s*(?:for\s*)?(\d+)\s*months?/i);
  if (aprMatch) {
    data.introAPR = `0% for ${aprMatch[1]} months`;
  }

  // Extract card image
  const imgPatterns = [
    /src=["']([^"']*card[^"']*\.png)/i,
    /src=["']([^"']*freedom[^"']*\.png)/i,
    /src=["']([^"']*sapphire[^"']*\.png)/i
  ];
  for (const pattern of imgPatterns) {
    const match = html.match(pattern);
    if (match) {
      let imgUrl = match[1];
      if (!imgUrl.startsWith('http')) {
        imgUrl = 'https://creditcards.chase.com' + imgUrl;
      }
      data.imageURL = imgUrl;
      break;
    }
  }

  return data;
}

async function scrapeChaseCard(cardInfo) {
  console.log(`\n📋 抓取: ${cardInfo.name}`);
  console.log(`   URL: ${cardInfo.url}`);

  try {
    const html = await fetchPage(cardInfo.url);
    console.log(`   ✅ 獲得 HTML (${html.length} bytes)`);

    const cardData = parseChaseRewards(html, cardInfo.name);

    console.log(`   年費: $${cardData.annualFee}`);
    console.log(`   獎勵: ${cardData.rewards.length} 個類別`);
    cardData.rewards.forEach(r => {
      console.log(`      - ${r.multiplier}${r.isPercentage ? '%' : 'x'} on ${r.category}`);
    });
    if (cardData.signUpBonus) console.log(`   開卡獎勵: $${cardData.signUpBonus}`);
    if (cardData.introAPR) console.log(`   Intro APR: ${cardData.introAPR}`);
    if (cardData.imageURL) console.log(`   圖片: ${cardData.imageURL.substring(0, 70)}...`);

    return cardData;

  } catch (error) {
    console.log(`   ❌ 錯誤: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 測試 Chase 爬蟲 (HTTP 版本)...\n');

  const results = [];

  for (const cardInfo of CHASE_CARD_URLS) {
    const cardData = await scrapeChaseCard(cardInfo);
    if (cardData) {
      results.push(cardData);
    }
    // Delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n\n📊 總結:');
  console.log(`   成功抓取: ${results.length}/${CHASE_CARD_URLS.length} 張卡片`);

  // Show summary
  console.log('\n📄 抓取結果:');
  results.forEach(card => {
    console.log(`\n   ${card.name}:`);
    console.log(`      年費: $${card.annualFee}`);
    console.log(`      獎勵: ${card.rewards.map(r => `${r.multiplier}${r.isPercentage ? '%' : 'x'} ${r.category}`).join(', ')}`);
  });
}

main().catch(console.error);
