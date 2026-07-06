import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
const base = 'http://localhost:3000';
const out = [];

// 1) Every page loads with no console/page errors (favicon now exists)
const pages = ['index', 'membership', 'training', 'facilities', 'schedule', 'faq', 'contact'];
for (const name of pages) {
  const page = await b.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  const resp = await page.goto(`${base}/${name}.html`, { waitUntil: 'networkidle0' });
  out.push(`${name}.html -> HTTP ${resp.status()} | errors: ${errs.length ? errs.join('; ') : 'none'}`);
  await page.close();
}

// 2) Billing toggle on membership page
{
  const page = await b.newPage();
  await page.goto(`${base}/membership.html`, { waitUntil: 'networkidle0' });
  const before = await page.$eval('.price', el => el.textContent);
  await page.click('#billingToggle');
  await new Promise(r => setTimeout(r, 300));
  const after = await page.$eval('.price', el => el.textContent);
  out.push(`billing toggle: "${before}" -> "${after}" ${before !== after ? 'OK' : 'FAIL'}`);
  await page.close();
}

// 3) FAQ accordion on faq page
{
  const page = await b.newPage();
  await page.goto(`${base}/faq.html`, { waitUntil: 'networkidle0' });
  await page.click('.faq-item:nth-child(3) .faq-q');
  await new Promise(r => setTimeout(r, 300));
  const open = await page.$eval('.faq-item:nth-child(3)', el => el.classList.contains('open'));
  out.push(`faq accordion open 3rd: ${open ? 'OK' : 'FAIL'}`);
  await page.close();
}

// 4) Nav link navigation from a child page
{
  const page = await b.newPage();
  await page.goto(`${base}/training.html`, { waitUntil: 'networkidle0' });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('nav a[href="schedule.html"]'),
  ]);
  out.push(`nav training->schedule: ${page.url().endsWith('/schedule.html') ? 'OK' : 'FAIL ' + page.url()}`);
  await page.close();
}

await b.close();
console.log(out.join('\n'));
