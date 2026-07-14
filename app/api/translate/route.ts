import { NextResponse } from "next/server";
import { translateTexts } from "@/lib/translate";

const MAX_TEXTS = 80;
const MAX_LENGTH = 400;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const texts = body?.texts;
  const target = typeof body?.target === "string" ? body.target : "en";

  if (!Array.isArray(texts) || texts.some((text) => typeof text !== "string")) {
    return NextResponse.json({ error: "texts must be a string array" }, { status: 400 });
  }

  const safeTexts = texts.slice(0, MAX_TEXTS).map((text: string) => text.slice(0, MAX_LENGTH));
  const translations = await translateTexts(safeTexts, target);

  return NextResponse.json({ translations });
}
