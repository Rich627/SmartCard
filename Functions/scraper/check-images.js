const https = require('https');
const http = require('http');

const urls = [
  // Chase
  'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_preferred_card.png',
  'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_reserve_card_Halo.png',
  // Amex
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-card.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png',
  // Capital One
  'https://ecm.capitalone.com/WCM/card/products/savor-background.png',
  'https://ecm.capitalone.com/WCM/card/products/venturex-background.png',
  // Citi
  'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png',
  // Discover
  'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/background/bg-cards-itcards-388-350.png',
  // Wells Fargo
  'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/ActiveCash/WF_ActiveCash_VS_Collateral_Front_RGB.png',
  // Bank of America
  'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8ckn_cshsigcm_v_250x158.png',
  // US Bank
  'https://www.usbank.com/content/dam/usbank/en/images/illustrations/card-art/credit-cards/altitude-go-visa-signature-credit-card.png',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      resolve({ url: url.split('/').pop(), status: res.statusCode, ok: res.statusCode === 200 });
    });
    req.on('error', () => resolve({ url: url.split('/').pop(), status: 'ERROR', ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ url: url.split('/').pop(), status: 'TIMEOUT', ok: false }); });
  });
}

async function main() {
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(result.ok ? '✅' : '❌', result.url, '-', result.status);
  }
}

main();
