import { PATHWAY_REGISTRY } from "@/data/pathwayRegistry";
import { ANALYTE_METADATA_BY_NORMALIZED } from "@/lib/analytes/metadata";
import { normalizeName } from "@/lib/analytes/normalize";
import {
  approximateSdFromRange,
  baselineFromRefRangeWithPreference,
  foldChange,
  safeDivide,
  zFromValueAndRef,
} from "@/lib/metrics";
import { validatePathwayState } from "@/lib/validatePathwayState";
import { isInPanel } from "@/lib/metabolomics/panelCatalog";
import type {
  MetaboliteResult,
  PathwayBaseline,
  PathwayCategory,
  PathwayDefinition,
  PathwayDebugInput,
  PathwayMatch,
  PathwayMetaboliteLineDefinition,
  PathwayMetaboliteLineState,
  PathwayRatioDefinition,
  PathwayRatioState,
  PathwaySeverity,
  PathwayState,
  PathwayStateComputed,
  PathwayStateInsufficient,
  PathwayDriver,
} from "@/types/pathways";
import type { MissingReason } from "@/lib/metabolomics/missing";

const SIGNIFICANT_Z_SCORE = 2;
const MILD_Z_SCORE = 1;
const CATEGORY_DELTA = 0.5;
const normalizeZero = (value: number) => (Object.is(value, -0) ? 0 : value);

const buildResultLookup = (results: MetaboliteResult[] = []) => {
  const lookup = new Map<string, MetaboliteResult>();
  results.forEach((result) => {
    if (!result?.name) return;
    const normalized = normalizeName(result.name);
    if (!lookup.has(normalized)) {
      lookup.set(normalized, result);
    }
  });
  return lookup;
};

const createMatch = (analyteId: string, result: MetaboliteResult): PathwayMatch => {
  const normalized = normalizeName(analyteId);
  const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalized);
  return {
    analyteId: metadata?.id ?? analyteId,
    displayName: metadata?.displayName ?? analyteId,
    normalized,
    value: result.value,
    unit: result.unit,
    zScore: typeof result.zScore === "number" && Number.isFinite(result.zScore) ? result.zScore : undefined,
  };
};

const formatMissingLabel = (analyteId: string) => {
  const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalizeName(analyteId));
  return metadata?.displayName ?? analyteId;
};

const isKnownAnalyte = (analyteId: string) => ANALYTE_METADATA_BY_NORMALIZED.has(normalizeName(analyteId));

const buildDebugInput = (analyteId: string, result?: MetaboliteResult): PathwayDebugInput => {
  const normalized = normalizeName(analyteId);
  const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalized);
  return {
    analyteId,
    displayName: metadata?.displayName ?? analyteId,
    normalized,
    value: result?.value,
    unit: result?.unit,
    zScore: result?.zScore,
    refRange: result?.refRange,
  };
};

const deriveSeverity = (score: number): PathwaySeverity => {
  if (score >= SIGNIFICANT_Z_SCORE) return "significant";
  if (score >= MILD_Z_SCORE) return "mild";
  return "normal";
};

const deriveCategory = (sigma: number): PathwayCategory => {
  if (sigma >= CATEGORY_DELTA) return "overactive";
  if (sigma <= -CATEGORY_DELTA) return "underactive";
  return "stable";
};

const finalizeState = (state: PathwayState) => {
  if (import.meta.env?.DEV) {
    const issues = validatePathwayState(state);
    if (issues.warnings.length > 0) {
      // eslint-disable-next-line no-console
      console.warn("[pathway-validation]", state.def.id, issues.warnings);
    }
    if (import.meta.env?.VITE_STRICT_VALIDATE === "true" && issues.errors.length > 0) {
      throw new Error(`[pathway-validation] ${state.def.id}: ${issues.errors.join("; ")}`);
    }
  }
  return state;
};

const resolveBaseline = (baseline?: PathwayBaseline) => baseline ?? "referenceMid";

