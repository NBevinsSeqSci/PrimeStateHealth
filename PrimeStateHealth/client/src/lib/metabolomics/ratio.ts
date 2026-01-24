import { safeDivide } from "@/lib/metrics";

export type ScaledRatioMetrics = {
  rawRatio: number;
  scaledRatio: number;
  displayValue: number;
};

export const computeScaledRatio = (numerator?: number, denominator?: number, scale = 1): ScaledRatioMetrics | undefined => {
  const rawRatio = safeDivide(numerator, denominator);
  if (rawRatio == null) return undefined;
  const scaledRatio = rawRatio * scale;
  if (!Number.isFinite(scaledRatio)) return undefined;
  return {
    rawRatio,
    scaledRatio,
    displayValue: Math.round(scaledRatio),
  };
};

export const computeKTRatio = (kynurenine?: number, tryptophan?: number) =>
  computeScaledRatio(kynurenine, tryptophan, 1000);
