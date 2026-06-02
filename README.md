# AIDSMO Digital Library

Next.js digital library with an admin dashboard, PostgreSQL/Prisma, and local file uploads.

## Local Development

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Required Environment Variables

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET="generate-a-long-random-string"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
AUTH_COOKIE_SECURE="true"
UPLOAD_DIR="public/uploads"
```

Use `AUTH_COOKIE_SECURE="true"` when the site is opened with `https://`.
Use `AUTH_COOKIE_SECURE="false"` only when the public Coolify URL is plain `http://`.

`AUTH_SECRET` must stay the same between deployments. If it changes, existing dashboard sessions become invalid and the admin will be sent back to `/dashboard/login`.

## Coolify Deployment Notes

1. Set the app environment variables above in Coolify.
2. Use the public URL you actually open in the browser for `NEXT_PUBLIC_APP_URL`.
3. If Coolify serves the app over HTTPS, keep `AUTH_COOKIE_SECURE=true`.
4. If you are testing over HTTP, set `AUTH_COOKIE_SECURE=false`.
5. Run production migrations after deployment:

```bash
npm run prisma:deploy
npm run prisma:seed
```

## Upload Persistence

Dashboard uploads are saved under:

```bash
/app/public/uploads
```

The database stores public paths like:

```bash
/uploads/covers/file.png
/uploads/documents/file.pdf
```

In Coolify, add a persistent volume for the application:

```bash
/app/public/uploads
```

Without this volume, uploaded images and PDFs can disappear after a rebuild/redeploy because container filesystems are ephemeral.

Local uploaded files are ignored by Git, so files uploaded on your local machine will not appear on the server automatically. Upload them again through the production dashboard, or copy them to the Coolify volume manually.
