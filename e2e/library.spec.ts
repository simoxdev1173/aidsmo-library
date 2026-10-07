import { expect, test } from '@playwright/test';
import { E2E_BOOK_SLUG, E2E_BOOK_TITLE, E2E_USER_EMAIL, E2E_USER_PASSWORD } from './fixtures';

test.describe('signed-in library', () => {
  test.skip(!process.env.E2E_DATABASE_URL, 'Set E2E_DATABASE_URL to an isolated _e2e database.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/login?callbackUrl=%2Flibrary');
    await page.locator('#login-email').fill(E2E_USER_EMAIL);
    await page.locator('#login-password').fill(E2E_USER_PASSWORD);
    await page.locator('form:has(#login-email) button[type="submit"]').click();
    await expect(page).toHaveURL(/\/library$/);
  });

  test('saves a book and shows it in the personal library', async ({ page }) => {
    await page.goto(`/book/${E2E_BOOK_SLUG}`);
    const saveButton = page.getByRole('button', { name: /حفظ في مكتبتي|محفوظ في مكتبتي/ });
    await expect(saveButton).toHaveAttribute('aria-pressed', 'false');
    await saveButton.click();
    await expect(saveButton).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/library');
    await expect(page.getByRole('link', { name: E2E_BOOK_TITLE }).first()).toBeVisible();

    await page.goto(`/book/${E2E_BOOK_SLUG}`);
    await saveButton.click();
    await expect(saveButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('creates and deletes a shelf', async ({ page }) => {
    await page.getByRole('button', { name: /الرفوف/ }).first().click();
    const shelves = page.locator('section[aria-label="الرفوف"]');
    const shelfName = `E2E shelf ${Date.now()}`;
    await shelves.locator('form input').fill(shelfName);
    await shelves.locator('form button[type="submit"]').click();

    const shelfCard = shelves.locator('article').filter({ hasText: shelfName });
    await expect(shelfCard).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await shelfCard.getByRole('button', { name: 'حذف' }).click();
    await expect(shelfCard).toHaveCount(0);
  });
});
