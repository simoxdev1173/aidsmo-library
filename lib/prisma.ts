import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

// In development, discard the global client after a generated schema change.
const prismaSchemaVersion = "20261009150000_news_announcements";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://invalid:invalid@localhost:5432/invalid";

const adapter = new PrismaPg({ connectionString });

// Prisma's generated delegates can change while `next dev` keeps this module's
// global client alive. Replace an instance generated before a schema update.
const cachedPrisma = globalForPrisma.prisma;
export const prisma =
  (cachedPrisma && globalForPrisma.prismaSchemaVersion === prismaSchemaVersion ? cachedPrisma : null) ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = prismaSchemaVersion;
}
