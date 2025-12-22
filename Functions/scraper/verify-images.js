const https = require('https');
const http = require('http');

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ name, status: 'NO_URL', ok: false });
      return;
    }
    try {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, { timeout: 10000 }, (res) => {
        resolve({ name, status: res.statusCode, ok: res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302 });
      });
      req.on('error', (e) => resolve({ name, status: 'ERR: ' + e.code, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ name, status: 'TIMEOUT', ok: false }); });
    } catch (e) {
      resolve({ name, status: 'EXCEPTION', ok: false });
    }
  });
}

async function main() {
  const data = require("./scraped-cards.json");
  const cards = data.cards;

  console.log('Checking ' + cards.length + ' card images...\n');

  const failed = [];

  // Check in batches of 10 to avoid overwhelming
  for (let i = 0; i < cards.length; i += 10) {
    const batch = cards.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(c => checkUrl(c.imageURL, '[' + c.issuer + '] ' + c.name))
    );

    for (const result of batchResults) {
      if (!result.ok) {
        console.log('❌ ' + result.name + ': ' + result.status);
        failed.push(result);
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log('Total: ' + cards.length);
  console.log('Working: ' + (cards.length - failed.length));
  console.log('Failed: ' + failed.length);

  if (failed.length > 0) {
    console.log('\n=== Failed URLs by Issuer ===');
    const byIssuer = {};
    failed.forEach(f => {
      const issuer = f.name.match(/\[([^\]]+)\]/)[1];
      if (!byIssuer[issuer]) byIssuer[issuer] = [];
      byIssuer[issuer].push(f);
    });
    Object.keys(byIssuer).sort().forEach(issuer => {
      console.log('\n' + issuer + ' (' + byIssuer[issuer].length + ' failed):');
      byIssuer[issuer].forEach(f => console.log('  - ' + f.name.replace('[' + issuer + '] ', '') + ': ' + f.status));
    });
  }
}

main();
