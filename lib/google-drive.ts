import { Readable } from "node:stream";
import { google } from "googleapis";

export type DriveFolder = "covers" | "documents" | "events";

export type DriveStoredFile = {
  fileId: string;
  path: string;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number | null;
  md5Checksum: string | null;
};

type UploadToDriveInput = {
  bytes: Buffer;
  folder: DriveFolder;
  mimeType: string;
  name: string;
  sourcePath: string;
};

const folderEnvironmentVariables: Record<DriveFolder, string> = {
  covers: "GOOGLE_DRIVE_COVERS_FOLDER_ID",
  documents: "GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID",
  events: "GOOGLE_DRIVE_EVENTS_FOLDER_ID",
};

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Google Drive is not configured: ${name} is missing.`);
  }
  return value;
}

function driveClient() {
  const auth = new google.auth.OAuth2(
    requiredEnvironmentVariable("GOOGLE_DRIVE_CLIENT_ID"),
    requiredEnvironmentVariable("GOOGLE_DRIVE_CLIENT_SECRET"),
  );

  auth.setCredentials({
    refresh_token: requiredEnvironmentVariable("GOOGLE_DRIVE_REFRESH_TOKEN"),
  });

  return google.drive({ version: "v3", auth });
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function storedFileFromMetadata(
  metadata: {
    id?: string | null;
    name?: string | null;
    mimeType?: string | null;
    size?: string | null;
    md5Checksum?: string | null;
    webViewLink?: string | null;
  },
  sourcePath: string,
): DriveStoredFile {
  if (!metadata.id) {
    throw new Error(`Google Drive did not return a file ID for ${sourcePath}.`);
  }

  return {
    fileId: metadata.id,
    path: metadata.webViewLink ?? `https://drive.google.com/file/d/${metadata.id}/view`,
    name: metadata.name ?? sourcePath.split("/").pop() ?? metadata.id,
    mimeType: metadata.mimeType ?? "application/octet-stream",
    sourcePath,
    size: metadata.size ? Number(metadata.size) : null,
    md5Checksum: metadata.md5Checksum ?? null,
  };
}

async function findExistingDriveFile(sourcePath: string) {
  const drive = driveClient();
  const response = await drive.files.list({
    q: `trashed = false and appProperties has { key='aidsmoSourcePath' and value='${escapeDriveQueryValue(sourcePath)}' }`,
    fields: "files(id,name,mimeType,size,md5Checksum,webViewLink)",
    pageSize: 1,
  });

  const file = response.data.files?.[0];
  return file ? storedFileFromMetadata(file, sourcePath) : null;
}

export function isGoogleDriveConfigured() {
  return [
    "GOOGLE_DRIVE_CLIENT_ID",
    "GOOGLE_DRIVE_CLIENT_SECRET",
    "GOOGLE_DRIVE_REFRESH_TOKEN",
    ...Object.values(folderEnvironmentVariables),
  ].every((name) => Boolean(process.env[name]?.trim()));
}

export async function uploadBytesToDrive(input: UploadToDriveInput) {
  const existing = await findExistingDriveFile(input.sourcePath);
  if (existing) {
    return existing;
  }

  const drive = driveClient();
  const folderId = requiredEnvironmentVariable(folderEnvironmentVariables[input.folder]);
  const response = await drive.files.create({
    requestBody: {
      name: input.name,
      parents: [folderId],
      appProperties: {
        aidsmoSourcePath: input.sourcePath,
        aidsmoFolder: input.folder,
      },
    },
    media: {
      mimeType: input.mimeType,
      body: Readable.from(input.bytes),
    },
    fields: "id,name,mimeType,size,md5Checksum,webViewLink",
  });

  return storedFileFromMetadata(response.data, input.sourcePath);
}
