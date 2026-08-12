import "dotenv/config";
import { createServer } from "node:http";
import { google } from "googleapis";

const callbackUrl = "http://127.0.0.1:53682";
const driveFileScope = "https://www.googleapis.com/auth/drive.file";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is missing from .env.`);
  return value;
}

async function ensureFolder(
  drive: ReturnType<typeof google.drive>,
  name: string,
  marker: string,
  parentId?: string,
) {
  const parentQuery = parentId ? ` and '${parentId.replace(/'/g, "\\'")}' in parents` : "";
  const response = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and trashed = false and appProperties has { key='aidsmoFolderKey' and value='${marker}' }${parentQuery}`,
    fields: "files(id,name)",
    pageSize: 1,
  });
  const existing = response.data.files?.[0];
  if (existing?.id) return existing.id;

  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : undefined,
      appProperties: { aidsmoFolderKey: marker },
    },
    fields: "id",
  });
  if (!created.data.id) throw new Error(`Drive did not return an ID for ${name}.`);
  return created.data.id;
}

async function main() {
  const clientId = required("GOOGLE_DRIVE_CLIENT_ID");
  const clientSecret = required("GOOGLE_DRIVE_CLIENT_SECRET");
  const auth = new google.auth.OAuth2(clientId, clientSecret, callbackUrl);
  const authorizationUrl = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [driveFileScope],
  });

  console.log("\nOpen this URL in your browser and approve access:\n");
  console.log(authorizationUrl);
  console.log("\nWaiting for Google to redirect back to this computer...\n");

  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", callbackUrl);
      if (url.pathname !== "/") {
        response.writeHead(404).end("Not found");
        return;
      }

      const error = url.searchParams.get("error");
      const authorizationCode = url.searchParams.get("code");
      if (error || !authorizationCode) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        response.end(`Google authorization failed: ${error ?? "missing code"}`);
        server.close();
        reject(new Error(error ?? "Google did not return an authorization code."));
        return;
      }

      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Google Drive authorization succeeded. You can close this tab.");
      server.close();
      resolve(authorizationCode);
    });

    server.on("error", reject);
    server.listen(53682, "127.0.0.1");
  });

  const { tokens } = await auth.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error("Google did not return a refresh token. Revoke the old grant and run this command again.");
  }

  auth.setCredentials(tokens);
  const drive = google.drive({ version: "v3", auth });
  const rootId = await ensureFolder(drive, "AIDSMO Library", "root");
  const documentsId = await ensureFolder(drive, "documents", "documents", rootId);
  const coversId = await ensureFolder(drive, "covers", "covers", rootId);
  const eventsId = await ensureFolder(drive, "events", "events", rootId);

  console.log("\nAdd these values to .env and to your server's secret settings:\n");
  console.log(`GOOGLE_DRIVE_REFRESH_TOKEN="${tokens.refresh_token}"`);
  console.log(`GOOGLE_DRIVE_ROOT_FOLDER_ID="${rootId}"`);
  console.log(`GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID="${documentsId}"`);
  console.log(`GOOGLE_DRIVE_COVERS_FOLDER_ID="${coversId}"`);
  console.log(`GOOGLE_DRIVE_EVENTS_FOLDER_ID="${eventsId}"`);
  console.log("\nDo not commit or share the refresh token.\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
