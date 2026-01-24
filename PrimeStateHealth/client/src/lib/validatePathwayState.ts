import {
  approximateSdFromRange,
  baselineFromRefRangeWithPreference,
  foldChange,
  safeDivide,
  zFromValueAndRef,
} from "@/lib/metrics";
import type {
  PathwayBaseline,
  PathwayMetaboliteLineState,
  PathwayRatioDefinition,
  PathwayState,
} from "@/types/pathways";

const METRIC_TOLERANCE = 0.02;

const matchesWithinTolerance = (value?: number | null, expected?: number | null) => {
  if (value == null || expected == null) return false;
  if (!Number.isFinite(value) || !Number.isFinite(expected)) return false;
  return Math.abs(value - expected) <= METRIC_TOLERANCE;
};

const deriveCategoryFromSigma = (sigma: number) => {
  if (sigma >= 0.5) return "overactive";
  if (sigma <= -0.5) return "underactive";
  return "stable";
};

const resolveBaseline = (baseline?: PathwayBaseline) => baseline ?? "referenceMid";

const validateRatio = (
  ratioDefinition: PathwayRatioDefinition,
  state: PathwayState,
  errors: string[],
) => {
  if (state.status !== "computed") return;
  const ratio =
    state.ratios?.find((candidate) => candidate.label === ratioDefinition.label) ?? state.ratio;
  if (!ratio) return;
  const debugRatio =
    state.debug?.ratios?.find((entry) => entry.label === ratioDefinition.label) ?? state.debug?.ratio;
  const numerator = debugRatio?.numerator;
  const denominator = debugRatio?.denominator;
  const numeratorValue = typeof numerator?.value === "number" ? numerator.value : undefined;
  const denominatorValue = typeof denominator?.value === "number" ? denominator.value : undefined;
  const computedRatio = safeDivide(numeratorValue, denominatorValue);
  if (computedRatio == null) {
    errors.push(`Ratio ${ratioDefinition.label} cannot be computed (missing numerator/denominator).`);
    return;
  }
  if (!matchesWithinTolerance(ratio.value, computedRatio) && ratioDefinition.ratioTransform === "raw") {
    errors.push(`Ratio ${ratioDefinition.label} does not match raw inputs.`);
  }
  if (ratioDefinition.ratioTransform === "log") {
    const logRatio = Math.log(computedRatio);
    if (!matchesWithinTolerance(ratio.value, logRatio)) {
      errors.push(`Ratio ${ratioDefinition.label} does not match log-transformed inputs.`);
    }
  }
  const cohortMean = ratioDefinition.ratioCohortStats?.mean;
  const cohortSd = ratioDefinition.ratioCohortStats?.sd;
  if (ratioDefinition.ratioTransform === "log" && cohortMean != null && cohortSd != null) {
    const computedZ = zFromValueAndRef(Math.log(computedRatio), cohortMean, cohortSd);
    if (ratio.zScore != null && computedZ != null && !matchesWithinTolerance(ratio.zScore, computedZ)) {
      errors.push(`Ratio ${ratioDefinition.label} z-score does not match cohort stats.`);
    }
  } else if (ratioDefinition.ratioRefRange) {
    const refMean = baselineFromRefRangeWithPreference(ratioDefinition.ratioRefRange, "referenceMid");
    const refSd = approximateSdFromRange(ratioDefinition.ratioRefRange);
    const computedZ = zFromValueAndRef(computedRatio, refMean ?? undefined, refSd ?? undefined);
    if (ratio.zScore != null && computedZ != null && !matchesWithinTolerance(ratio.zScore, computedZ)) {
      errors.push(`Ratio ${ratioDefinition.label} z-score does not match reference range.`);
    }
  }
};

const validateFoldChange = (line: PathwayMetaboliteLineState, errors: string[]) => {
  if (line.displayMetric !== "foldChange") return;
  if (line.missing) return;
  const numericValue = typeof line.value === "number" ? line.value : undefined;
  const computed = foldChange(numericValue, line.baselineValue);
  if (computed == null) return;
  if (!matchesWithinTolerance(line.foldChange, computed)) {
    errors.push(`Fold-change for ${line.displayLabel} does not match baseline.`);
  }
};

export const validatePathwayState = (state: PathwayState) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (state.status === "computed") {
    if (!Number.isFinite(state.sigma)) {
      errors.push("Missing sigma for computed pathway.");
    } else {
      const expectedCategory = deriveCategoryFromSigma(state.sigma);
      if (state.category !== expectedCategory) {
        errors.push("Category does not match sigma sign.");
      }
    }
    const missingRequired = state.debug?.requiredInputs.filter(
      (input) => input.value == null && input.zScore == null,
    );
    if (missingRequired && missingRequired.length > 0) {
      errors.push("Computed pathway is missing required analyte inputs.");
    }
  } else {
    if (state.reason !== "not_implemented" && state.missingAnalytes.length === 0) {
      warnings.push("Insufficient pathway has no missing analytes listed.");
    }
  }

  const ratioDefinitions = state.def.calculations.ratioDefinitions?.length
    ? state.def.calculations.ratioDefinitions
    : state.def.calculations.ratioDefinition
      ? [state.def.calculations.ratioDefinition]
      : [];
  ratioDefinitions.forEach((ratioDefinition, index) => {
    if (state.status === "computed") {
      const ratio = state.ratios?.[index] ?? state.ratio;
      if (!ratio) {
        errors.push(`Ratio ${ratioDefinition.label} is missing from computed pathway.`);
      }
    }
    validateRatio(ratioDefinition, state, errors);
  });

  if (state.status === "computed") {
    state.metaboliteLines.forEach((line) => validateFoldChange(line, errors));
  }

  if (state.status === "computed" && state.def.requiredAnalytes.length === 0) {
    warnings.push("Computed pathway has no required analytes.");
  }

  return { errors, warnings };
};
