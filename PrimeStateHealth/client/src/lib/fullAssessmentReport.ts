import { FULL_REPORT_THRESHOLDS, GAD7_BANDS, PHQ9_BANDS, resolveSeverity } from "@/lib/thresholds";

export const getValuesByPrefix = (data: Record<string, any> = {}, prefix: string) => {
  return Object.entries(data)
    .filter(([key]) => key.startsWith(prefix))
    .map(([, value]) => {
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : null;
    })
    .filter((val): val is number => val !== null);
};

export const getPhqSeverityLabel = (score: number | null) => {
  if (score === null) return "Not captured";
  const severity = resolveSeverity(score, PHQ9_BANDS);
  if (severity === "none") return "Minimal";
  if (severity === "mild") return "Mild";
  if (severity === "moderate") return "Moderate";
  if (severity === "moderately severe") return "Moderately severe";
  return "Severe";
};

export const getGadSeverityLabel = (score: number | null) => {
  if (score === null) return "Not captured";
  const severity = resolveSeverity(score, GAD7_BANDS);
  if (severity === "none") return "Minimal";
  if (severity === "mild") return "Mild";
  if (severity === "moderate") return "Moderate";
  return "Severe";
};

export const getAttentionLabel = (avg: number | null) => {
  if (avg === null) return "Not captured";
  if (avg >= 2) return "Elevated self-reported symptoms";
  return "Within expected range";
};

export const getReactionStatus = (value: number | null) => {
  if (value === null) return "No interpretable data";
  if (value <= FULL_REPORT_THRESHOLDS.reactionFastMs) return "Faster than typical range";
  if (value <= FULL_REPORT_THRESHOLDS.reactionTypicalMaxMs) return "Within expected range";
  return "Slower than expected";
};

export const getExecutiveStatus = (value: number | null) => {
  if (value === null) return "No interpretable data";
  if (value >= FULL_REPORT_THRESHOLDS.executiveExpectedMin) return "Within expected executive control";
  return "Weaker inhibition control";
};

export const getInhibitionStatus = (value: number | null) => {
  if (value === null) return "No interpretable data";
  if (value >= FULL_REPORT_THRESHOLDS.inhibitionExpectedMin) return "Within expected response inhibition";
  if (value >= FULL_REPORT_THRESHOLDS.inhibitionBorderlineMin) return "Borderline response inhibition";
  return "Below expected response inhibition";
};

export const getDigitSpanStatus = (value: number | null) => {
  if (value === null) return "No interpretable data";
  if (value >= FULL_REPORT_THRESHOLDS.digitSpanExpectedMin) return "Typical verbal working memory span";
  return "Below typical working memory span";
};

export const getVisualMemoryStatus = (value: number | null) => {
  if (value === null) return "No interpretable data";
  if (value >= FULL_REPORT_THRESHOLDS.visualMemoryExpectedMin) return "Within typical visual span";
  return "Below typical visual span";
};

export const getOrientationStatus = (value: number | null) => {
  if (value === null) return "Not captured this visit";
  if (value >= 5) return "Fully oriented (date, place, situation)";
  return "Orientation variance noted";
};

export const getListLearningStatus = (value: number | null) => {
  if (value === null) return "Not captured this visit";
  if (value >= FULL_REPORT_THRESHOLDS.listLearningExpectedMin) return "Within expected recall range";
  if (value >= FULL_REPORT_THRESHOLDS.listLearningBorderlineMin) return "Slightly below typical verbal learning";
  return "Reduced list-learning performance";
};

export const isTaskCompleted = (value: any) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") {
    return value.trim().length > 0 && value !== "skipped";
  }
  return true;
};

export const getRawScore = (value: any): number | null => {
  if (value === undefined || value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null) {
    const raw = (value as { rawScore?: any }).rawScore;
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return raw;
    }
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const getAxisPosition = (value: number | null | undefined, max: number, invert = false) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percent = clampPercent((clampedValue / max) * 100);
  return invert ? 100 - percent : percent;
};
