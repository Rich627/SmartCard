const data = require('./scraped-cards.json');

const withImage = data.cards.filter(c => c.imageURL && c.imageURL !== '');
const withNull = data.cards.filter(c => c.imageURL === null);
const withColor = data.cards.filter(c => c.imageColor);

console.log('=== Image URL Final Status ===');
console.log('Total cards:', data.cards.length);
console.log('With working imageURL:', withImage.length);
console.log('With null imageURL (using fallback):', withNull.length);
console.log('');
console.log('Cards using imageColor fallback:');
withNull.forEach(c => console.log('  -', c.name, '| color:', c.imageColor));
