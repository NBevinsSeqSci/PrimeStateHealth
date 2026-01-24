import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FRAMEWORK_SEQUENCE, PATHWAY_REGISTRY } from "@/data/pathwayRegistry";
import { computePathwayStates, summarizePathwayStates } from "@/lib/computePathwayState";
import { ANALYTE_METADATA_BY_NORMALIZED } from "@/lib/analytes/metadata";
import { normalizeName } from "@/lib/analytes/normalize";
import { computeCompleteness } from "@/lib/metabolomics/completeness";
import { formatMissingReason, type MissingReason } from "@/lib/metabolomics/missing";
import { isInPanel } from "@/lib/metabolomics/panelCatalog";
import { computeKTRatio } from "@/lib/metabolomics/ratio";
import type {
  MetaboliteResult,
  PathwayDefinition,
  PathwayMetaboliteLineState,
  PathwayRatioDefinition,
  PathwayState,
  PathwayStateComputed,
} from "@/types/pathways";
import { PathwayFrame, type PathwayMetric, type PathwaySeverity, type PathwaySummaryBadge } from "@/components/metabolomics/PathwayFrame";

type PathwayFilter = "All" | "Significant" | "Mild";
type AccordionSection = { title: string; body?: string | string[]; kind?: "text" | "list" | "references" };

interface PathwayExplorerProps {
  results?: MetaboliteResult[];
  highlightedPathwayId?: string;
  onAnalyteNavigate?: (normalizedName: string) => void;
}

const sortByOrder = (framework: string) =>
  PATHWAY_REGISTRY.filter((definition) => definition.framework === framework).sort(
    (a, b) => a.order - b.order,
  );

const normalizeZero = (value: number) => (Object.is(value, -0) ? 0 : value);

