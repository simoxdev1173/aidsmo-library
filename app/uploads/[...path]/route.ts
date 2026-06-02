import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadRoot } from "@/lib/uploads";

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

function safeUploadPath(parts: string[]) {
  const root = path.resolve(getUploadRoot());
  const requested = path.resolve(root, ...parts);

  if (requested !== root && requested.startsWith(`${root}${path.sep}`)) {
    return requested;
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: uploadPath } = await params;
  const filePath = safeUploadPath(uploadPath);

  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