const computeRatioState = (
  definition: PathwayDefinition,
  ratioDefinition: PathwayRatioDefinition,
  lookup: Map<string, MetaboliteResult>,
): PathwayRatioState | undefined => {
  const numeratorResult = lookup.get(normalizeName(ratioDefinition.numeratorAnalyteId));
  const denominatorResult = lookup.get(normalizeName(ratioDefinition.denominatorAnalyteId));
  const numeratorValue = typeof numeratorResult?.value === "number" ? numeratorResult.value : undefined;
  const denominatorValue = typeof denominatorResult?.value === "number" ? denominatorResult.value : undefined;
  const ratioValue = safeDivide(numeratorValue, denominatorValue);
  if (ratioValue == null) return undefined;

  let displayValue = ratioValue;
  if (ratioDefinition.ratioTransform === "log") {
    displayValue = Math.log(displayValue);
  }

  let ratioZ: number | undefined;
  const cohortMean = ratioDefinition.ratioCohortStats?.mean;
  const cohortSd = ratioDefinition.ratioCohortStats?.sd;
  if (ratioDefinition.ratioTransform === "log" && cohortMean != null && cohortSd != null) {
    ratioZ = zFromValueAndRef(displayValue, cohortMean, cohortSd) ?? undefined;
  } else if (ratioDefinition.ratioRefRange) {
    const refMean = baselineFromRefRangeWithPreference(ratioDefinition.ratioRefRange, "referenceMid");
    const refSd = approximateSdFromRange(ratioDefinition.ratioRefRange);
    const computedZ = zFromValueAndRef(ratioValue, refMean ?? undefined, refSd ?? undefined);
    ratioZ = computedZ ?? undefined;
    if (ratioDefinition.ratioTransform === "zscore" && ratioZ != null) {
      displayValue = ratioZ;
    }
  }

  return {
    label: ratioDefinition.label,
    value: displayValue,
    refRange: ratioDefinition.ratioRefRange,
    zScore: ratioZ,
    rawValue: ratioValue,
    transform: ratioDefinition.ratioTransform,
  };
};

const deriveRatioRefRange = (numeratorResult?: MetaboliteResult, denominatorResult?: MetaboliteResult) => {
  const numLow = numeratorResult?.refRange?.low;
  const numHigh = numeratorResult?.refRange?.high;
  const denLow = denominatorResult?.refRange?.low;
  const denHigh = denominatorResult?.refRange?.high;
  const low = safeDivide(numLow, denHigh);
  const high = safeDivide(numHigh, denLow);
  if (low == null || high == null) return undefined;
  const min = Math.min(low, high);
  const max = Math.max(low, high);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  return { low: min, high: max };
};

const computeLogRatioState = (
  ratioDefinition: PathwayRatioDefinition,
  lookup: Map<string, MetaboliteResult>,
): PathwayRatioState | undefined => {
  const numeratorResult = lookup.get(normalizeName(ratioDefinition.numeratorAnalyteId));
  const denominatorResult = lookup.get(normalizeName(ratioDefinition.denominatorAnalyteId));
  const numeratorValue = typeof numeratorResult?.value === "number" ? numeratorResult.value : undefined;
  const denominatorValue = typeof denominatorResult?.value === "number" ? denominatorResult.value : undefined;
  const ratioValue = safeDivide(numeratorValue, denominatorValue);
  if (ratioValue == null || ratioValue <= 0) return undefined;
  const logValue = Math.log(ratioValue);
  const rawRefRange = deriveRatioRefRange(numeratorResult, denominatorResult);
  const logRefRange =
    rawRefRange && rawRefRange.low > 0 && rawRefRange.high > 0
      ? { low: Math.log(rawRefRange.low), high: Math.log(rawRefRange.high) }
      : undefined;
  let ratioZ: number | undefined;
  const cohortMean = ratioDefinition.ratioCohortStats?.mean;
  const cohortSd = ratioDefinition.ratioCohortStats?.sd;
  if (cohortMean != null && cohortSd != null) {
    ratioZ = zFromValueAndRef(logValue, cohortMean, cohortSd) ?? undefined;
  } else if (logRefRange) {
    const refMean = baselineFromRefRangeWithPreference(logRefRange, "referenceMid");
    const refSd = approximateSdFromRange(logRefRange);
    ratioZ = zFromValueAndRef(logValue, refMean ?? undefined, refSd ?? undefined) ?? undefined;
  }
  return {
    label: ratioDefinition.label,
    value: logValue,
    refRange: logRefRange,
    zScore: ratioZ,
    rawValue: ratioValue,
    transform: "log",
  };
};

