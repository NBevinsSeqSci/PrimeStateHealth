/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function sh(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

function normalizeDatabaseEnv() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  const directUrl =
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    databaseUrl;

  if (databaseUrl && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  if (directUrl && !process.env.DIRECT_URL) {
    process.env.DIRECT_URL = directUrl;
  }
}

function mustGetEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `[ensure-db] Missing required env var: ${name}. Set it in Vercel (Production + Preview) and locally in .env (do NOT commit secrets).`
    );
  }
  return value.trim();
}

function looksLikePostgresUrl(url) {
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

function isPreviewEnv() {
  return process.env.VERCEL_ENV === "preview";
}

function hasMigrations(cwd) {
  const migrationsDir = path.join(cwd, "prisma", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    return false;
  }

  const entries = fs.readdirSync(migrationsDir, { withFileTypes: true });
  return entries.some((entry) => entry.isDirectory());
}

function main() {
  const cwd = process.cwd();
  normalizeDatabaseEnv();

  const dbUrl = mustGetEnv("DATABASE_URL");
  if (!looksLikePostgresUrl(dbUrl)) {
    throw new Error(
      "[ensure-db] DATABASE_URL must start with postgres:// or postgresql://."
    );
  }

  if (!hasMigrations(cwd)) {
    if (isPreviewEnv()) {
      console.warn(
        "[ensure-db] No Prisma migrations found. Falling back to prisma db push for Preview."
      );
      sh("npx prisma generate", { cwd });
      sh("npx prisma db push", { cwd });
      return;
    }

    throw new Error(
      "[ensure-db] No Prisma migrations found. Create an initial migration (e.g. `npx prisma migrate dev --name init`) and commit `prisma/migrations`."
    );
  }

  sh("npx prisma generate", { cwd });
  sh("npx prisma migrate deploy", { cwd });
  console.log("[ensure-db] prisma migrate deploy: OK");
}

Promise.resolve()
  .then(main)
  .catch((error) => {
    console.error("\n[ensure-db] FAILED:");
    console.error(error?.stack || error?.message || error);
    process.exit(1);
  });
