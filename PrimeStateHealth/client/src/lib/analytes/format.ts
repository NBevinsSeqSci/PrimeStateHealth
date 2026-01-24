import type { MetaboliteResult } from "@/lib/pathways/types";

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return undefined;
  const abs = Math.abs(value);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

export const formatAnalyteValue = (result?: MetaboliteResult) => {
  if (!result || result.value == null) {
    return { value: undefined, unit: result?.unit };
  }

  if (typeof result.value === "number") {
    return { value: formatNumber(result.value), unit: result.unit };
  }

  return { value: String(result.value), unit: result.unit };
};

export const hasMeasuredValue = (result?: MetaboliteResult) => {
  if (!result) return false;
  const value = result.value;
  if (value == null) return false;
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
};

export const formatZScore = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  const normalized = Object.is(value, -0) ? 0 : value;
  return normalized.toFixed(1);
};

export const formatReferenceRange = (range?: MetaboliteResult["refRange"]) => {
  if (!range) return undefined;
  if (range.text) return range.text;
  const low = range.low != null ? formatNumber(range.low) : undefined;
  const high = range.high != null ? formatNumber(range.high) : undefined;
  if (low && high) return `${low} – ${high}`;
  if (low) return `≥ ${low}`;
  if (high) return `≤ ${high}`;
  return undefined;
};
