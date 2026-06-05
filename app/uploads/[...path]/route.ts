import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: uploadPath } = await params;
  const filePath = await resolvePublicUploadFilePath(`/uploads/${uploadPath.join("/")}`);

  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

  return new NextResponse(await readFile(filePath), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
    },
  });
}
