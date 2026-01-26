// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("node:child_process");

function sh(command, opts = {}) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit", ...opts });
}

function main() {
  const cwd = process.cwd();

  sh("node scripts/ensure-db.js", { cwd });
  sh("npx next build", { cwd });
}

main();
