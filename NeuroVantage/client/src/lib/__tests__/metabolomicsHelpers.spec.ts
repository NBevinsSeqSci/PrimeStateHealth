import { describe, expect, it } from "vitest";
import { computeCompleteness } from "@/lib/metabolomics/completeness";
import { resolveAnalyteSlug } from "@/lib/metabolomics/resolveAnalyte";
import type { AnalyteDef } from "@/lib/analytes/types";

describe("metabolomics helpers", () => {
  it("computes completeness from required analytes", () => {
    const required = ["arginine", "citrulline", "ornithine"];
    const result = computeCompleteness(required, (slug) => slug === "citrulline");
    expect(result.presentCount).toBe(1);
    expect(result.missing).toEqual(["arginine", "ornithine"]);
  });

  it("resolves analyte aliases to canonical slugs", () => {
    const registry: AnalyteDef[] = [
      { id: "arginine", display: "arginine", normalized: "arginine", aliases: ["L-arginine"] },
    ];
    expect(resolveAnalyteSlug("L-arginine", registry)).toBe("arginine");
  });
});
