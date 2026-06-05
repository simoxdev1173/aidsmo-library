import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadRoots } from "@/lib/uploads";

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

function safeUploadPath(rootPath: string, parts: string[]) {
  const root = path.resolve(rootPath);
  const requested = path.resolve(root, ...parts);

  if (requested !== root && requested.startsWith(`${root}${path.sep}`)) {
    return requested;
  }

  return null;
}

async function readFirstUploadFile(parts: string[]) {
  for (const root of getUploadRoots()) {
    const filePath = safeUploadPath(root, parts);

    if (!filePath) {
      continue;
    }

    try {
      return {
        file: await readFile(filePath),
        filePath,
      };
    } catch {
      // Try the next known upload root. Coolify deployments can keep old
      // files in a previous app path while newer uploads live in the volume.
    }
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: uploadPath } = await params;
  const result = await readFirstUploadFile(uploadPath);

  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = mimeTypes[path.extname(result.filePath).toLowerCase()] ?? "application/octet-stream";

  return new NextResponse(result.file, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
    },
  });
}
