import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? (databaseUrl ? new PrismaClient() : null);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
