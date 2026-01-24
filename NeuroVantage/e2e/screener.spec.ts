import { test, expect } from "@playwright/test";

test("screener intro leads to details form", async ({ page }) => {
  await page.goto("/screener");
  await page.getByRole("button", { name: "Start Assessment" }).click();
  await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
});

test("example metabolomics report exposes download link", async ({ page }) => {
  await page.goto("/blood-testing/metabolomics/example");
  const downloadLink = page.getByRole("link", { name: "Download analytes.json" });
  await expect(downloadLink).toBeVisible();
  await expect(downloadLink).toHaveAttribute("download", "analytes.json");
});