const computeMetaboliteLine = (
  definition: PathwayDefinition,
  line: PathwayMetaboliteLineDefinition,
  lookup: Map<string, MetaboliteResult>,
): PathwayMetaboliteLineState => {
  const normalized = normalizeName(line.analyteId);
  const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalized);
  const result = lookup.get(normalized);
  const displayLabel = line.displayLabel ?? metadata?.displayName ?? line.analyteId;
  if (!result) {
    return {
      analyteId: line.analyteId,
      displayLabel,
      displayMetric: line.displayMetric,
      missing: true,
    };
  }

  const numericValue = typeof result.value === "number" ? result.value : undefined;
  const baselineValue =
    line.displayMetric === "foldChange"
      ? baselineFromRefRangeWithPreference(result.refRange, resolveBaseline(line.baseline))
      : undefined;
  const foldChangeValue =
    line.displayMetric === "foldChange" ? foldChange(numericValue, baselineValue ?? undefined) ?? undefined : undefined;

  return {
    analyteId: line.analyteId,
    displayLabel,
    displayMetric: line.displayMetric,
    value: result.value,
    unit: result.unit,
    zScore: typeof result.zScore === "number" && Number.isFinite(result.zScore) ? result.zScore : undefined,
    foldChange: foldChangeValue ?? undefined,
    baselineValue: baselineValue ?? undefined,
    refRange: result.refRange,
    missing: false,
  };
};

const resolveZScore = (analyteId: string, lookup: Map<string, MetaboliteResult>) => {
  const result = lookup.get(normalizeName(analyteId));
  if (!result) return undefined;
  if (typeof result.zScore === "number" && Number.isFinite(result.zScore)) {
    return result.zScore;
  }
  return (
    zFromValueAndRef(
      typeof result.value === "number" ? result.value : undefined,
      baselineFromRefRangeWithPreference(result.refRange, "referenceMid") ?? undefined,
      approximateSdFromRange(result.refRange) ?? undefined,
    ) ?? undefined
  );
};

