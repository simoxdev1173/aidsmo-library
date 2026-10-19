import { expect, test } from '@playwright/test';

test('the existing loader keeps the clicked viewport behind its fade', async ({ page }) => {
  await page.goto('/about-us');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  const link = page.locator('header a[href="/"]:visible').first();
  await expect(link).toBeVisible();
  await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await link.click();

  const overlay = page.locator('[data-navigation-loading-overlay]');
  await expect(overlay).toBeVisible();
  await expect(overlay.getByRole('status')).toBeVisible();
  const geometry = await page.evaluate(() => {
    const original = document.querySelector('#main-content');
    const frozen = document.querySelector('.navigation-snapshot #main-content');
    const originalHeader = document.querySelector('header[data-compact]');
    const frozenHeader = document.querySelector('.navigation-snapshot > header[data-compact]');
    const frozenFooter = document.querySelector('.navigation-snapshot footer');
    return {
      originalTop: original?.getBoundingClientRect().top,
      frozenTop: frozen?.getBoundingClientRect().top,
      originalHeaderTop: originalHeader?.getBoundingClientRect().top,
      frozenHeaderTop: frozenHeader?.getBoundingClientRect().top,
      footerTop: frozenFooter?.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
    };
  });
  expect(Math.abs(geometry.originalTop! - geometry.frozenTop!)).toBeLessThan(2);
  expect(Math.abs(geometry.originalHeaderTop! - geometry.frozenHeaderTop!)).toBeLessThan(2);
  expect(geometry.footerTop!).toBeGreaterThan(geometry.viewportHeight);
});

test('the overlay clears after an internal navigation', async ({ page }) => {
  await page.goto('/about-us');
  await page.waitForLoadState('networkidle');
  await page.locator('header a[href="/"]:visible').first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-navigation-loading-overlay]')).toHaveCount(0);
});

test('a mobile click near the footer preserves the visible footer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about-us');
  await page.waitForLoadState('networkidle');
  const link = page.locator('footer a[href="/"]').first();
  await link.scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeInViewport();
  await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await link.click();
  await expect(page.locator('[data-navigation-loading-overlay]')).toBeVisible();
  const footer = page.locator('.navigation-snapshot footer');
  await expect(footer).toBeVisible();
  const footerBox = await footer.boundingBox();
  expect(footerBox!.y).toBeLessThan(844);
});

test('the About Us video freezes on its current frame', async ({ page }) => {
  await page.goto('/about-us');
  await page.waitForFunction(() => {
    const video = document.querySelector('main video');
    return video instanceof HTMLVideoElement && video.readyState >= 2 && video.currentTime > 0;
  });

  const link = page.locator('main a[href="/catalog/industry"]').first();
  await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await link.click();

  const still = page.locator('.navigation-snapshot img[data-frozen-video-frame]');
  await expect(still).toBeVisible();
  expect(await still.getAttribute('src')).toMatch(/^data:image\/jpeg;base64,/);
  const videoBox = await page.locator('main video').boundingBox();
  const stillBox = await still.boundingBox();
  expect(Math.abs(videoBox!.x - stillBox!.x)).toBeLessThan(2);
  expect(Math.abs(videoBox!.y - stillBox!.y)).toBeLessThan(2);
});
