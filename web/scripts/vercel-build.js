const { spawnSync } = require("node:child_process");

const hasDatabase =
  !!process.env.DATABASE_URL && !!process.env.DIRECT_URL;

if (hasDatabase) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.warn(
    "Skipping prisma migrate deploy: DATABASE_URL or DIRECT_URL is missing."
  );
}

run("npx", ["next", "build"]);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
