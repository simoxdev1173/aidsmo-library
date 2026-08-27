import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  downloadDriveFileBySourcePath,
  isGoogleDriveConfigured,
} from "@/lib/google-drive";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
};

const forwardedDriveHeaders = [
  "accept-ranges",
  "content-length",
  "content-range",
  "content-type",
  "etag",
  "last-modified",
] as const;

async function driveResponse(request: Request, publicPath: string) {
  if (!isGoogleDriveConfigured()) {
    return null;
  }

  try {
    const download = await downloadDriveFileBySourcePath(
      publicPath,
      request.headers.get("range"),
    );
    if (!download) {
      return null;
    }

    const headers = new Headers({
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": download.file.mimeType,
      "X-AIDSMO-Storage": "google-drive",
    });

    for (const name of forwardedDriveHeaders) {
      const value = download.response.headers.get(name);
      if (value) {
        headers.set(name, value);
      }
    }

    if (!headers.has("Accept-Ranges")) {
      headers.set("Accept-Ranges", "bytes");
    }

    return new NextResponse(download.response.body, {
      status: download.response.status,
      headers,
    });
  } catch (error) {
    console.error("Google Drive delivery failed; checking the local fallback.", {
      publicPath,
      error,
    });
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: uploadPath } = await params;
  const publicPath = `/uploads/${uploadPath.join("/")}`;
  const fromDrive = await driveResponse(request, publicPath);
  if (fromDrive) {
    return fromDrive;
  }

  const filePath = await resolvePublicUploadFilePath(publicPath);

  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

  return new NextResponse(await readFile(filePath), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      "X-AIDSMO-Storage": "local-fallback",
    },
  });
}
