import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 120_000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterations, salt, hash] = storedHash.split(":");

  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) {
    return false;
  }

  const computed = pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST);
  const expected = Buffer.from(hash, "hex");

  return expected.length === computed.length && timingSafeEqual(expected, computed);
}
