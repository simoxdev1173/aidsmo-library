import { expect, test } from '@playwright/test';
import { E2E_BOOK_TITLE } from './fixtures';

test('home hydrates without mismatches with a saved locale', async ({ page, context, baseURL }) => {
  test.setTimeout(90_000);
  const hydrationErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrated|server rendered HTML/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => hydrationErrors.push(error.message));
  await context.addCookies([{ name: 'aidsmo-locale', value: 'en', url: baseURL! }]);

  const response = await page.goto('/');
  expect(await response!.text()).toContain('<html lang="en" dir="ltr"');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('header a[href="/about-us"]').first()).toHaveText('About Us');
  await expect(page.locator('#latest-publications')).toBeVisible();

  await page.getByRole('button', { name: 'العربية', exact: true }).first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#latest-publications')).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test('the two-row header stays visible and navigates to About Us', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header').first();
  await expect(header).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(async () => Math.round((await header.boundingBox())?.y ?? -1)).toBe(0);

  await header.getByRole('link', { name: 'من نحن', exact: true }).click();
  await expect(page).toHaveURL(/\/about-us$/);
});

test('Home in the navbar returns to the top after visiting another page', async ({ page }) => {
  await page.goto('/#latest-pub');
  const header = page.locator('header').first();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await header.getByRole('link', { name: 'من نحن', exact: true }).click();
  await expect(page).toHaveURL(/\/about-us$/);
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  await header.getByRole('link', { name: 'الرئيسية', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.waitForTimeout(750);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('Home in the mobile menu returns to the top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about-us');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  const openMenu = page.locator('header button[aria-controls="mobile-site-menu"]');
  const homeLink = page.locator('#mobile-site-menu a[href="/"]').first();
  const showMenu = async () => {
    await openMenu.click();
    await expect(openMenu).toHaveAttribute('aria-expanded', 'true');
  };
  await showMenu();
  await homeLink.click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  await showMenu();
  await homeLink.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('Smart Suggestions opens the library assistant', async ({ page }) => {
  await page.goto('/#chatbot');
  await page.getByRole('button', { name: /اقتراحات ذكية/ }).click();
  await expect(page.getByRole('heading', { name: 'المساعد الآلي' })).toBeVisible();
});

test('search submits a query and shows the matching test book', async ({ page }) => {
  await page.goto('/');
  const search = page.locator('header form[role="search"]').first();
  const query = process.env.E2E_DATABASE_URL ? E2E_BOOK_TITLE : 'industry';
  await search.getByRole('searchbox').fill(query);
  await search.getByRole('searchbox').press('Enter');

  await expect(page).toHaveURL(/\/search\?q=/);
  await expect(page.locator('#catalog-search')).toHaveValue(query);
  if (process.env.E2E_DATABASE_URL) {
    await expect(page.locator('h2').getByRole('link', { name: E2E_BOOK_TITLE })).toBeVisible();
  }
});

test('trending titles are public', async ({ page }) => {
  await page.goto('/trending');
  await expect(page).toHaveURL(/\/trending$/);
  await expect(page.getByRole('heading', { level: 1, name: 'العناوين الرائجة' })).toBeVisible();
});
