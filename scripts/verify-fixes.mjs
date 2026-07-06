import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });

// membership annual: check bullet + terms + screenshot
const p = await b.newPage();
await p.goto('http://localhost:3000/membership.html', { waitUntil: 'networkidle0' });
const bulletBefore = await p.$eval('.price-feat', el => el.textContent);
await p.click('#billingToggle');
await new Promise(r => setTimeout(r, 300));
const bulletAfter = await p.$eval('.price-feat', el => el.textContent);
const priceAfter = await p.$$eval('.price', els => els.map(e => e.textContent));
const terms = await p.$$eval('#pricing ~ section h3, section h3', () => null); // noop
const termTitles = await p.$$eval('.section-title ~ ol h3, ol h3', els => els.map(e => e.textContent));
const nums = await p.$$eval('ol .font-display', els => els.map(e => e.textContent.trim()));
console.log('bullet monthly:', bulletBefore);
console.log('bullet annual :', bulletAfter);
console.log('prices after toggle:', priceAfter.join(' | '));
console.log('term count:', termTitles.length, '| numbers:', nums.join(','));
console.log('has Reactivation:', termTitles.some(t => /Reactivation/.test(t)));
console.log('last term:', termTitles[termTitles.length - 1]);
// prime reveals then screenshot annual state
await p.evaluate(() => document.querySelectorAll('.reveal').forEach(el => { el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; }));
await new Promise(r => setTimeout(r, 300));
await p.screenshot({ path: 'scripts/shots/verify-membership-annual.png', fullPage: true });
await p.close();

// faq rental text
const f = await b.newPage();
await f.goto('http://localhost:3000/faq.html', { waitUntil: 'networkidle0' });
const rental = await f.evaluate(() => document.body.innerText.match(/rentals start at \$\d+/)?.[0]);
console.log('faq rental:', rental);
await f.close();

await b.close();
