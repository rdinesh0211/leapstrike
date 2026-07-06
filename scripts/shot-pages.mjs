import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

const pages = ['membership', 'training', 'facilities', 'schedule', 'faq', 'contact'];
const errors = {};

async function prime(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; });
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
}

for (const name of pages) {
  for (const [tag, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await b.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.setViewport({ width: w, height: h });
    await page.goto(`http://localhost:3000/${name}.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    await prime(page);
    await page.screenshot({ path: `scripts/shots/page-${name}-${tag}.png`, fullPage: true });
    if (errs.length) errors[`${name}-${tag}`] = errs;
    await page.close();
  }
  console.log('shot', name);
}
await b.close();
console.log('ERRORS:', JSON.stringify(errors, null, 2));
