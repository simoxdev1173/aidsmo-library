# Browser tests

`npm run test:e2e:public` runs read-only tests against the local site. Playwright starts the site if it is not already running.

The signed-in tests require a separate PostgreSQL database. Set `E2E_DATABASE_URL` to a database whose name ends in `_e2e`, apply migrations to that database, and run `npm run test:e2e`. Playwright creates a test reader and book in that database and clears the reader's shelves and saved books before each run. Stop any existing `next dev` process first so the Playwright-managed server can use the test database.

PowerShell example:

```powershell
$env:E2E_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/aidsmo_library_e2e?schema=public'
$env:DATABASE_URL = $env:E2E_DATABASE_URL
npx.cmd prisma migrate deploy
npm.cmd run test:e2e
```

CI creates its own PostgreSQL service and runs all five tests after lint, typecheck, and build.
