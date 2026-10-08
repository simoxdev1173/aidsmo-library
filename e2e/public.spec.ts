import { expect, test } from '@playwright/test';
import { E2E_BOOK_TITLE } from './fixtures';

test('the header becomes compact on scroll and keeps navigation available', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header').first();
  await expect(header).toBeVisible();
  expect((await header.boundingBox())?.height).toBeGreaterThan(100);

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(async () => Math.round((await header.boundingBox())?.y ?? -1)).toBe(0);
  await expect(header).toHaveAttribute('data-compact', 'true');
  await expect.poll(async () => (await header.boundingBox())?.height ?? 0).toBeLessThan(66);
  await expect.poll(() => page.evaluate(() => Math.round(document.querySelector('header nav')!.getBoundingClientRect().top))).toBe(0);
  const headerBounds = await header.boundingBox();
  expect(headerBounds?.x).toBe(0);
  expect(headerBounds?.width).toBe(page.viewportSize()!.width);
  expect(await header.evaluate((element) => getComputedStyle(element).borderTopLeftRadius)).toBe('0px');
  expect((await header.getByRole('button', { name: 'بحث', exact: true }).first().boundingBox())?.height).toBe(48);
  await expect(header.getByRole('button', { name: 'بحث', exact: true }).first()).toBeVisible();

  await header.getByRole('link', { name: 'الصناعة', exact: true }).click();
  await expect(page).toHaveURL(/\/industry$/);
});

test('the logo returns to the top after visiting another page', async ({ page }) => {
  await page.goto('/about-us');
  const header = page.locator('header').first();
  await expect(page).toHaveURL(/\/about-us$/);
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  await expect(header.getByRole('link', { name: 'الرئيسية', exact: true })).toHaveCount(0);
  await header.getByRole('link', { name: 'الذهاب إلى الرئيسية' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.waitForTimeout(750);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('the logo returns to the top on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about-us');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  const compactHeader = page.locator('header').first();
  await expect(compactHeader).toHaveAttribute('data-compact', 'true');
  await expect.poll(async () => Math.round((await compactHeader.boundingBox())?.x ?? -1)).toBe(0);
  await expect.poll(async () => Math.round((await compactHeader.boundingBox())?.y ?? -1)).toBe(0);
  await expect(compactHeader.locator('nav [role="group"]')).toBeInViewport();
  const account = compactHeader.getByRole('button', { name: 'قائمة الحساب' });
  await expect(account).toBeInViewport();
  await account.click();
  await expect(compactHeader.getByRole('menuitem', { name: 'إنشاء حساب' })).toBeVisible();
  const accountMenuBounds = await compactHeader.locator('#compact-account-menu').boundingBox();
  expect(accountMenuBounds?.x).toBeGreaterThanOrEqual(16);
  expect(accountMenuBounds!.x + accountMenuBounds!.width).toBeLessThanOrEqual(390 - 16);
  await page.keyboard.press('Escape');

  await expect(page.locator('#mobile-site-menu a[href="/"]')).toHaveCount(0);
  await page.locator('header').first().getByRole('link', { name: 'الذهاب إلى الرئيسية' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  await page.locator('header').first().getByRole('link', { name: 'الذهاب إلى الرئيسية' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('the larger compact controls fit on a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/about-us');
  await page.evaluate(() => window.scrollTo(0, 700));
  const header = page.locator('header').first();
  await expect(header).toHaveAttribute('data-compact', 'true');
  const logo = await header.locator('[data-nav-zone="logo"]').boundingBox();
  const actions = await header.locator('[data-nav-zone="actions"]').boundingBox();
  expect(actions!.x).toBeGreaterThanOrEqual(0);
  expect(actions!.x + actions!.width).toBeLessThan(logo!.x);
  expect(logo!.x + logo!.width).toBeLessThanOrEqual(320);
});

test('compact search opens, focuses, and submits a query', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 700));
  const header = page.locator('header').first();
  await expect(header).toHaveAttribute('data-compact', 'true');
  const searchButton = header.getByRole('button', { name: 'بحث', exact: true }).first();
  await searchButton.click();
  const search = header.locator('#compact-nav-search');
  await expect(search).toBeVisible();
  await expect(search.getByRole('searchbox')).toBeFocused();
  await search.getByRole('searchbox').press('Escape');
  await expect(searchButton).toBeFocused();
  await expect(search).toHaveAttribute('aria-hidden', 'true');
  await searchButton.click();
  await search.getByRole('searchbox').fill('industry');
  await search.getByRole('searchbox').press('Enter');
  await expect(page).toHaveURL(/\/search\?q=industry/);
});

test('compact navigation has the language switcher and an account dropdown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');
  const header = page.locator('header').first();
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(header).toHaveAttribute('data-compact', 'true');
  await expect(header.locator('nav').getByRole('link', { name: 'من نحن', exact: true })).toHaveCount(0);
  const logoBounds = await header.locator('[data-nav-zone="logo"]').boundingBox();
  const linksBounds = await header.locator('[data-nav-zone="links"]').boundingBox();
  const actionsBounds = await header.locator('[data-nav-zone="actions"]').boundingBox();
  expect(logoBounds).not.toBeNull();
  expect(linksBounds).not.toBeNull();
  expect(actionsBounds).not.toBeNull();
  expect(Math.abs(linksBounds!.x + linksBounds!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(2);
  expect(logoBounds!.x).toBeGreaterThan(linksBounds!.x + linksBounds!.width);
  expect(actionsBounds!.x + actionsBounds!.width).toBeLessThan(linksBounds!.x);

  const languages = header.locator('nav [role="group"]');
  await expect(languages).toBeVisible();
  const languageBounds = await languages.boundingBox();
  const searchBounds = await header.getByRole('button', { name: 'بحث', exact: true }).first().boundingBox();
  const profileButton = header.getByRole('button', { name: 'قائمة الحساب' });
  const profileBounds = await profileButton.boundingBox();
  expect(searchBounds!.x - (profileBounds!.x + profileBounds!.width)).toBeGreaterThanOrEqual(10);
  expect(languageBounds!.x - (searchBounds!.x + searchBounds!.width)).toBeGreaterThanOrEqual(10);
  await expect(profileButton.locator('svg')).toHaveCount(2);
  await languages.getByRole('button', { name: 'English' }).click();
  await expect(languages.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');

  const account = header.getByRole('button', { name: 'Account menu' });
  await account.click();
  await expect(account).toHaveAttribute('aria-expanded', 'true');
  await expect(account.locator('svg').last()).toHaveClass(/rotate-180/);
  await expect(header.getByRole('menuitem', { name: 'Create account' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(account).toBeFocused();
  await expect(account).toHaveAttribute('aria-expanded', 'false');
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
