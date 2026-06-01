import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const COOKIE_NAME = "aidsmo_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "development-only-auth-secret";
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

function createToken(payload: SessionPayload) {
  const encoded = encodePayload(payload);
  return `${encoded}.${sign(encoded)}`;
}

function verifyToken(token?: string) {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payload = decodePayload(encoded);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return null;
  }

  return admin;
}

export async function createAdminSession(admin: { id: string; email: string }) {
  const cookieStore = await cookies();
  const token = createToken({
    sub: admin.id,
    email: admin.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const payload = verifyToken(cookieStore.get(COOKIE_NAME)?.value);

  if (!payload) return null;

  return prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/dashboard/login");
  }

  return admin;
}
