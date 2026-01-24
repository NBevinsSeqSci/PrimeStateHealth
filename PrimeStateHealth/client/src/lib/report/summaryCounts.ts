type Marker = {
  flag?: string | null;
};

type KeyFindingRow = {
  markers?: Marker[];
  recommendation?: string;
};

type PathwayRow = {
  activity?: string;
};

type DietSignalLike = {
  strength?: "Low" | "Moderate" | "High";
  statusMarker?: {
    status: "Sufficient" | "Deficient" | "Indeterminate";
  };
};

type AnalyteRow = {
  flag?: string;
};

export const summarizeKeyFindings = (rows: KeyFindingRow[]) => {
  const count = rows.length;
  const highPriorityCount = rows.reduce((acc, row) => {
    const hasHigh = row.markers?.some((marker) => marker.flag?.toLowerCase() === "high");
    return hasHigh ? acc + 1 : acc;
  }, 0);

  const retestHint = rows
    .map((row) => extractRetestHint(row.recommendation))
    .find((hint) => Boolean(hint));

  return {
    count,
    highPriorityCount,
    retestHint,
  };
};

const extractRetestHint = (text?: string) => {
  if (!text) return undefined;
  const match = text.match(/re[-\s]?(?:test|assess)[^0-9]*(\d+(?:[\-–]\d+)?)\s*(week|wk|weeks)/i);
  if (!match) return undefined;
  const windowText = match[1].includes("-") || match[1].includes("–") ? match[1].replace("–", "–") : match[1];
  return `Re-test: ${windowText}${match[2].toLowerCase().startsWith("wk") ? " wks" : ` ${match[2]}`}`;
};

export const summarizePathways = (rows: PathwayRow[]) => {
  const summary = {
    total: rows.length,
    significantCount: 0,
    mildCount: 0,
    normalCount: 0,
    insufficientCount: 0,
  };

  rows.forEach((row) => {
    const zScore = extractZScore(row.activity);
    if (zScore == null) {
      summary.insufficientCount += 1;
      return;
    }
    const abs = Math.abs(zScore);
    if (abs >= 2) summary.significantCount += 1;
    else if (abs >= 1) summary.mildCount += 1;
    else summary.normalCount += 1;
  });

  return summary;
};

const extractZScore = (activity?: string) => {
  if (!activity) return undefined;
  const match = activity.match(/([+-]?\d+(?:\.\d+)?)\s*σ/);
  if (!match) return undefined;
  return Number.parseFloat(match[1]);
};

export const summarizeDietSignals = (signals: DietSignalLike[]) => {
  const signalCount = signals.length;
  const highCount = signals.filter((signal) => signal.strength === "High").length;
  const moderateCount = signals.filter((signal) => signal.strength === "Moderate").length;
  const markerCount = signals.filter((signal) => Boolean(signal.statusMarker)).length;
  const deficientCount = signals.filter((signal) => signal.statusMarker?.status === "Deficient").length;
  const sufficientCount = signals.filter((signal) => signal.statusMarker?.status === "Sufficient").length;
  const indeterminateCount = signals.filter((signal) => signal.statusMarker?.status === "Indeterminate").length;

  return {
    signalCount,
    highCount,
    moderateCount,
    markerCount,
    deficientCount,
    sufficientCount,
    indeterminateCount,
  };
};

export const summarizeAnalytes = (rows: AnalyteRow[]) => {
  const measuredCount = rows.length;
  const abnormalCount = rows.filter((row) => row.flag && row.flag.toLowerCase() !== "normal").length;
  return { measuredCount, abnormalCount };
};
