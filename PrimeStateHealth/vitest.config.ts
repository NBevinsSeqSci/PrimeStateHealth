import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    include: [
      "server/__tests__/**/*.test.ts",
      "client/src/**/__tests__/**/*.{test,spec}.ts",
      "client/src/**/__tests__/**/*.{test,spec}.tsx",
    ],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "client", "src"),
      "@shared": path.resolve(rootDir, "shared"),
      "@assets": path.resolve(rootDir, "attached_assets"),
    },
  },
});
