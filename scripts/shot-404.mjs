import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
for (const [tag, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto('http://localhost:3000/404.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await p.screenshot({ path: `scripts/shots/page-404-${tag}.png` });
  await p.close();
}
await b.close();
console.log('done');
