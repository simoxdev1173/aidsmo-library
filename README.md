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

Without this volume, the local backup/fallback copies can disappear after a
rebuild or redeploy because container filesystems are ephemeral. Files already
mirrored to Google Drive remain available through Drive-first delivery.

Local uploaded files are ignored by Git, so files uploaded on your local machine will not appear on the server automatically. Upload them again through the production dashboard, or copy them to the Coolify volume manually.
# Google Drive primary delivery with local fallback

The application keeps its existing `/uploads/...` URLs stable while serving
matching files from a personal Google Drive through the application. PDF range
requests are forwarded to Drive so the embedded reader can seek without
downloading the entire document. Local files remain a fallback for paths that
have not been migrated yet or during a temporary Drive failure.

Responses include `X-AIDSMO-Storage: google-drive` when Drive served the file,
or `X-AIDSMO-Storage: local-fallback` when the server volume was used.

## Personal Drive authorization

Enable the Google Drive API and create a separate **Desktop app** OAuth client
with the `https://www.googleapis.com/auth/drive.file` scope. Do not reuse the
visitor sign-in `AUTH_GOOGLE_*` client and do not use service-account keys for a
personal Drive.

For a personal Gmail account, configure the Google Auth Platform audience as
External and publish it **In production** before generating the final refresh
token. An External app left in Testing receives a refresh token that expires in
seven days. A personal-use app can remain unverified, although Google may show
an unverified-app warning during authorization. For a Google Workspace project,
use an Internal audience when the Drive owner belongs to that organization.

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

### Replacing the Drive owner account

If the previous Drive account is unavailable, create the Desktop OAuth client
under a Google Cloud project you control and replace **all seven**
`GOOGLE_DRIVE_*` values. Run `drive:authorize` with the new client ID and secret
to generate the other five values; do not keep folder IDs or the refresh token
from the previous account.

After replacing the values, run the inventory and migration commands below on
the server that still has the local upload volume. Stored Drive links from the
previous account are treated as stale: files visible in the newly authorized
Drive are reused, and the remaining files are uploaded again from local
storage. The database shadow fields are updated only after an entry's files
have been copied successfully.

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

The inventory fetches the app-owned Drive file list in bulk and performs the
path comparison locally, so the default check has no intentional delay. Pacing
options remain available for troubleshooting but are not normally needed for
verification.

Only when the inventory reports no missing local files, copy them and populate
the shadow fields:

```powershell
npm run drive:migrate
```

For a personal Drive account, prefer the one-run throttled migration. It still
processes every entry, but spaces Drive operations by one second and pauses for
five seconds after each group of 25:

```powershell
npm run drive:migrate:throttled
```

To intentionally stop after 25 newly uploaded files, use `--limit`. Rerun the
same command to resume; objects already uploaded are found by their source-path
marker and are not duplicated:

```powershell
npm run drive:migrate -- --limit=25 --delay-ms=1000
```

Available pacing options are `--delay-ms`, `--batch-size`, and
`--batch-delay-ms`. All values are positive integers in milliseconds, except
`--batch-size`, which is a number of file operations.

The migration is resumable. Each Drive object receives the original local path
as an application property, and rerunning the command reuses that object rather
than uploading a duplicate. Existing local files and legacy database paths are
never deleted or overwritten. Drive-only metadata updates also preserve each
library entry's existing `updatedAt` value, so migration maintenance does not
appear as an editorial update in the dashboard.

New dashboard uploads are dual-written to local storage and Drive. The stable
local-style path remains the public URL, while its content is delivered from
Drive first. The corresponding Drive link and metadata are saved in
`driveFilePath`, `driveDocumentFiles`, `driveCoverImagePath`, and
`driveEventImages`.

## Arabic document summaries and Q&A

The document-analysis batch creates one `DocumentAnalysis` row for every PDF
attached to a catalog entry. Each row keeps:

- an Arabic summary;
- exactly four grounded question/answer pairs with supporting page numbers;
- the extracted sampled-page text for later chatbot indexing;
- page count, sampled-page numbers, extraction method, model, checksum, status,
  and a resumable error message.

The sampling rule is deterministic: pages 1–20, every 100th page, and the last
20 pages, with duplicates removed. PDF text is used when it is usable. For a
scan with too little embedded text, Tesseract.js renders and OCRs only the
sampled pages with the Arabic and English language models. The first OCR run
downloads those open-source language files; persist `.cache/tesseract` in
production or set `TESSERACT_CACHE_PATH` to a persistent directory.

Deploy the additive database migration first:

```powershell
npm run prisma:deploy
```

Inventory the work without downloading a PDF, calling an LLM, or changing a
row:

```powershell
npm run documents:analyze
```

Start with a small, resumable Gemini free-tier batch:

```powershell
npm run documents:analyze -- --apply --provider=gemini --limit=10 --delay-ms=2000
```

Set `GEMINI_API_KEY` first. `gemini-3.1-flash-lite` is the configured default,
and `GEMINI_MODEL` can change it without a code edit. Gemini's free tier has
rate/daily limits and free-tier content may be used by Google to improve its
products, so it should not be treated as a private local processor.

For a fully local, zero-API-cost path, install Ollama, pull an Arabic-capable
model once, and run:

```powershell
ollama pull qwen3:8b
npm run documents:analyze -- --apply --provider=ollama --model=qwen3:8b --limit=10
```

Ollama generation and Tesseract OCR then stay on the machine. Model downloads
still require disk space and the initial network transfer; local compute is the
only ongoing cost. Use `--ocr=off` when the corpus is known to contain text
layers, or `--ocr=always` to OCR every sampled page that lacks useful embedded
text.

Completed PDFs are skipped on later runs, while failed ones are retried. Useful
targeting and editorial options are:

```powershell
npm run documents:analyze -- --apply --entry-id=ENTRY_ID --limit=1
npm run documents:analyze -- --apply --source-path=/uploads/documents/FILE.pdf
npm run documents:analyze -- --apply --force --limit=10
npm run documents:analyze -- --apply --fill-descriptions --limit=10
```

`--fill-descriptions` only fills a blank `LibraryEntry.description` from the
primary attached PDF; it never replaces an editor's description. Full sampled
text remains in `DocumentAnalysis.extractedText`, ready for a later chunking and
embedding step for the chatbot.

Completed analyses are also exposed on the matching public document page. The
reader's AI panel shows the four stored questions; selecting one opens the
global chat interface and displays the saved answer immediately with links to
its supporting PDF pages. This stored-answer path does not make another Gemini
request. Free-form questions continue through the existing `/api/chatbot`
LightRAG integration.
