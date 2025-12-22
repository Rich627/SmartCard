const https = require('https');
const http = require('http');

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      resolve({ name, status: res.statusCode, ok: res.statusCode === 200 });
    });
    req.on('error', () => resolve({ name, status: 'ERR', ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ name, status: 'TIMEOUT', ok: false }); });
  });
}

async function main() {
  const scrapers = ['chase', 'amex', 'capitalone', 'citi', 'discover', 'wellsfargo', 'bofa', 'usbank', 'others'];
  
  for (const scraper of scrapers) {
    try {
      const module = require(`./scrapers/${scraper}.js`);
      // Get the cards data - need to look at the source
    } catch (e) {}
  }
  
  // Manually check key cards from each issuer
  const urls = [
    // Chase
    ['Chase Sapphire Preferred', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_preferred_card.png'],
    ['Chase Sapphire Reserve', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_reserve_card_Halo.png'],
    ['Chase Freedom Flex', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_flex_card_alt.png'],
    ['Chase Freedom Unlimited', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_unlimited_card_alt.png'],
    ['Ink Business Preferred', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/ink_preferred_card.png'],
    ['Amazon Prime Rewards', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/prime-visa.png'],
    ['Marriott Bonvoy Boundless', 'https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/marriott-bonvoy-boundless-card.png'],
    
    // Amex
    ['Amex Platinum', 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/platinum-card.png'],
    ['Amex Gold', 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png'],
    ['Blue Cash Preferred', 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-preferred.png'],
    ['Delta SkyMiles Gold', 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-delta-skymiles.png'],
    ['Hilton Honors', 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/hilton-honors.png'],
    
    // Capital One
    ['Capital One Venture X', 'https://ecm.capitalone.com/WCM/card/pages/open-graph/venture-x.png'],
    ['Capital One Venture', 'https://ecm.capitalone.com/WCM/card/pages/open-graph/venture.png'],
    ['Capital One VentureOne', 'https://ecm.capitalone.com/WCM/card/products/og/ventureone.png'],
    ['Capital One SavorOne', 'https://ecm.capitalone.com/WCM/card/pages/open-graph/savorone.png'],
    ['Capital One Quicksilver', 'https://ecm.capitalone.com/WCM/card/pages/open-graph/quicksilver.png'],
    ['Capital One Platinum', 'https://ecm.capitalone.com/WCM/card/pages/open-graph/platinumog.png'],
    
    // Citi
    ['Citi Double Cash', 'https://www.citi.com/CRD/images/citi-double-cash/citi-double-cash_222x140.png'],
    ['Citi Custom Cash', 'https://www.citi.com/CRD/images/citi-custom-cash/citi-custom-cash_222x140.png'],
    ['Citi Premier', 'https://www.citi.com/CRD/images/citi-premier/citi-premier_222x140.png'],
    ['Costco Anywhere Visa', 'https://www.citi.com/CRD/images/costco-anywhere/costco-anywhere_222x140.png'],
    
    // Discover
    ['Discover it Cash Back', 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/background/bg-cards-itcards-388-350.png'],
    ['Discover it Chrome', 'https://www.discover.com/content/dam/discover/en_us/credit-cards/card-acquisitions/grey-redesign/global/images/cardart/cardart-cash-chrome-platinum-620-382.png'],
    
    // Wells Fargo
    ['WF Active Cash', 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/ActiveCash/WF_ActiveCash_VS_Collateral_Front_RGB.png'],
    ['WF Autograph', 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/Autograph/Autograph-No-Fee-Card-RGB_d.png'],
    ['WF Autograph Journey', 'https://creditcards.wellsfargo.com/W-Card-MarketPlace/v12-17-25/images/Products/AutographJourney/WF_Autograph_Journey_Card_d.png'],
    ['WF Bilt', 'https://static.biltrewards.com/assets/seo/bilt_card2_coming_soon_seo.jpg'],
    
    // Bank of America
    ['BofA Customized Cash', 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8ckn_cshsigcm_v_250x158.png'],
    ['BofA Premium Rewards', 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8CAL_prmsigcm_v_250_158.png'],
    ['BofA Travel Rewards', 'https://www.bankofamerica.com/content/images/ContextualSiteGraphics/CreditCardArt/en_US/Approved_PCM/8blm_trvsigcm_v_250x158.png'],
    
    // US Bank
    ['US Bank Altitude Go', 'https://www.usbank.com/content/dam/usbank/en/images/illustrations/card-art/credit-cards/altitude-go-visa-signature-credit-card.png'],
    ['US Bank Altitude Connect', 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-altitude-connect-consumer.png'],
    ['US Bank Cash+', 'https://www.usbank.com/content/dam/usbank/en/images/photos/credit-cards/photo-cash-plus-signature-lg.png'],
    
    // Others (Fintech)
    ['Apple Card', 'https://www.apple.com/v/apple-card/n/images/meta/og__dtukeczp0ygm_overview.png'],
    ['Robinhood Gold', 'https://cdn.robinhood.com/app_assets/credit-card/gold/web/shadow_card_desktop.png'],
  ];
  
  console.log('Checking card images...\n');
  let failed = [];
  
  for (const [name, url] of urls) {
    const result = await checkUrl(url, name);
    if (!result.ok) {
      console.log(`❌ ${name}: ${result.status}`);
      failed.push([name, url]);
    } else {
      console.log(`✅ ${name}`);
    }
  }
  
  if (failed.length > 0) {
    console.log(`\n=== ${failed.length} FAILED ===`);
    failed.forEach(([name, url]) => console.log(`${name}: ${url}`));
  }
}

main();
