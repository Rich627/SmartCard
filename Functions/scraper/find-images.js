const https = require('https');

const testUrls = [
  // Try more Amex patterns
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-gold.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-platinum.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/delta-gold-business.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/amazon-prime-business.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/plum-card.png',
  'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/the-plum-card.png',

  // Citi patterns
  'https://www.citi.com/CBOL/ER/banners/images/citi-diamond-preferred-card.png',
  'https://www.citicards.com/cards/acq/Apply.do?screenId=img/cards/diamond-preferred.png',

  // Walmart/Costco patterns
  'https://i5.walmartimages.com/asr/5f5c7b9e-8f9a-4f5b-8b0e-1234567890ab.png',
  'https://www.walmart.com/content/dam/wm/cards/rewards-card.png',
  'https://www.costco.com/wcsstore/CostcoUSBCCatalogAssetStore/Attachment/costco-anywhere-visa.png',

  // Synchrony
  'https://www.synchrony.com/card-images/verizon-visa.png',
  'https://www.synchrony.com/card-images/cathay-pacific.png',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => resolve({ url, status: 'ERROR' }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
  });
}

async function main() {
  console.log('Testing Credit Karma CDN URLs...\n');

  for (const url of testUrls) {
    const result = await checkUrl(url);
    const name = url.split('/').pop();
    const icon = result.status === 200 ? '✅' : '❌';
    console.log(icon, result.status, '-', name);
  }
}

main();
