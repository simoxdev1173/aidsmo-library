import { expect, test } from '@playwright/test';

test('desktop dropdown reopens on the first hover after visiting a sibling page', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/industry');
  const parent = page.locator('header nav li > a[href="/industry"]');
  const dropdown = parent.locator('..').locator('div.absolute.top-full');

  await parent.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');
  await dropdown.locator('a[href="/industry/events"]').click();
  await expect(page).toHaveURL(/\/industry\/events$/, { timeout: 30_000 });
  await expect(page.locator('[data-navigation-loading-overlay]')).toHaveCount(0);
  await expect(dropdown).toHaveCSS('opacity', '1');

  await parent.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');
  await dropdown.locator('a[href="/industry/studies"]').click();
  await expect(page).toHaveURL(/\/industry\/studies$/, { timeout: 30_000 });
  await expect(page.locator('[data-navigation-loading-overlay]')).toHaveCount(0);
  await expect(dropdown).toHaveCSS('opacity', '1');

  await parent.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');
});

test('mouse focus does not add a second ring to the active navbar item', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/industry');
  const parent = page.locator('header nav li > a[href="/industry"]');

  await parent.click();
  await expect(parent).toHaveClass(/shadow-\[inset_0_-2px_0_#C29C41\]/);
  expect(await parent.evaluate((element) => element.matches(':focus-visible'))).toBe(false);

  await page.keyboard.press('Tab');
  await parent.focus();
  expect(await parent.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
});