const median = (values: number[]) => {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const computePathwayState = (
  definition: PathwayDefinition,
  results: MetaboliteResult[] = [],
): PathwayState => {
  const lookup = buildResultLookup(results);
  const requiredInputs = definition.requiredAnalytes.map((analyteId) =>
    buildDebugInput(analyteId, lookup.get(normalizeName(analyteId))),
  );
  const optionalInputs = (definition.optionalAnalytes ?? []).map((analyteId) =>
    buildDebugInput(analyteId, lookup.get(normalizeName(analyteId))),
  );
  const unknownRequired = definition.requiredAnalytes.filter((analyteId) => !isKnownAnalyte(analyteId));

  const presentRequired = requiredInputs.filter(
    (input) => input.value != null || input.zScore != null,
  );
  const requiredCount = definition.requiredAnalytes.length;
  const presentCount = presentRequired.length;
  const allowPartial =
    definition.calculations.scoreStrategy === "nitricOxide" && presentCount >= 2;

  const missingReasons: Record<string, MissingReason> = {};
  const missingAnalytes = requiredInputs
    .filter((input) => input.value == null && input.zScore == null)
    .map((input) => {
      missingReasons[input.analyteId] = isInPanel(input.analyteId) ? "missing_in_sample" : "missing_in_panel";
      return formatMissingLabel(input.analyteId);
    });
  const unknownMissing = unknownRequired.map(formatMissingLabel);
  unknownRequired.forEach((analyteId) => {
    missingReasons[analyteId] = "missing_in_panel";
  });

  if (unknownMissing.length > 0) {
    return finalizeState({
      def: definition,
      status: "insufficient_data",
      missingAnalytes: unknownMissing,
      missingReasons,
      reason: "missing_inputs",
      debug: {
        requiredInputs,
        optionalInputs,
        scoreMethod: definition.calculations.pathwayScoreMethod,
      },
    } satisfies PathwayStateInsufficient);
  }

  const ratioDefinitions = definition.calculations.ratioDefinitions?.length
    ? definition.calculations.ratioDefinitions
    : definition.calculations.ratioDefinition
      ? [definition.calculations.ratioDefinition]
      : [];
  if (ratioDefinitions.length > 0) {
    ratioDefinitions.forEach((ratioDefinition) => {
      const ratioInputs = [ratioDefinition.numeratorAnalyteId, ratioDefinition.denominatorAnalyteId];
      ratioInputs.forEach((id) => {
        const normalized = normalizeName(id);
        const isRequired = definition.requiredAnalytes.some(
          (requiredId) => normalizeName(requiredId) === normalized,
        );
        if (!isRequired) return;
        const hasResult = lookup.has(normalized);
        if (!hasResult && !missingAnalytes.includes(formatMissingLabel(id))) {
          missingAnalytes.push(formatMissingLabel(id));
          missingReasons[id] = isInPanel(id) ? "missing_in_sample" : "missing_in_panel";
        }
      });
    });
  }

  if (definition.calculations.implemented === false) {
    return finalizeState({
      def: definition,
      status: "insufficient",
      missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
      missingReasons,
      reason: "not_implemented",
      debug: {
        requiredInputs,
        optionalInputs,
        scoreMethod: definition.calculations.pathwayScoreMethod,
      },
    } satisfies PathwayStateInsufficient);
  }

  const hasMissingInPanel = Object.values(missingReasons).some((reason) => reason === "missing_in_panel");

  if (missingAnalytes.length > 0 && (hasMissingInPanel || !allowPartial)) {
    return finalizeState({
      def: definition,
      status: hasMissingInPanel ? "insufficient_data" : "insufficient",
      missingAnalytes,
      missingReasons,
      reason: "missing_inputs",
      debug: {
        requiredInputs,
        optionalInputs,
        scoreMethod: definition.calculations.pathwayScoreMethod,
      },
    } satisfies PathwayStateInsufficient);
  }

  const matched = [...requiredInputs, ...optionalInputs]
    .map((input) => {
      const result = lookup.get(normalizeName(input.analyteId));
      if (!result) return null;
      return createMatch(input.analyteId, result);
    })
    .filter((entry): entry is PathwayMatch => Boolean(entry));

  const metaboliteLines = (definition.calculations.metaboliteLines ?? [])
    .filter((line) => isKnownAnalyte(line.analyteId))
    .map((line) => computeMetaboliteLine(definition, line, lookup));

  const ratioStates = ratioDefinitions
    .map((ratioDefinition) =>
      ratioDefinition.ratioTransform === "log"
        ? computeLogRatioState(ratioDefinition, lookup)
        : computeRatioState(definition, ratioDefinition, lookup),
    )
    .filter((entry): entry is PathwayRatioState => Boolean(entry));
  const ratioState = ratioStates[0];

  if (definition.calculations.pathwayScoreMethod === "ratioZ" && ratioDefinitions.length > 0 && ratioStates.length === 0) {
    ratioDefinitions.forEach((ratioDefinition) => {
      const numeratorResult = lookup.get(normalizeName(ratioDefinition.numeratorAnalyteId));
      const denominatorResult = lookup.get(normalizeName(ratioDefinition.denominatorAnalyteId));
      const numeratorValue = typeof numeratorResult?.value === "number" ? numeratorResult.value : undefined;
      const denominatorValue = typeof denominatorResult?.value === "number" ? denominatorResult.value : undefined;
      const ratioValue = safeDivide(numeratorValue, denominatorValue);
      if (ratioValue != null) return;
      if (numeratorValue == null) {
        const label = formatMissingLabel(ratioDefinition.numeratorAnalyteId);
        if (!missingAnalytes.includes(label)) missingAnalytes.push(label);
        if (!missingReasons[ratioDefinition.numeratorAnalyteId]) {
          missingReasons[ratioDefinition.numeratorAnalyteId] = "unknown";
        }
      }
      if (denominatorValue == null || denominatorValue === 0) {
        const label = formatMissingLabel(ratioDefinition.denominatorAnalyteId);
        if (!missingAnalytes.includes(label)) missingAnalytes.push(label);
        if (!missingReasons[ratioDefinition.denominatorAnalyteId]) {
          missingReasons[ratioDefinition.denominatorAnalyteId] = "unknown";
        }
      }
    });

    return finalizeState({
      def: definition,
      status: "insufficient",
      missingAnalytes,
      missingReasons,
      reason: "missing_inputs",
      debug: {
        requiredInputs,
        optionalInputs,
        scoreMethod: definition.calculations.pathwayScoreMethod,
      },
    } satisfies PathwayStateInsufficient);
  }

  let sigma = 0;
  let score = 0;
  let drivers: PathwayDriver[] | undefined;
  let faOxGroupedDetails:
    | {
        zShort?: number;
        zMed?: number;
        zLong?: number;
        zC0?: number;
        zC2?: number;
        ratioZ?: { c2c0?: number; medc0?: number };
      }
    | undefined;

  if (definition.calculations.scoreStrategy === "bcaaOxidation") {
    const bcaaInputs = definition.requiredAnalytes.map((analyteId) => {
      const result = lookup.get(normalizeName(analyteId));
      return { analyteId, result, z: resolveZScore(analyteId, lookup) };
    });
    const bcaaZs = bcaaInputs.map((input) => input.z).filter((z): z is number => z != null);
    if (bcaaZs.length === 0) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }
    const catInputs = (definition.optionalAnalytes ?? []).map((analyteId) => {
      const result = lookup.get(normalizeName(analyteId));
      return { analyteId, result, z: resolveZScore(analyteId, lookup) };
    });
    const catZs = catInputs.map((input) => input.z).filter((z): z is number => z != null);
    const bcaaZ = bcaaZs.reduce((acc, value) => acc + value, 0) / bcaaZs.length;
    const catZ = catZs.length > 0 ? catZs.reduce((acc, value) => acc + value, 0) / catZs.length : null;
    const weighted = catZ != null ? 0.65 * bcaaZ + 0.35 * catZ : bcaaZ;
    sigma = normalizeZero(weighted);
    score = normalizeZero(Math.abs(weighted));
    const labelOverrides = new Map(
      (definition.calculations.metaboliteLines ?? []).map((line) => [
        normalizeName(line.analyteId),
        line.displayLabel,
      ]),
    );
    const driverCandidates = [...bcaaInputs, ...catInputs].filter(
      (input): input is { analyteId: string; result: MetaboliteResult | undefined; z: number } =>
        typeof input.z === "number",
    );
    drivers = driverCandidates
      .sort((a, b) => Math.abs(b.z) - Math.abs(a.z))
      .slice(0, 3)
      .map((input) => {
        const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalizeName(input.analyteId));
        const labelOverride = labelOverrides.get(normalizeName(input.analyteId));
        return {
          analyteId: input.analyteId,
          displayLabel: labelOverride ?? metadata?.displayName ?? input.analyteId,
          zScore: normalizeZero(input.z),
          value: input.result?.value,
          unit: input.result?.unit,
        };
      });
  } else if (definition.calculations.scoreStrategy === "redoxPressure") {
    const coreInputs = requiredInputs.map((input) => {
      const result = lookup.get(normalizeName(input.analyteId));
      const z = typeof result?.zScore === "number" && Number.isFinite(result.zScore)
        ? result.zScore
        : zFromValueAndRef(
            typeof result?.value === "number" ? result.value : undefined,
            baselineFromRefRangeWithPreference(result?.refRange, "referenceMid") ?? undefined,
            approximateSdFromRange(result?.refRange) ?? undefined,
          ) ?? undefined;
      return { analyteId: input.analyteId, z };
    });
    const coreZScores = coreInputs.map((input) => input.z).filter((z): z is number => z != null);
    if (coreZScores.length === 0) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }

    const coreScore = coreZScores.reduce((acc, value) => acc + value, 0) / coreZScores.length;
    const ratioByLabel = new Map(ratioStates.map((ratio) => [ratio.label, ratio.zScore]));
    const components = [
      { key: "core", z: coreScore, weight: 0.7 },
      { key: "ketone", z: ratioByLabel.get("Ketone redox ratio"), weight: 0.2 },
      { key: "cytosolic", z: ratioByLabel.get("Cytosolic redox ratio"), weight: 0.1 },
    ].filter((component) => typeof component.z === "number" && Number.isFinite(component.z));
    const totalWeight = components.reduce((acc, item) => acc + item.weight, 0);
    const weighted = components.reduce((acc, item) => acc + (item.weight / totalWeight) * (item.z as number), 0);
    sigma = normalizeZero(weighted);
    score = normalizeZero(Math.max(...components.map((item) => Math.abs(item.z as number)), Math.abs(coreScore)));
  } else if (definition.calculations.scoreStrategy === "faOxGrouped") {
    const shortGroup = [
      "propionylcarnitine",
      "butyrylcarnitine",
      "isobutyrylcarnitine",
      "isovalerylcarnitine",
      "valerylcarnitine",
    ];
    const mediumGroup = [
      "hexanoylcarnitine",
      "octanoylcarnitine",
      "decanoylcarnitine",
      "lauroylcarnitine",
    ];
    const longGroup = ["myristoylcarnitine", "palmitoylcarnitine", "stearoylcarnitine"];

    const zShortValues = shortGroup
      .map((analyteId) => resolveZScore(analyteId, lookup))
      .filter((z): z is number => z != null);
    const zMedValues = mediumGroup
      .map((analyteId) => resolveZScore(analyteId, lookup))
      .filter((z): z is number => z != null);
    const zLongValues = longGroup
      .map((analyteId) => resolveZScore(analyteId, lookup))
      .filter((z): z is number => z != null);

    const zShort = median(zShortValues);
    const zMed = median(zMedValues);
    const zLong = median(zLongValues);
    const zC0 = resolveZScore("carnitine", lookup);
    const zC2 = resolveZScore("acetylcarnitine", lookup);

    const c0Value = lookup.get(normalizeName("carnitine"))?.value;
    const c2Value = lookup.get(normalizeName("acetylcarnitine"))?.value;
    const c8Value = lookup.get(normalizeName("octanoylcarnitine"))?.value;
    const c10Value = lookup.get(normalizeName("decanoylcarnitine"))?.value;
    const ratioZ: { c2c0?: number; medc0?: number } = {};
    const c2c0Stats = definition.calculations.faOxRatioStats?.c2c0;
    const medc0Stats = definition.calculations.faOxRatioStats?.medc0;

    if (typeof c0Value === "number" && typeof c2Value === "number" && c0Value > 0 && c2Value > 0) {
      const ratio = Math.log(c2Value / c0Value);
      if (c2c0Stats?.mean != null && c2c0Stats?.sd != null) {
        ratioZ.c2c0 = zFromValueAndRef(ratio, c2c0Stats.mean, c2c0Stats.sd) ?? undefined;
      }
    }

    const c8Numeric = typeof c8Value === "number" ? c8Value : undefined;
    const c10Numeric = typeof c10Value === "number" ? c10Value : undefined;
    const medNumerator =
      typeof c8Numeric === "number" && typeof c10Numeric === "number"
        ? c8Numeric + c10Numeric
        : typeof c10Numeric === "number"
          ? c10Numeric
          : typeof c8Numeric === "number"
            ? c8Numeric
            : undefined;
    if (typeof c0Value === "number" && typeof medNumerator === "number" && c0Value > 0 && medNumerator > 0) {
      const ratio = Math.log(medNumerator / c0Value);
      if (medc0Stats?.mean != null && medc0Stats?.sd != null) {
        ratioZ.medc0 = zFromValueAndRef(ratio, medc0Stats.mean, medc0Stats.sd) ?? undefined;
      }
    }

    const components = [
      { key: "medium", z: zMed, weight: 0.35 },
      { key: "long", z: zLong, weight: 0.2 },
      { key: "short", z: zShort, weight: 0.15 },
      { key: "c0", z: zC0, weight: 0.15 },
      { key: "c2", z: zC2, weight: 0.15 },
    ].filter((component) => typeof component.z === "number" && Number.isFinite(component.z));
    if (components.length === 0) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }
    const totalWeight = components.reduce((acc, item) => acc + item.weight, 0);
    const weighted = components.reduce((acc, item) => acc + (item.weight / totalWeight) * (item.z as number), 0);
    sigma = normalizeZero(weighted);
    score = normalizeZero(Math.abs(weighted));
    faOxGroupedDetails = {
      zShort,
      zMed,
      zLong,
      zC0,
      zC2,
      ratioZ,
    };
  } else if (definition.calculations.scoreStrategy === "aromaticBalance") {
    const coreInputs = requiredInputs.map((input) => {
      const result = lookup.get(normalizeName(input.analyteId));
      const z = typeof result?.zScore === "number" && Number.isFinite(result.zScore)
        ? result.zScore
        : zFromValueAndRef(
            typeof result?.value === "number" ? result.value : undefined,
            baselineFromRefRangeWithPreference(result?.refRange, "referenceMid") ?? undefined,
            approximateSdFromRange(result?.refRange) ?? undefined,
          ) ?? undefined;
      return { analyteId: input.analyteId, z };
    });
    const coreZScores = coreInputs.map((input) => input.z).filter((z): z is number => z != null);
    if (coreZScores.length === 0) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }

    const coreScore = coreZScores.reduce((acc, value) => acc + value, 0) / coreZScores.length;
    const ratioByLabel = new Map(ratioStates.map((ratio) => [ratio.label, ratio.zScore]));
    const components = [
      { key: "core", z: coreScore, weight: 0.7 },
      { key: "pheTyr", z: ratioByLabel.get("Phe:Tyr ratio"), weight: 0.2 },
      { key: "kynTrp", z: ratioByLabel.get("Kyn:Trp ratio"), weight: 0.1 },
    ].filter((component) => typeof component.z === "number" && Number.isFinite(component.z));
    const totalWeight = components.reduce((acc, item) => acc + item.weight, 0);
    const weighted = components.reduce((acc, item) => acc + (item.weight / totalWeight) * (item.z as number), 0);
    sigma = normalizeZero(weighted);
    score = normalizeZero(Math.max(...components.map((item) => Math.abs(item.z as number)), Math.abs(coreScore)));
  } else if (definition.calculations.scoreStrategy === "nitricOxide") {
    const coreInputs = requiredInputs.map((input) => {
      const result = lookup.get(normalizeName(input.analyteId));
      const z = typeof result?.zScore === "number" && Number.isFinite(result.zScore)
        ? result.zScore
        : zFromValueAndRef(
            typeof result?.value === "number" ? result.value : undefined,
            baselineFromRefRangeWithPreference(result?.refRange, "referenceMid") ?? undefined,
            approximateSdFromRange(result?.refRange) ?? undefined,
          ) ?? undefined;
      return { analyteId: input.analyteId, z };
    });
    const coreZScores = coreInputs.map((input) => input.z).filter((z): z is number => z != null);
    if (coreZScores.length < 2) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes,
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }

    const coreScore = coreZScores.reduce((acc, value) => acc + value, 0) / coreZScores.length;
    const ratioPairs: Array<[string, string]> = [
      ["citrulline", "arginine"],
      ["ornithine", "arginine"],
    ];
    const ratioZScores = ratioPairs
      .map(([numerator, denominator]) => {
        const num = coreInputs.find((input) => normalizeName(input.analyteId) === normalizeName(numerator));
        const den = coreInputs.find((input) => normalizeName(input.analyteId) === normalizeName(denominator));
        if (num?.z == null || den?.z == null) return null;
        return num.z - den.z;
      })
      .filter((z): z is number => z != null);
    const ratioScore = ratioZScores.length > 0
      ? ratioZScores.reduce((acc, value) => acc + value, 0) / ratioZScores.length
      : undefined;
    const components = [
      { key: "core", z: coreScore, weight: 0.6 },
      { key: "ratio", z: ratioScore, weight: 0.4 },
    ].filter((component) => typeof component.z === "number" && Number.isFinite(component.z));
    const totalWeight = components.reduce((acc, item) => acc + item.weight, 0);
    const weighted = components.reduce((acc, item) => acc + (item.weight / totalWeight) * (item.z as number), 0);
    sigma = normalizeZero(weighted);
    score = normalizeZero(Math.max(...components.map((item) => Math.abs(item.z as number)), Math.abs(coreScore)));
  } else if (definition.calculations.pathwayScoreMethod === "ratioZ" && ratioState) {
    if (ratioState.zScore != null) {
      sigma = normalizeZero(ratioState.zScore);
      score = normalizeZero(Math.abs(ratioState.zScore));
    } else {
      sigma = 0;
      score = 0;
    }
  } else if (definition.calculations.pathwayScoreMethod === "weightedZ") {
    const zScores = matched
      .map((match) => match.zScore)
      .filter((z): z is number => typeof z === "number" && Number.isFinite(z));
    if (zScores.length === 0) {
      return finalizeState({
        def: definition,
        status: "insufficient",
        missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
        missingReasons,
        reason: "missing_inputs",
        debug: {
          requiredInputs,
          optionalInputs,
          scoreMethod: definition.calculations.pathwayScoreMethod,
        },
      } satisfies PathwayStateInsufficient);
    }
    sigma = normalizeZero(zScores.reduce((acc, value) => acc + value, 0) / zScores.length);
    score = normalizeZero(Math.max(...zScores.map((z) => Math.abs(z))));
  } else {
    return finalizeState({
      def: definition,
      status: "insufficient",
      missingAnalytes: definition.requiredAnalytes.map(formatMissingLabel),
      missingReasons,
      reason: "not_implemented",
      debug: {
        requiredInputs,
        optionalInputs,
        scoreMethod: definition.calculations.pathwayScoreMethod,
      },
    } satisfies PathwayStateInsufficient);
  }

  const category = deriveCategory(sigma);
  const severity = deriveSeverity(score);

  const state: PathwayStateComputed = {
    def: definition,
    status: "computed",
    severity,
    category,
    score,
    sigma,
    matched,
    drivers,
    ratio: ratioState,
    ratios: ratioStates.length > 0 ? ratioStates : undefined,
    metaboliteLines,
    partial: allowPartial && presentCount < requiredCount,
    debug: {
      requiredInputs,
      optionalInputs,
      ratio: ratioDefinitions.length === 1
        ? {
            numerator: buildDebugInput(
              ratioDefinitions[0].numeratorAnalyteId,
              lookup.get(normalizeName(ratioDefinitions[0].numeratorAnalyteId)),
            ),
            denominator: buildDebugInput(
              ratioDefinitions[0].denominatorAnalyteId,
              lookup.get(normalizeName(ratioDefinitions[0].denominatorAnalyteId)),
            ),
            value: ratioState?.value,
            zScore: ratioState?.zScore,
          }
        : undefined,
      ratios:
        ratioDefinitions.length > 1
          ? ratioDefinitions.map((ratioDefinition) => {
              const numerator = buildDebugInput(
                ratioDefinition.numeratorAnalyteId,
                lookup.get(normalizeName(ratioDefinition.numeratorAnalyteId)),
              );
              const denominator = buildDebugInput(
                ratioDefinition.denominatorAnalyteId,
                lookup.get(normalizeName(ratioDefinition.denominatorAnalyteId)),
              );
              const stateRatio = ratioStates.find((ratio) => ratio.label === ratioDefinition.label);
              return {
                label: ratioDefinition.label,
                numerator,
                denominator,
                value: stateRatio?.value,
                zScore: stateRatio?.zScore,
              };
            })
          : undefined,
      faOxGrouped: faOxGroupedDetails,
      scoreMethod: definition.calculations.pathwayScoreMethod,
      sigma,
      score,
    },
  };

  return finalizeState(state);
};

export const computePathwayStates = (results: MetaboliteResult[] = []) =>
  PATHWAY_REGISTRY.map((definition) => computePathwayState(definition, results));

export const summarizePathwayStates = (states: PathwayState[]) => {
  return states.reduce(
    (acc, state) => {
      acc.total += 1;
      if (state.status !== "computed") {
        acc.insufficient += 1;
        return acc;
      }
      if (state.severity === "significant") acc.significant += 1;
      else if (state.severity === "mild") acc.mild += 1;
      else acc.normal += 1;
      return acc;
    },
    { total: 0, significant: 0, mild: 0, normal: 0, insufficient: 0 },
  );
};
