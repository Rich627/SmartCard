const scrapeOthers = require('./scrapers/others');

scrapeOthers().then(cards => {
  console.log('\n=== 結果 ===');
  console.log('總共:', cards.length, '張卡');

  // 統計有圖片的卡
  const issues = [];
  cards.forEach(c => {
    if (!c.imageURL || c.imageURL === '') {
      issues.push(c.name);
    }
  });

  console.log('有圖片:', cards.length - issues.length, '張');
  if (issues.length > 0) {
    console.log('\n缺少圖片:');
    issues.forEach(n => console.log('  -', n));
  }
}).catch(err => console.error('錯誤:', err.message));
