import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://invalid:invalid@localhost:5432/invalid";

const adapter = new PrismaPg({ connectionString });

// Next.js keeps globals across development reloads. A client created before
// a new model was generated can therefore be missing that model's delegate.
const cachedClient = globalForPrisma.prisma;
const cachedModels = cachedClient as unknown as Record<string, { findMany?: unknown }> | undefined;
const cacheIsCurrent = cachedModels && Object.values(Prisma.ModelName).every((model) => {
  const delegate = model[0].toLowerCase() + model.slice(1);
  return typeof cachedModels[delegate]?.findMany === "function";
});

if (cachedClient && !cacheIsCurrent) {
  void cachedClient.$disconnect().catch((error) => {
    console.error("Could not disconnect the outdated Prisma client", error);
  });
}

export const prisma =
  (cacheIsCurrent ? cachedClient : undefined) ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
