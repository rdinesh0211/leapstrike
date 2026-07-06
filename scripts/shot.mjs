import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000/';
const out = 'scripts/shots';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

async function primeReveals(page) {
  // Force all scroll-reveal elements to their final state so screenshots show true colors
  // (IntersectionObserver mid-transition otherwise leaves late sections faded).
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('in');
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
}

async function shoot(name, width, height, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: opts.dsf || 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await primeReveals(page);
  if (opts.selector) {
    const el = await page.$(opts.selector);
    await el.screenshot({ path: `${out}/${name}.png` });
  } else {
    if (opts.scrollY != null) { await page.evaluate(y => window.scrollTo(0, y), opts.scrollY); await new Promise(r => setTimeout(r, 300)); }
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: !!opts.full });
  }
  await page.close();
  console.log('shot', name);
}

await shoot('desktop-hero', 1440, 900);
await shoot('mobile-hero', 390, 844);
await shoot('desktop-full', 1440, 900, { full: true });
await shoot('mobile-full', 390, 844, { full: true });

// Per-section (desktop)
for (const id of ['membership', 'training', 'facilities', 'schedule', 'faq', 'contact']) {
  await shoot(`sec-${id}`, 1440, 900, { selector: `#${id}` });
}

await browser.close();
console.log('done');
