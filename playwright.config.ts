import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const testDatabaseUrl = process.env.E2E_DATABASE_URL;

if (testDatabaseUrl && process.env.PLAYWRIGHT_BASE_URL) {
  throw new Error('Authenticated browser tests must use the Playwright-managed server and isolated database.');
}

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  globalSetup: './e2e/global-setup.ts',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    channel: process.platform === 'win32' ? 'chrome' : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run ${process.env.CI ? 'start' : 'dev'} -- --hostname localhost --port 3000`,
    url: baseURL,
    reuseExistingServer: !process.env.CI && !testDatabaseUrl,
    timeout: 120_000,
    env: testDatabaseUrl ? { DATABASE_URL: testDatabaseUrl, AUTH_COOKIE_SECURE: 'false' } : undefined,
  },
});
