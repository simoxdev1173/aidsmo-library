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
AUTH_GOOGLE_ID="google-oauth-client-id"
AUTH_GOOGLE_SECRET="google-oauth-client-secret"
RESEND_API_KEY="re_your-api-key"
AUTH_EMAIL_FROM="AIDSMO Digital Library <no-reply@your-domain.com>"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
AUTH_COOKIE_SECURE="true"
UPLOAD_DIR="public/uploads"
```

Use `AUTH_COOKIE_SECURE="true"` when the site is opened with `https://`.
Use `AUTH_COOKIE_SECURE="false"` only when the public Coolify URL is plain `http://`.

`AUTH_SECRET` must stay the same between deployments. If it changes, existing dashboard sessions become invalid and the admin will be sent back to `/dashboard/login`.

## Google Authentication

Create a **Web application** OAuth client in Google Cloud, then configure:

- Authorized JavaScript origin: `https://your-domain.com`
- Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
- Local redirect URI when developing: `http://localhost:3000/api/auth/callback/google`

Copy the client ID and secret into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. The Google button stays disabled when either value is missing, while email/password login continues to work.

## Password Recovery Email

Password reset links expire after 30 minutes and can be used only once. In production, create a Resend API key, verify your sending domain, and configure `RESEND_API_KEY` plus an `AUTH_EMAIL_FROM` address on that domain.

Local development does not require an email provider. After submitting the forgot-password form for an existing local account, the success screen displays a development-only preview link. This link is never rendered when `NODE_ENV=production`.

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
# Google Drive shadow-storage phase

The application can keep its existing files and database paths active while
copying every upload to a personal Google Drive. The Drive fields are shadow
metadata only during this phase; public pages continue reading `filePath`,
`documentFiles`, `coverImagePath`, and `eventImages` from the server.

## Personal Drive authorization

Enable the Google Drive API and create a separate **Desktop app** OAuth client
with the `https://www.googleapis.com/auth/drive.file` scope. Do not reuse the
visitor sign-in `AUTH_GOOGLE_*` client and do not use service-account keys for a
personal Drive.

Add the OAuth client values to `.env`:

```env
GOOGLE_DRIVE_CLIENT_ID="...apps.googleusercontent.com"
GOOGLE_DRIVE_CLIENT_SECRET="..."
```

Then run:

```powershell
npm run drive:authorize
```

Open the printed URL, sign in to the Drive owner account, and approve access.
The command creates `AIDSMO Library/documents`, `covers`, and `events`, then
prints the refresh token and folder IDs to add to `.env` and the production
server's secret settings.

## Database and file migration

Deploy the additive database migration first:

```powershell
npm run prisma:deploy
```

On the application server that contains the current `UPLOAD_DIR`, perform a
read-only inventory:

```powershell
npm run drive:migrate:check
```

Only when the inventory reports no missing local files, copy them and populate
the shadow fields:

```powershell
npm run drive:migrate
```

The migration is resumable. Each Drive object receives the original local path
as an application property, and rerunning the command reuses that object rather
than uploading a duplicate. Existing local files and legacy database paths are
never deleted or overwritten.

New dashboard uploads are dual-written to local storage and Drive. The local
path remains active, while the corresponding Drive link and metadata are saved
in `driveFilePath`, `driveDocumentFiles`, `driveCoverImagePath`, and
`driveEventImages`.
