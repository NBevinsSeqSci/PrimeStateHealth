import type { MetaboliteResult, PathwayBaseline } from "@/types/pathways";

export const safeDivide = (numerator?: number, denominator?: number) => {
  if (numerator == null || denominator == null) return null;
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  return numerator / denominator;
};

export const baselineFromRefRange = (refRange?: MetaboliteResult["refRange"]) => {
  if (!refRange) return null;
  if (refRange.low != null && refRange.high != null) {
    return (refRange.low + refRange.high) / 2;
  }
  return null;
};

export const baselineFromRefRangeWithPreference = (
  refRange?: MetaboliteResult["refRange"],
  baseline: PathwayBaseline = "referenceMid",
) => {
  if (!refRange) return null;
  if (baseline === "referenceLower") return refRange.low ?? null;
  if (baseline === "referenceUpper") return refRange.high ?? null;
  return baselineFromRefRange(refRange);
};

export const foldChange = (value?: number, baseline?: number) => {
  if (value == null || baseline == null) return null;
  if (!Number.isFinite(value) || !Number.isFinite(baseline)) return null;
  if (baseline === 0) return null;
  return value / baseline;
};

export const zFromValueAndRef = (value?: number, refMean?: number, refSd?: number) => {
  if (value == null || refMean == null || refSd == null) return null;
  if (!Number.isFinite(value) || !Number.isFinite(refMean) || !Number.isFinite(refSd)) return null;
  if (refSd === 0) return null;
  return (value - refMean) / refSd;
};

export const approximateSdFromRange = (refRange?: MetaboliteResult["refRange"]) => {
  if (!refRange || refRange.low == null || refRange.high == null) return null;
  const span = refRange.high - refRange.low;
  if (!Number.isFinite(span) || span === 0) return null;
  return span / 2;
};
