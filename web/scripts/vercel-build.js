// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require("node:child_process");

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

const hasDatabase = !!process.env.DATABASE_URL;

if (hasDatabase) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.warn("Skipping prisma migrate deploy: DATABASE_URL is missing.");
}

run("npx", ["next", "build"]);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
