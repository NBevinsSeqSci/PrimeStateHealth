import { describe, expect, it } from "vitest";
import { normalizePmid, pubmedUrl } from "@/lib/pubmed";

describe("pubmed helpers", () => {
  it("normalizes PMID inputs", () => {
    expect(normalizePmid("PMID: 34670021")).toBe("34670021");
    expect(normalizePmid("  31204511 ")).toBe("31204511");
    expect(normalizePmid("PMID 123")).toBe("123");
    expect(normalizePmid("doi:10.0/abc")).toBeNull();
  });

  it("builds PubMed URLs", () => {
    expect(pubmedUrl("34670021")).toBe("https://pubmed.ncbi.nlm.nih.gov/34670021/");
  });
});
