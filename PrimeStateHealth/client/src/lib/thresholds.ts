export type SeverityBand =
  | "none"
  | "mild"
  | "moderate"
  | "moderately severe"
  | "severe";

type BandSpec = { max: number; label: SeverityBand };

export const PHQ9_BANDS: BandSpec[] = [
  { max: 4, label: "none" },
  { max: 9, label: "mild" },
  { max: 14, label: "moderate" },
  { max: 19, label: "moderately severe" },
  { max: 27, label: "severe" },
];

export const GAD7_BANDS: BandSpec[] = [
  { max: 4, label: "none" },
  { max: 9, label: "mild" },
  { max: 14, label: "moderate" },
  { max: 21, label: "severe" },
];

// PHQ-2 style quick screen (0-6). Keep bands conservative for a short screener.
export const PHQ2_BANDS: BandSpec[] = [
  { max: 1, label: "none" },
  { max: 2, label: "mild" },
  { max: 4, label: "moderate" },
  { max: 5, label: "moderately severe" },
  { max: 6, label: "severe" },
];

export const SCREENER_LIMITS = {
  moodMax: 6,
  attentionMax: 8,
};

export const SCREENER_THRESHOLDS = {
  reactionSlowMs: 400,
  executiveLowerBound: 1000,
  depressionFlag: 3,
  attentionFlag: 4,
};

export const FULL_REPORT_THRESHOLDS = {
  reactionFastMs: 330,
  reactionTypicalMaxMs: 420,
  executiveExpectedMin: 150,
  inhibitionExpectedMin: 70,
  inhibitionBorderlineMin: 50,
  digitSpanExpectedMin: 6,
  visualMemoryExpectedMin: 6,
  listLearningExpectedMin: 20,
  listLearningBorderlineMin: 15,
};

export function resolveSeverity(score: number | null, bands: BandSpec[]): SeverityBand {
  if (score == null || Number.isNaN(score)) return "none";
  for (const band of bands) {
    if (score <= band.max) return band.label;
  }
  return bands[bands.length - 1]?.label ?? "none";
}
