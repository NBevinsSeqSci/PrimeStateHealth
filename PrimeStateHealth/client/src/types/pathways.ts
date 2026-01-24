export type PathwayFramework = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type PathwayScoreMethod = "weightedZ" | "ratioZ" | "ruleBased";
export type RatioTransform = "raw" | "log" | "zscore";
export type PathwayBaseline = "cohortMedian" | "referenceMid" | "referenceUpper" | "referenceLower";
export type PathwayDisplayMetric = "foldChange" | "zScore" | "value";

export type MetaboliteResult = {
  name: string;
  value?: number | string;
  unit?: string;
  zScore?: number;
  refRange?: { low?: number; high?: number; text?: string };
};

export interface PathwayRatioRefRange {
  low?: number;
  high?: number;
  unit?: string;
}

export interface PathwayRatioDefinition {
  numeratorAnalyteId: string;
  denominatorAnalyteId: string;
  ratioTransform: RatioTransform;
  ratioRefRange?: PathwayRatioRefRange;
  ratioCohortStats?: { mean?: number; sd?: number; reference?: string };
  label: string;
}

export interface PathwayMetaboliteLineDefinition {
  analyteId: string;
  displayLabel?: string;
  displayMetric: PathwayDisplayMetric;
  baseline?: PathwayBaseline;
}

export interface PathwayDisplaySpec {
  flowLabel?: string;
  metricLabels?: string[];
}

export interface PathwayEducation {
  summary?: string;
  whatMeans?: string;
  nonDiseaseReasons?: string;
  retest?: string;
  calculation?: string;
  disclaimer?: string;
}

export interface PathwayCalculationSpec {
  pathwayScoreMethod: PathwayScoreMethod;
  ratioDefinition?: PathwayRatioDefinition;
  ratioDefinitions?: PathwayRatioDefinition[];
  metaboliteLines?: PathwayMetaboliteLineDefinition[];
  implemented?: boolean;
  scoreStrategy?: "aromaticBalance" | "redoxPressure" | "nitricOxide" | "faOxGrouped" | "hydroxybutyrateSignal" | "bcaaOxidation";
  faOxRatioStats?: {
    c2c0?: { mean?: number; sd?: number; reference?: string };
    medc0?: { mean?: number; sd?: number; reference?: string };
  };
}

export interface PathwayDefinition {
  id: string;
  framework: PathwayFramework;
  frameworkTitle: string;
  order: number;
  title: string;
  subtitle?: string;
  metricLabel?: string;
  referenceRangeLabel?: string;
  interpretation?: string;
  actions?: string[];
  requiredAnalytes: string[];
  optionalAnalytes?: string[];
  display: PathwayDisplaySpec;
  calculations: PathwayCalculationSpec;
  education?: PathwayEducation;
  pubmedPmids?: string[];
  publications?: Array<{ pmid?: string; note?: string }>;
}

export type PathwaySeverity = "normal" | "mild" | "significant";
export type PathwayCategory = "overactive" | "underactive" | "stable";

export interface PathwayMatch {
  analyteId: string;
  displayName: string;
  normalized: string;
  value?: number | string;
  unit?: string;
  zScore?: number;
}

export interface PathwayRatioState {
  label: string;
  value: number;
  refRange?: PathwayRatioRefRange;
  zScore?: number;
  rawValue?: number;
  transform?: RatioTransform;
}

export interface PathwayMetaboliteLineState {
  analyteId: string;
  displayLabel: string;
  displayMetric: PathwayDisplayMetric;
  value?: number | string;
  unit?: string;
  zScore?: number;
  foldChange?: number;
  baselineValue?: number;
  refRange?: MetaboliteResult["refRange"];
  missing?: boolean;
}

export interface PathwayDriver {
  analyteId: string;
  displayLabel: string;
  zScore: number;
  value?: number | string;
  unit?: string;
}

export interface PathwayDebugInput {
  analyteId: string;
  displayName: string;
  value?: number | string;
  unit?: string;
  zScore?: number;
  refRange?: MetaboliteResult["refRange"];
  normalized: string;
}

export interface PathwayDebugInfo {
  requiredInputs: PathwayDebugInput[];
  optionalInputs: PathwayDebugInput[];
  ratio?: {
    numerator?: PathwayDebugInput;
    denominator?: PathwayDebugInput;
    value?: number;
    zScore?: number;
  };
  ratios?: Array<{
    label: string;
    numerator?: PathwayDebugInput;
    denominator?: PathwayDebugInput;
    value?: number;
    zScore?: number;
  }>;
  scoreMethod: PathwayScoreMethod;
  sigma?: number;
  score?: number;
  faOxGrouped?: {
    zShort?: number;
    zMed?: number;
    zLong?: number;
    zC0?: number;
    zC2?: number;
    ratioZ?: { c2c0?: number; medc0?: number };
  };
}

export interface PathwayStateComputed {
  def: PathwayDefinition;
  status: "computed";
  severity: PathwaySeverity;
  category: PathwayCategory;
  score: number;
  sigma: number;
  matched: PathwayMatch[];
  drivers?: PathwayDriver[];
  ratio?: PathwayRatioState;
  ratios?: PathwayRatioState[];
  metaboliteLines: PathwayMetaboliteLineState[];
  partial?: boolean;
  debug?: PathwayDebugInfo;
}

export interface PathwayStateInsufficient {
  def: PathwayDefinition;
  status: "insufficient" | "insufficient_data";
  missingAnalytes: string[];
  missingReasons?: Record<
    string,
    "not_measured" | "below_loq" | "qc_fail" | "not_reported" | "missing_in_panel" | "missing_in_sample" | "unknown"
  >;
  reason?: "missing_inputs" | "not_implemented";
  debug?: PathwayDebugInfo;
}

export type PathwayState = PathwayStateComputed | PathwayStateInsufficient;