const formatFoldChange = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value.toFixed(2)}x`;
};

const formatSignedZ = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  const normalized = normalizeZero(value);
  const sign = normalized >= 0 ? "+" : "";
  return `${sign}${normalized.toFixed(1)}`;
};

const formatScoreTier = (score?: number) => {
  if (typeof score !== "number" || Number.isNaN(score)) return undefined;
  if (score >= 2) return "Significant";
  if (score >= 1) return "Mild";
  return "Typical";
};

const getScoreTierTone = (tier?: string) => {
  if (tier === "Significant") return "destructive" as const;
  if (tier === "Mild") return "secondary" as const;
  if (tier === "Typical") return "outline" as const;
  return undefined;
};

const isComputedState = (state: PathwayState): state is PathwayStateComputed =>
  state.status === "computed";

const formatSignedNumber = (value: number | undefined, digits: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const normalized = normalizeZero(value);
  const sign = normalized >= 0 ? "+" : "";
  return `${sign}${normalized.toFixed(digits)}`;
};

const formatFixed = (value: number | undefined, digits: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
};

const formatValue = (value?: number | string, unit?: string) => {
  if (value == null) return undefined;
  if (typeof value === "number") {
    const text = Math.abs(value) >= 10 ? value.toFixed(1) : value.toFixed(2);
    return unit ? `${text} ${unit}` : text;
  }
  return unit ? `${value} ${unit}` : value;
};


const formatLineMetric = (line: PathwayMetaboliteLineState) => {
  if (line.displayMetric === "foldChange") {
    return formatFoldChange(line.foldChange);
  }
  if (line.displayMetric === "zScore") {
    return formatValue(line.value, line.unit) ?? "-";
  }
  return formatValue(line.value, line.unit) ?? "-";
};

const formatLineNote = (line: PathwayMetaboliteLineState) => {
  if (line.displayMetric === "foldChange") {
    const raw = formatValue(line.value, line.unit);
    return raw ? `Value ${raw}` : undefined;
  }
  return undefined;
};

const formatRatioValue = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(2);
};

const formatRatioFormula = (ratio: PathwayRatioDefinition) => {
  const base = `${ratio.numeratorAnalyteId}/${ratio.denominatorAnalyteId}`;
  if (ratio.ratioTransform === "log") return `ln(${base})`;
  if (ratio.ratioTransform === "zscore") return `z-score(${base})`;
  return base;
};

const buildCalculationDetails = (definition: PathwayDefinition) => {
  const details: string[] = [];
  const scoreStrategy = definition.calculations.scoreStrategy;
  if (scoreStrategy === "redoxPressure") {
    details.push("Sigma is a weighted blend: core mean z (70%), ketone ratio z (20%), cytosolic ratio z (10%) when available.");
  } else if (scoreStrategy === "bcaaOxidation") {
    details.push("Sigma is a weighted blend: mean BCAA z (65%) plus mean catabolite z (35%) when available.");
  } else if (scoreStrategy === "aromaticBalance") {
    details.push("Sigma is a weighted blend: core mean z (70%), Phe:Tyr ratio z (20%), Kyn:Trp ratio z (10%) when available.");
  } else if (scoreStrategy === "nitricOxide") {
    details.push("Sigma blends core mean z (60%) with arginine ratio deltas (40%) when available.");
  } else if (scoreStrategy === "faOxGrouped") {
    details.push("Sigma blends grouped medians (medium 35%, long 20%, short 15%) plus anchors (C0 15%, C2 15%) with missing weights renormalized.");
  } else if (definition.calculations.pathwayScoreMethod === "weightedZ") {
    details.push("Sigma is the mean of available analyte z-scores.");
  } else if (definition.calculations.pathwayScoreMethod === "ratioZ") {
    details.push("Sigma uses the ratio z-score when available.");
  }
  details.push("Severity uses max |z|: >=2 significant, >=1 mild; otherwise stable.");
  details.push("Direction uses mean sigma: >= +0.5 elevated, <= -0.5 low.");
  const ratioDefinitions = definition.calculations.ratioDefinitions ?? (definition.calculations.ratioDefinition ? [definition.calculations.ratioDefinition] : []);
  if (ratioDefinitions.length > 0) {
    details.push(`Ratios: ${ratioDefinitions.map((ratio) => `${ratio.label} = ${formatRatioFormula(ratio)}`).join("; ")}`);
  }
  return details;
};

const toSeverity = (state: PathwayState): PathwaySeverity => {
  if (state.status !== "computed") return "Insufficient data";
  if (state.severity === "significant") return "Significant";
  if (state.severity === "mild") return "Mild";
  return "Stable";
};

const formatInsufficientCopy = (state: PathwayState) =>
  state.status === "insufficient_data"
    ? "Insufficient data (not included in this panel)."
    : "Insufficient data";

export function PathwayExplorer({ results, highlightedPathwayId, onAnalyteNavigate }: PathwayExplorerProps) {
  const [filter, setFilter] = useState<PathwayFilter>("All");

  const pathwayStates = useMemo(() => computePathwayStates(results ?? []), [results]);
  const summary = useMemo(() => summarizePathwayStates(pathwayStates), [pathwayStates]);
  const stateById = useMemo(() => new Map(pathwayStates.map((state) => [state.def.id, state])), [pathwayStates]);

  const orderedStates = useMemo(() => {
    return FRAMEWORK_SEQUENCE.flatMap((framework) => {
      const definitions = sortByOrder(framework);
      return definitions.map((definition) => stateById.get(definition.id)!).filter(Boolean);
    });
  }, [stateById]);

  const normalized = useMemo(() => {
    return orderedStates.map((state) => {
      const titlePrefix = `${state.def.framework}${String(state.def.order).padStart(2, "0")}`;
      const hasValue = (analyteId: string) => {
        const input = state.debug?.requiredInputs.find(
          (item) => normalizeName(item.analyteId) === normalizeName(analyteId),
        );
        if (input) {
          return Boolean(input.value != null || input.zScore != null);
        }
        return false;
      };
      const coreAnalytes = state.def.requiredAnalytes;
      const requiredInPanel = coreAnalytes.filter(isInPanel);
      const completeness = requiredInPanel.length ? computeCompleteness(requiredInPanel, hasValue) : undefined;
      const requiredAnalytes = coreAnalytes.map((analyteId) => {
        const metadata = ANALYTE_METADATA_BY_NORMALIZED.get(normalizeName(analyteId));
        const present = hasValue(analyteId);
        const reason: MissingReason | undefined = present
          ? undefined
          : isInPanel(analyteId)
            ? "missing_in_sample"
            : "missing_in_panel";
        return {
          id: analyteId,
          label: metadata?.displayName ?? analyteId,
          present,
          reason,
        };
      });
      const contextMarkers =
        state.def.id === "E4_AROMATIC"
          ? (state.debug?.optionalInputs ?? [])
              .filter((input) => input.value != null || input.zScore != null)
              .map((input) => ({
                id: input.analyteId,
                label: input.displayName,
              }))
          : [];
      const missingRequired = requiredAnalytes.filter((analyte) => !analyte.present);
      const coverageInputs = [...(state.debug?.requiredInputs ?? []), ...(state.debug?.optionalInputs ?? [])];
      const metaboliteLines = isComputedState(state) ? state.metaboliteLines : [];
      const coverageLines = metaboliteLines.length > 0 ? metaboliteLines : undefined;
      const coveragePresent = coverageLines
        ? coverageLines.filter((line) => !line.missing && (line.value != null || line.zScore != null)).length
        : coverageInputs.filter((input) => input.value != null || input.zScore != null).length;
      const coverageTotal = coverageLines ? coverageLines.length : coverageInputs.length;
      const coverageMissing =
        state.def.id === "A2_ETC"
          ? coverageLines
            ? coverageLines.filter((line) => line.missing).map((line) => line.displayLabel)
            : coverageInputs
                .filter((input) => input.value == null && input.zScore == null)
                .map((input) => input.displayName)
          : [];
      const optionalPresent = (state.debug?.optionalInputs ?? []).filter(
        (input) => input.value != null || input.zScore != null,
      ).length;
      const supportiveCount = optionalPresent;
      const stateLine =
        state.status === "computed"
          ? state.partial
            ? completeness
              ? `Partial score (${completeness.presentCount}/${completeness.requiredCount} core analytes)`
              : "Partial score (insufficient data)"
            : undefined
          : state.status === "insufficient_data"
            ? formatInsufficientCopy(state)
            : `Score unavailable — missing: ${
                missingRequired.length > 0
                  ? missingRequired.map((item) => item.label).join(", ")
                  : "required analytes"
              }`;
      const ratios = state.status === "computed"
        ? state.ratios ?? (state.ratio ? [state.ratio] : [])
        : [];
      const gshSupportingInputs = state.def.id === "B1_GSH"
        ? (state.debug?.optionalInputs ?? []).filter((input) => isInPanel(input.analyteId))
        : [];
      const gshSupportingPresent = gshSupportingInputs.filter(
        (input) => input.value != null || input.zScore != null,
      ).length;
      const gshSupportingTotal = gshSupportingInputs.length;
      const coverageLine =
        state.def.id === "B1_GSH" && gshSupportingTotal > 0
          ? `Coverage: ${gshSupportingPresent} / ${gshSupportingTotal}`
          : undefined;
      const ketoneRatioDebug = state.debug?.ratios?.find((ratio) => ratio.label === "Ketone redox ratio");
      const ketoneNumeratorValue =
        typeof ketoneRatioDebug?.numerator?.value === "number" ? ketoneRatioDebug.numerator.value : undefined;
      const ketoneDenominatorValue =
        typeof ketoneRatioDebug?.denominator?.value === "number" ? ketoneRatioDebug.denominator.value : undefined;
      const ketoneRawRatio =
        typeof ketoneNumeratorValue === "number" &&
        typeof ketoneDenominatorValue === "number" &&
        ketoneNumeratorValue > 0 &&
        ketoneDenominatorValue > 0
          ? ketoneNumeratorValue / ketoneDenominatorValue
          : undefined;
      const ketoneRatioLabel = "BHB/AcAc ratio";
      const ketoneRatio = ratios.find((ratio) => ratio.label === "Ketone redox ratio");
      const ketoneRatioValue =
        typeof ketoneRatio?.rawValue === "number"
          ? ketoneRatio.rawValue
          : ketoneRawRatio ?? (typeof ketoneRatio?.value === "number" ? Math.exp(ketoneRatio.value) : undefined);
      const ketoneLogRatio =
        typeof ketoneRatio?.value === "number"
          ? ketoneRatio.value
          : typeof ketoneRatioValue === "number" && ketoneRatioValue > 0
            ? Math.log(ketoneRatioValue)
            : undefined;
      const ktDebug =
        state.def.id === "C1_KYNURENINE"
          ? state.debug?.ratio ?? state.debug?.ratios?.find((ratio) => ratio.label === "K/T ratio")
          : undefined;
      const ktNumeratorValue =
        typeof ktDebug?.numerator?.value === "number" ? ktDebug.numerator.value : undefined;
      const ktDenominatorValue =
        typeof ktDebug?.denominator?.value === "number" ? ktDebug.denominator.value : undefined;
      const ktRatioMetrics =
        state.def.id === "C1_KYNURENINE" ? computeKTRatio(ktNumeratorValue, ktDenominatorValue) : undefined;
      const ktDisplayValue = ktRatioMetrics?.displayValue;
      const ktMetricLabel = state.def.metricLabel ?? "K/T (×1000)";
      const ktReferenceRangeLabel = state.def.referenceRangeLabel ?? "Typical range: 20–50 (×1000)";
      const ktSummaryText = state.def.education?.summary ?? state.def.interpretation;
      const ktKeyNumbers =
        state.def.id === "C1_KYNURENINE"
          ? [
              ...metaboliteLines
                .filter((line) => ["kynurenine", "tryptophan"].includes(normalizeName(line.analyteId)))
                .map((line) => ({
                  label: line.displayLabel,
                  value: formatValue(line.value, line.unit),
                  zScore: line.zScore,
                })),
              {
                label: ktMetricLabel,
                value: typeof ktDisplayValue === "number" ? `${ktDisplayValue}` : "Insufficient data",
                reference: ktReferenceRangeLabel,
                tooltip: state.def.education?.calculation,
              },
            ]
          : [];
      const ktAccordions: AccordionSection[] =
        state.def.id === "C1_KYNURENINE"
          ? [
              { title: "What this can mean", body: state.def.education?.whatMeans },
              { title: "Common non-disease reasons this changes", body: state.def.education?.nonDiseaseReasons },
              { title: "How to re-test for a cleaner baseline", body: state.def.education?.retest },
              { title: "References", kind: "references" },
            ]
          : [];
      const ktDisclaimer =
        state.def.education?.disclaimer ?? "This pattern is not diagnostic by itself.";
      const metricLine =
        state.def.id === "A2_ETC"
          ? typeof ketoneRatioValue === "number"
            ? `Metric: ${ketoneRatioLabel} ${formatRatioValue(ketoneRatioValue)}`
            : "Metric: BHB/AcAc ratio unavailable"
          : ratios.length > 0
            ? `Metric${ratios.length > 1 ? "s" : ""}: ${ratios
                .map((ratio) => {
                if (state.def.id === "C1_KYNURENINE" && ratio.label === "K/T ratio") {
                  return `K/T (×1000) ${typeof ktDisplayValue === "number" ? ktDisplayValue : "Insufficient data"}`;
                }
                  return `${ratio.label} ${formatRatioValue(ratio.value)}`;
                })
                .join(" · ")}`
            : undefined;
      const ketoneMaxZ =
        state.status === "computed"
          ? metaboliteLines
              .filter((line) => ["acetoacetic", "3hydroxybutyric"].includes(normalizeName(line.analyteId)))
              .map((line) => line.zScore)
              .filter((z): z is number => typeof z === "number")
              .sort((a, b) => Math.abs(b) - Math.abs(a))[0]
          : undefined;
      const summaryLine =
        state.def.id === "A2_ETC"
          ? undefined
          : state.def.id === "C1_KYNURENINE"
            ? undefined
            : [metricLine, coverageLine].filter(Boolean).join(" · ") || undefined;
      const ratioMetrics: PathwayMetric[] = [];
      if (state.status === "computed" && state.def.id === "A2_ETC") {
        if (ketoneRatio) {
          const ratioNote =
            typeof ketoneRatioValue === "number" &&
            typeof ketoneNumeratorValue === "number" &&
            typeof ketoneDenominatorValue === "number"
              ? `BHB/AcAc = ${formatRatioValue(ketoneNumeratorValue)} / ${formatRatioValue(
                  ketoneDenominatorValue,
                )} = ${formatRatioValue(ketoneRatioValue)} (typical range 0.8-2.0).`
              : "Typical range 0.8-2.0.";
          ratioMetrics.push({
            label: ketoneRatioLabel,
            value: typeof ketoneRatioValue === "number" ? formatRatioValue(ketoneRatioValue) : "Insufficient data",
            zScore: undefined,
            note: ratioNote,
            tooltip:
              "BDH1 reaction: AcAc + NADH <-> beta-hydroxybutyrate + NAD+ (Reactome R-HSA-73912). " +
              "Beta-hydroxybutyrate:acetoacetate ratio expected to reflect mitochondrial redox (Sci Rep 2019: https://www.nature.com/articles/s41598-019-39677-2).",
          });
        }
      }
      if (state.status === "computed" && state.def.id === "B1_GSH") {
        const gshRatio = ratios.find((ratio) => ratio.label === "GSH/GSSG ratio");
        if (gshRatio) {
          ratioMetrics.push({
            label: gshRatio.label,
            value: formatRatioValue(gshRatio.value),
            zScore: gshRatio.zScore,
            note: "Computed from reduced GSH and oxidized GSSG.",
            tooltip: "Computed as [Reduced GSH] ÷ [Oxidized GSSG] (molar).",
          });
        }
      }
      const metrics: PathwayMetric[] =
        state.status === "computed"
          ? [
              ...ratioMetrics,
              ...metaboliteLines.map((line) => ({
                label: line.displayLabel,
                value: formatLineMetric(line),
                zScore: line.missing ? undefined : line.zScore,
                note: line.missing ? "Missing value" : formatLineNote(line),
                onClick: onAnalyteNavigate
                  ? () => onAnalyteNavigate(normalizeName(line.analyteId))
                  : undefined,
              })),
            ]
          : missingRequired.map((missing) => ({
              label: missing.label,
              value: "Missing",
              note: formatMissingReason(missing.reason),
            }));
      const lineByNormalized = new Map<string, PathwayMetaboliteLineState>(
        metaboliteLines.map((line) => [normalizeName(line.analyteId), line]),
      );
      const a2KeyNumbers =
        state.def.id === "A2_ETC"
          ? (() => {
              const getLine = (analyteId: string) => lineByNormalized.get(normalizeName(analyteId));
              const bhbLine = getLine("3hydroxybutyric");
              const acacLine = getLine("acetoacetic");
              const succinateLine = getLine("succinic");
              const malateLine = getLine("malic");
              const formatKeyValue = (line?: PathwayMetaboliteLineState) =>
                line?.missing ? "Insufficient data" : formatValue(line?.value, line?.unit) ?? "Insufficient data";
              return [
                {
                  label: "Beta-hydroxybutyrate (uM)",
                  value: formatKeyValue(bhbLine),
                  zScore: bhbLine?.zScore,
                },
                {
                  label: "Acetoacetate (uM)",
                  value: formatKeyValue(acacLine),
                  zScore: acacLine?.zScore,
                },
                {
                  label: "Succinate (uM)",
                  value: formatKeyValue(succinateLine),
                  zScore: succinateLine?.zScore,
                },
                {
                  label: "Malate (uM)",
                  value: formatKeyValue(malateLine),
                  zScore: malateLine?.zScore,
                },
                {
                  label: "BHB/AcAc ratio",
                  value: typeof ketoneRatioValue === "number" ? formatRatioValue(ketoneRatioValue) : "Insufficient data",
                  meter: {
                    value: ketoneRatioValue,
                    lowLabel: "Low (more oxidized)",
                    midLabel: "Typical",
                    highLabel: "High (more reduced)",
                    min: 0.4,
                    max: 2.4,
                    typicalLow: 0.8,
                    typicalHigh: 2.0,
                    tooltip:
                      "This ratio can shift with fasting duration, diet, training, alcohol, and illness.",
                  },
                },
              ];
            })()
          : [];
      const faOxGroups =
        state.def.id === "A4_BETA_OX"
          ? [
              { label: "Anchors", analytes: ["carnitine", "acetylcarnitine"] },
              {
                label: "Short-chain",
                analytes: [
                  "propionylcarnitine",
                  "butyrylcarnitine",
                  "isobutyrylcarnitine",
                  "isovalerylcarnitine",
                  "valerylcarnitine",
                ],
              },
              {
                label: "Medium-chain",
                analytes: [
                  "hexanoylcarnitine",
                  "octanoylcarnitine",
                  "decanoylcarnitine",
                  "lauroylcarnitine",
                ],
              },
              {
                label: "Long-chain",
                analytes: ["myristoylcarnitine", "palmitoylcarnitine", "stearoylcarnitine"],
              },
            ]
          : [];
      const metricGroups =
        state.def.id === "A4_BETA_OX"
          ? faOxGroups
              .map((group) => ({
                label: group.label,
                items: group.analytes
                  .map((analyteId) => lineByNormalized.get(normalizeName(analyteId)))
                  .filter((line): line is PathwayMetaboliteLineState => Boolean(line))
                  .map((line) => ({
                    label: line.displayLabel,
                    value: line.missing ? "Missing" : formatLineMetric(line),
                    zScore: line.missing ? undefined : line.zScore,
                    note: line.missing ? "Missing" : formatLineNote(line),
                    onClick: onAnalyteNavigate
                      ? () => onAnalyteNavigate(normalizeName(line.analyteId))
                      : undefined,
                  })),
              }))
              .filter((group) => group.items.length > 0)
          : undefined;
      const faOxMissingMarkers =
        state.def.id === "A4_BETA_OX"
          ? coverageInputs
              .filter((input) => input.value == null && input.zScore == null)
              .map((input) => input.displayName)
          : undefined;
      const drivers =
        state.def.id === "C1_KYNURENINE"
          ? []
          : state.status === "computed"
            ? (() => {
                if (state.def.id === "A4_BETA_OX") {
                  const flags: string[] = [];
                  const faOx = state.debug?.faOxGrouped;
                  if (typeof faOx?.zMed === "number" && faOx.zMed >= 2) {
                    flags.push("Medium-chain accumulation pattern");
                  }
                  if (typeof faOx?.zC0 === "number" && faOx.zC0 <= -1.5) {
                    flags.push("Low free carnitine signal");
                  }
                  if (typeof faOx?.zLong === "number" && faOx.zLong >= 2) {
                    flags.push("Long-chain accumulation pattern");
                  }
                  if (flags.length > 0) return flags;
                }
                const baseDrivers = state.drivers?.length
                  ? state.drivers.map((driver) => ({
                      label: driver.displayLabel,
                      zScore: driver.zScore,
                    }))
                  : state.metaboliteLines
                      .filter((line) => typeof line.zScore === "number")
                      .map((line) => ({
                        label: line.displayLabel,
                        zScore: line.zScore,
                      }));
                return baseDrivers
                  .sort((a, b) => Math.abs(b.zScore ?? 0) - Math.abs(a.zScore ?? 0))
                  .slice(0, 3)
                  .map((driver) => {
                    const z = formatSignedZ(driver.zScore);
                    return z ? `${driver.label} ${z}σ` : driver.label;
                  });
              })()
            : [];
      const topDriver =
        state.status === "computed"
          ? state.metaboliteLines
              .filter((line) => typeof line.zScore === "number" && !line.missing)
              .sort((a, b) => Math.abs(b.zScore ?? 0) - Math.abs(a.zScore ?? 0))[0]
          : undefined;
      const driverLine =
        topDriver && typeof topDriver.zScore === "number"
          ? `Driver: ${topDriver.displayLabel} ${topDriver.zScore >= 0 ? "elevated" : "low"}`
          : undefined;
      const keyFinding =
        state.status === "computed" && state.def.id === "A2_ETC"
          ? state.metaboliteLines
              .filter((line) => !line.missing)
              .filter((line) => ["acetoacetic", "3hydroxybutyric"].includes(normalizeName(line.analyteId)))
              .sort((a, b) => Math.abs(b.zScore ?? 0) - Math.abs(a.zScore ?? 0))
              .slice(0, 1)
              .map((line) => ({
                label: line.displayLabel,
                value: formatValue(line.value, line.unit),
                zScore: line.zScore,
                note: "Suggests ketosis, fasting, or low-carb intake when elevated.",
              }))[0]
          : undefined;
      const interpretation =
        state.def.interpretation ??
        (state.status === "computed"
          ? toSeverity(state) === "Significant"
            ? "Pattern suggests a meaningful deviation from cohort ranges. Use alongside symptoms and clinical context."
            : toSeverity(state) === "Mild"
              ? "Small deviation from cohort ranges. Monitor trend and context over time."
              : "Within cohort range for the measured inputs."
          : "Score unavailable for this pathway. Missing inputs are listed below.");
      const actions =
        state.def.actions ??
        (state.status === "computed"
          ? [
              "Review alongside symptoms, meds, and recent training/diet.",
              "Re-test after a consistent recovery block.",
            ]
          : []);
      const ratioTypicalLow = 0.8;
      const ratioTypicalHigh = 2.0;
      const ketoneBadgeLabel =
        typeof ketoneMaxZ === "number"
          ? ketoneMaxZ >= 2
            ? "Ketones: Elevated"
            : ketoneMaxZ >= 1
              ? "Ketones: Mildly elevated"
              : ketoneMaxZ <= -1
                ? "Ketones: Lower than typical"
                : "Ketones: Within typical range"
          : "Ketones: Insufficient data";
      const ketoneBadgeTone: PathwaySummaryBadge["tone"] =
        ketoneBadgeLabel === "Ketones: Elevated"
          ? "destructive"
          : ketoneBadgeLabel === "Ketones: Mildly elevated"
            ? "secondary"
            : "outline";
      const ratioBadgeLabel =
        typeof ketoneRatioValue === "number"
          ? `BHB/AcAc: ${formatRatioValue(ketoneRatioValue)} (typical ${ratioTypicalLow}-${ratioTypicalHigh})`
          : "BHB/AcAc: Insufficient data";
      const summaryBadges: PathwaySummaryBadge[] | undefined =
        state.def.id === "A2_ETC"
          ? [
              { label: ketoneBadgeLabel, tone: ketoneBadgeTone },
              { label: ratioBadgeLabel, tone: "outline" },
            ]
          : undefined;
      const a2TechnicalDetails =
        state.def.id === "A2_ETC"
          ? typeof ketoneRatioValue === "number" &&
            typeof ketoneNumeratorValue === "number" &&
            typeof ketoneDenominatorValue === "number"
            ? [
                `BHB/AcAc ratio = ${formatFixed(ketoneNumeratorValue, 2)} / ${formatFixed(
                  ketoneDenominatorValue,
                  2,
                )} = ${formatFixed(ketoneRatioValue, 3)} (rounded to 2 decimals).`,
                `Scoring metric: ln(BHB/AcAc) = ln(${formatFixed(ketoneRatioValue, 3)}) = ${formatSignedNumber(
                  ketoneLogRatio,
                  3,
                )}.`,
                `Displayed ratio: ${formatRatioValue(ketoneRatioValue)}; displayed log metric: ${formatSignedNumber(
                  ketoneLogRatio,
                  2,
                )}.`,
              ]
            : [
                "Insufficient data to compute BHB/AcAc ratio (requires acetoacetate).",
                "Scoring metric uses ln(BHB/AcAc) when both analytes are present.",
              ]
          : [];
      const accordionSections: AccordionSection[] =
        state.def.id === "A2_ETC"
          ? [
              {
                title: "What this suggests",
                body:
                  "Elevated ketones usually mean fat is the main fuel right now. The BHB/AcAc ratio can shift with how long you fasted, training load, and recovery. A lower ratio can sometimes be seen when the body is under oxidative or recovery pressure, but it is not diagnostic by itself.",
              },
              {
                title: "Common non-disease reasons",
                body: [
                  "Fasting over 12 hours or skipping dinner",
                  "Low-carb/keto diet",
                  "Long cardio sessions or heavy training in the last 24-48 hours",
                  "Alcohol in the last 24-48 hours",
                  "Recent illness, poor sleep, or dehydration",
                ],
              },
              {
                title: "When to consider follow-up labs",
                body:
                  "If ketosis was not intentional or you have symptoms (thirst, frequent urination, nausea, confusion), discuss with a clinician. Consider fasting glucose + HbA1c; add ketones/glucose if unwell.",
              },
              {
                title: "How to re-test for a cleaner baseline",
                body:
                  "For a baseline draw: standardize fasting (8-12 hours), avoid heavy training for 24-48 hours, avoid alcohol for 48 hours, and keep caffeine timing consistent.",
              },
              {
                title: "Technical details (formula + scoring)",
                body: a2TechnicalDetails,
              },
              {
                title: "References",
                kind: "references",
              },
            ]
          : [];

      const baseSeverity = toSeverity(state);
      const severity =
        state.def.id === "A2_ETC" && state.status === "computed" && baseSeverity === "Stable" && state.category !== "stable"
          ? "Mild"
          : baseSeverity;
      const ktCalculationDetails = buildCalculationDetails(state.def);
      const calculationDetails =
        state.def.id === "C1_KYNURENINE" ? ktCalculationDetails : buildCalculationDetails(state.def);
      const calculationTitle =
        state.def.id === "C1_KYNURENINE" ? "How calculated" : "Calculation";
      const scoreTier = state.status === "computed" ? formatScoreTier(state.score) : undefined;
      const scoreTierTone = state.status === "computed" ? getScoreTierTone(scoreTier) : undefined;
      const statusLabel =
        state.def.id === "C1_KYNURENINE"
          ? state.status === "computed"
            ? severity
            : "Insufficient data"
          : scoreTier;
      const statusTone =
        state.def.id === "C1_KYNURENINE" ? undefined : scoreTierTone;
      const insufficientBanner =
        state.status === "insufficient_data"
          ? formatInsufficientCopy(state)
          : state.status === "insufficient" && state.reason === "not_implemented"
            ? "This pathway can't be scored with the current panel. Add sulfate + cysteine to enable scoring."
            : undefined;

      return {
        id: state.def.id,
        title: state.def.title,
        subtitle: state.def.subtitle ?? `${titlePrefix} · ${state.def.frameworkTitle}`,
        titleMetric: undefined,
        stateLine:
          state.def.id === "C1_KYNURENINE"
            ? undefined
            : isComputedState(state) && state.partial
              ? stateLine
              : driverLine ?? stateLine,
        summaryLine,
        flowLine: state.def.display.flowLabel,
        severity,
        statusLabel,
        statusTone,
        summaryBadges,
        metrics,
        metricGroups,
        missingMarkers: faOxMissingMarkers,
        summaryText: state.def.id === "C1_KYNURENINE" ? ktSummaryText : undefined,
        valueBadge:
          state.def.id === "C1_KYNURENINE"
            ? {
                label: ktMetricLabel,
                value: typeof ktDisplayValue === "number" ? `${ktDisplayValue}` : "Insufficient data",
                reference: ktReferenceRangeLabel,
              }
            : undefined,
        keyNumbers:
          state.def.id === "C1_KYNURENINE"
            ? ktKeyNumbers
            : state.def.id === "A2_ETC"
              ? a2KeyNumbers
              : undefined,
        accordionSections:
          state.def.id === "C1_KYNURENINE"
            ? ktAccordions
            : state.def.id === "A2_ETC"
              ? accordionSections
              : undefined,
        disclaimerText: state.def.id === "C1_KYNURENINE" ? ktDisclaimer : undefined,
        publications: state.def.publications ?? (state.def.pubmedPmids ?? []).map((pmid) => ({ pmid })),
        status: state.status,
        highlighted: highlightedPathwayId === state.def.id,
        drivers,
        interpretation,
        actions,
        contextMarkers,
        requiredAnalytes,
        completeness,
        supportiveCount,
        coverage: coverageTotal > 0 ? { present: coveragePresent, total: coverageTotal } : undefined,
        coverageMissing,
        coverageNote:
          state.def.id === "A4_BETA_OX" && optionalPresent === 0 ? "Partial coverage" : undefined,
        coverageHint:
          state.def.id === "A4_BETA_OX" && optionalPresent === 0
            ? "Add acylcarnitine species (C3–C18) to strengthen FAO inference."
            : undefined,
        keyFinding,
        calculationDetails,
        calculationTitle,
        showPublicationsInDetails: state.def.id !== "A2_ETC",
        insufficientBanner,
      };
    });
  }, [orderedStates, highlightedPathwayId, onAnalyteNavigate]);

  const significant = normalized.filter((pathway) => pathway.severity === "Significant");
  const mild = normalized.filter((pathway) => pathway.severity === "Mild");
  const visible =
    filter === "All" ? normalized : filter === "Significant" ? significant : mild;

  const hasResults = Boolean(results && results.length > 0);
  const filterOptions: Array<{ id: PathwayFilter; label: string; count: number }> = [
    { id: "All", label: "Total", count: summary.total },
    { id: "Significant", label: "Significant", count: summary.significant },
    { id: "Mild", label: "Mild", count: summary.mild },
  ];

  const noFilteredStates = filter !== "All" && visible.length === 0;

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pathway filters</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {filterOptions.map(({ id, label, count }) => (
              <Button
                key={id}
                type="button"
                variant={filter === id ? "default" : "outline"}
                className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
                onClick={() => setFilter(id)}
              >
                {label} ({count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {!hasResults && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-4 text-sm text-slate-600">
          Upload LC/MS metabolomics results to compute pathway statuses. Until then, every pathway
          appears in an incomplete state.
        </div>
      )}

      {noFilteredStates && (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600">
          No pathways match the current filter yet.
        </div>
      )}

      <div className="space-y-4">
        {visible.map((pathway, idx) => (
          <PathwayFrame
            key={pathway.id}
            id={pathway.id}
            title={pathway.title}
            subtitle={pathway.subtitle}
            titleMetric={pathway.titleMetric}
            stateLine={pathway.stateLine}
            summaryLine={pathway.summaryLine}
            flowLine={pathway.flowLine}
            severity={pathway.severity}
            statusLabel={pathway.statusLabel}
            statusTone={pathway.statusTone}
            summaryBadges={pathway.summaryBadges}
            status={pathway.status}
            insufficientBanner={pathway.insufficientBanner}
            metrics={pathway.metrics}
            metricGroups={pathway.metricGroups}
            publications={pathway.publications}
            defaultOpen={idx === 0}
            highlighted={pathway.highlighted}
            drivers={pathway.drivers}
            interpretation={pathway.interpretation}
            actions={pathway.actions}
            requiredAnalytes={pathway.requiredAnalytes}
            completeness={pathway.completeness}
            supportiveCount={pathway.supportiveCount}
            coverage={pathway.coverage}
            coverageMissing={pathway.coverageMissing}
            coverageNote={pathway.coverageNote}
            coverageHint={pathway.coverageHint}
            missingMarkers={pathway.missingMarkers}
            contextMarkers={pathway.contextMarkers}
            keyFinding={pathway.keyFinding}
            calculationDetails={pathway.calculationDetails}
            calculationTitle={pathway.calculationTitle}
            summaryText={pathway.summaryText}
            valueBadge={pathway.valueBadge}
            disclaimerText={pathway.disclaimerText}
            keyNumbers={pathway.keyNumbers}
            accordionSections={pathway.accordionSections}
            showPublicationsInDetails={pathway.showPublicationsInDetails}
          />
        ))}
      </div>
    </section>
  );
}
