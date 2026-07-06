import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

const sizes = [
  ['hero-1440', 1440, 900],
  ['hero-1920', 1920, 1080],
  ['hero-mobile', 390, 844],
  ['hero-mobile-414', 414, 896],
];

for (const [name, w, h] of sizes) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await p.screenshot({ path: `scripts/shots/${name}.png` }); // viewport only = hero
  await p.close();
  console.log('shot', name);
}
await b.close();
console.log('done');
