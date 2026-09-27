import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Each serverless instance keeps its own pool. Without a cap, a few instances exhaust the
// database's max_connections (79 on the current RDS instance). Respect explicit settings
// in DATABASE_URL; otherwise default to a small pool per instance.
function withPoolLimits(url: string | undefined) {
  if (!url) return url;
  let next = url;
  const add = (key: string, value: string) => {
    if (!new RegExp(`[?&]${key}=`).test(next)) next += `${next.includes("?") ? "&" : "?"}${key}=${value}`;
  };
  add("connection_limit", process.env.DATABASE_CONNECTION_LIMIT || "2");
  add("pool_timeout", "20");
  // Hand idle connections back quickly instead of parking them for Prisma's 5-minute default.
  add("max_idle_connection_lifetime", "30");
  return next;
}

const datasourceUrl = withPoolLimits(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Scripts run before .env is loaded; let Prisma resolve the URL itself in that case.
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
