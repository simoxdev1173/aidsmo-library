const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [320, 375, 390, 768, 1280, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://127.0.0.1:3001', { waitUntil: 'domcontentloaded' });
    const title = page.locator('.hero-copy h1');
    await title.waitFor();
    console.log(JSON.stringify({ width, ...(await title.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const spans = [...element.querySelectorAll('span')].map((span) => { const bounds = span.getBoundingClientRect(); return { left: bounds.left, right: bounds.right, height: bounds.height }; });
      return { text: element.textContent, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, left: rect.left, right: rect.right, fontSize: getComputedStyle(element).fontSize, whiteSpace: getComputedStyle(element).whiteSpace, spans };
    })) }));
    if (width === 320 || width === 1440) await page.screenshot({ path: `.hero-title-${width}.png`, fullPage: false });
    await page.close();
  }
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
