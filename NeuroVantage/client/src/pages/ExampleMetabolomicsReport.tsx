import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PathwayFrame, type PathwaySeverity, type PathwaySummaryBadge } from "@/components/metabolomics/PathwayFrame";
import { DietSection, buildDietSummaryChips } from "@/components/report/diet/DietSection";
import { detectDietSignals } from "@/lib/diet/signals";
import { AlertTriangle, Share2, Table as TableIcon, Utensils } from "lucide-react";
import {
  summarizeDietSignals,
  summarizeKeyFindings,
} from "@/lib/report/summaryCounts";
import { computePathwayStates, summarizePathwayStates } from "@/lib/computePathwayState";
import { AnalyteSection } from "@/components/report/analytes/AnalyteSection";
import type { MetaboliteResult } from "@/lib/pathways/types";
import { mockMetabolomicsResults } from "@/data/mockMetabolomics";
import { formatZScore, hasMeasuredValue } from "@/lib/analytes/format";
import type { PathwayMetaboliteLineState, PathwayState, PathwayStateComputed } from "@/types/pathways";
import { ANALYTE_METADATA_BY_NORMALIZED } from "@/lib/analytes/metadata";
import { trackAppEvent } from "@/lib/events";
import { normalizeName } from "@/lib/analytes/normalize";
import { computeCompleteness } from "@/lib/metabolomics/completeness";
import { formatMissingReason, type MissingReason } from "@/lib/metabolomics/missing";
import { isInPanel } from "@/lib/metabolomics/panelCatalog";
import { computeKTRatio } from "@/lib/metabolomics/ratio";
import analytesDownloadUrl from "@/data/analytes.json?url";

const cliaMetadata = [
  { label: "Patient name", value: "George Augustine Washington" },
  { label: "Date of birth", value: "02/22/1732" },
  { label: "Sex", value: "Male" },
  { label: "Patient ID", value: "NV-PT-1093A" },
  { label: "Accession #", value: "ACC-764512" },
  { label: "Specimen type", value: "Plasma" },
  { label: "Collection date/time", value: "01/22/2026 · 08:42 AM PT" },
  { label: "Received date/time", value: "01/23/2026 · 11:15 AM PT" },
  { label: "Report date/time", value: "01/25/2026 · 05:02 PM PT" },
  { label: "Ordering physician", value: "Thomas Jefferson, MD (NPI 9995432100)" },
  { label: "Ordering facility", value: "NeuroVantage Concierge · NPI 1928374650" },
  { label: "Performing lab", value: "Synapta Lab Systems · 455 Mission St · San Francisco, CA" },
  { label: "CLIA ID", value: "05D1234567" },
  { label: "Test", value: "Targeted LC/MS Metabolomics Panel" },
];

const findingsRows = [
  {
    domain: "Energy + fatigue",
    markers: [
      { label: "NAD+/NADH ratio", value: "0.72 (ref 1.10–2.20)", flag: "Low" },
      { label: "Plasma lactate", value: "2.9 mmol/L (ref 0.5–2.0)", flag: "High" },
    ],
    recommendation: "Initiate 500 mg NR + 200 mg CoQ10 daily, add 3x weekly zone-2 cardio blocks, and reassess after 6 weeks.",
  },
  {
    domain: "Gut health",
    markers: [
      { label: "Butyrate", value: "45 µM (ref 60–110)", flag: "Low" },
      { label: "Indole-3-propionic acid", value: "0.92 µM (ref 1.5–3.0)", flag: "Low" },
    ],
    recommendation: "Increase resistant starch (40 g/day) and add a broad-spectrum polyphenol blend to drive SCFA recovery.",
  },
  {
    domain: "Sleep / mood",
    markers: [
      { label: "Kynurenine / tryptophan", value: "75 (ref 20–50)", flag: "High" },
      { label: "AM cortisol", value: "23 µg/dL (ref 6–18)", flag: "High" },
    ],
    recommendation: "Layer evening blue-light blocking, 200 mg phosphatidylserine at dusk, and monitor HRV trends nightly.",
  },
  {
    domain: "Detox",
    markers: [
      { label: "Reduced glutathione", value: "4.1 µM (ref 5.0–9.0)", flag: "Low" },
      { label: "Oxidized glutathione", value: "0.9 µM (ref 0.1–0.4)", flag: "High" },
    ],
    recommendation: "Add sulforaphane (broccoli sprout extract) + infrared sauna twice weekly to improve redox balance.",
  },
  {
    domain: "Diet quality",
    markers: [
      { label: "Omega-3 index", value: "5.1% (goal ≥8%)", flag: "Low" },
      { label: "Propionylcarnitine (C3)", value: "0.24 µM (ref 0.30–0.60)", flag: "Low" },
    ],
    recommendation: "Introduce 2g EPA/DHA daily and emphasize methyl-donor vegetables (beet, chard, spinach) at dinner.",
  },
];

const formatSigma = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}σ`;
};

const formatFoldChange = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value.toFixed(2)}x`;
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

const formatRatio = (numerator?: number, denominator?: number) => {
  if (typeof numerator !== "number" || typeof denominator !== "number" || denominator === 0) return undefined;
  return numerator / denominator;
};

const formatSignedNumber = (value: number | undefined, digits: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
};

const formatFixed = (value: number | undefined, digits: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
};

const toSeverity = (state: PathwayState): PathwaySeverity => {
  if (state.status !== "computed") return "Insufficient data";
  if (state.severity === "significant") return "Significant";
  if (state.severity === "mild") return "Mild";
  return "Stable";
};

const isComputedState = (state: PathwayState): state is PathwayStateComputed =>
  state.status === "computed";

const formatInsufficientCopy = (state: PathwayState) =>
  state.status === "insufficient_data"
    ? "Insufficient data (not included in this panel)."
    : "Insufficient data";

const formatStateLine = (state: PathwayState) => {
  if (state.status !== "computed") return formatInsufficientCopy(state);
  const sigma = formatSigma(state.sigma);
  if (state.category === "stable" && (state.severity === "significant" || state.severity === "mild")) {
    const label = state.severity === "significant" ? "Significant" : "Mild";
    return `${label} (${sigma})`;
  }
  if (state.category === "overactive") return `Elevated pattern (${sigma})`;
  if (state.category === "underactive") return `Underactive (${sigma})`;
  return `Stable (${sigma})`;
};

const analyteResults: MetaboliteResult[] = mockMetabolomicsResults;

const flagStyles: Record<string, string> = {
  High: "text-rose-300",
  Low: "text-amber-300",
  Normal: "text-emerald-300",
};

const SECTION_IDS = ["key", "pathways", "diet", "analytes"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_META: Record<SectionId, { label: string; subtitle: string; icon: typeof AlertTriangle }> = {
  key: {
    label: "Key findings",
    subtitle: "Condensed clinician-ready priorities",
    icon: AlertTriangle,
  },
  pathways: {
    label: "Pathways",
    subtitle: "Framework A–G view of metabolic flow",
    icon: Share2,
  },
  diet: {
    label: "Diet signals (non-diagnostic)",
    subtitle: "Heuristic dietary + microbiome context",
    icon: Utensils,
  },
  analytes: {
    label: "Analytes",
    subtitle: "Full metabolite roster + reference ranges",
    icon: TableIcon,
  },
};

type AccordionSection = {
  title: string;
  body?: string | string[];
  kind?: "text" | "list" | "references";
};

const buildKeyFindingChips = (summary: ReturnType<typeof summarizeKeyFindings>) => {
  const chips: string[] = [];
  chips.push(summary.count ? `${summary.count} item${summary.count === 1 ? "" : "s"}` : "No items");
  if (summary.highPriorityCount) chips.push(`${summary.highPriorityCount} high priority`);
  if (summary.retestHint) chips.push(summary.retestHint);
  return chips;
};

const buildPathwayChips = (summary: ReturnType<typeof summarizePathwayStates>) => {
  const chips = [`${summary.total} total`];
  if (summary.significant) chips.push(`${summary.significant} significant`);
  if (summary.mild) chips.push(`${summary.mild} mild`);
  if (summary.insufficient) chips.push(`${summary.insufficient} pending`);
  return chips;
};

const summarizeAnalyteResults = (results: MetaboliteResult[]) => {
  const measuredCount = results.filter((result) => hasMeasuredValue(result)).length;
  const abnormalCount = results.filter(
    (result) => typeof result.zScore === "number" && Math.abs(result.zScore) >= 1,
  ).length;
  return { measuredCount, abnormalCount };
};

const buildAnalyteChips = (summary: ReturnType<typeof summarizeAnalyteResults>) => [
  `${summary.measuredCount} measured`,
  `${summary.abnormalCount} out of range`,
];

const computeDefaultOpenSections = (
  key: ReturnType<typeof summarizeKeyFindings>,
  pathways: ReturnType<typeof summarizePathwayStates>,
  diet: ReturnType<typeof summarizeDietSignals>,
) => {
  const defaults: SectionId[] = [];
  if (key.count > 0) defaults.push("key");
  if (!defaults.length && pathways.significant > 0) defaults.push("pathways");
  if (diet.highCount > 0) defaults.push("diet");
  if (!defaults.length) defaults.push("key");
  return Array.from(new Set(defaults));
};

const isSectionId = (value: string): value is SectionId => SECTION_IDS.includes(value as SectionId);

type HeaderActionsProps = {
  printExpanded: boolean;
  pageCount: number | null;
  onTogglePrintExpanded: (value: boolean) => void;
  onPrint: () => void;
};

function HeaderActions({ printExpanded, pageCount, onTogglePrintExpanded, onPrint }: HeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="ghost" className="text-slate-300 hover:text-white" asChild>
        <Link href="/blood-testing">← Back to blood testing</Link>
      </Button>
      <div className="flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300">
        <Switch
          id="print-expanded-toggle"
          checked={printExpanded}
          onCheckedChange={onTogglePrintExpanded}
          className="data-[state=checked]:bg-emerald-500"
        />
        <label htmlFor="print-expanded-toggle" className="cursor-pointer select-none">
          Print expanded
        </label>
      </div>
      {printExpanded && (
        <span className="rounded-full border border-slate-800/60 bg-slate-900/30 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
          Estimated pages: {pageCount ?? "..."}
        </span>
      )}
      <Button
        className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        type="button"
        onClick={onPrint}
      >
        Print report (PDF)
      </Button>
    </div>
  );
}

export default function ExampleMetabolomicsReport() {
  const keySummary = useMemo(() => summarizeKeyFindings(findingsRows), []);
  const pathwayStates = useMemo(() => computePathwayStates(analyteResults), []);
  const pathwaySummary = useMemo(() => summarizePathwayStates(pathwayStates), [pathwayStates]);
  const dietDetection = useMemo(() => detectDietSignals(analyteResults), []);
  const dietSummary = useMemo(() => summarizeDietSignals(dietDetection.signals), [dietDetection]);
  const analyteSummary = useMemo(() => summarizeAnalyteResults(analyteResults), []);
  const defaultOpen = useMemo(
    () => computeDefaultOpenSections(keySummary, pathwaySummary, dietSummary),
    [keySummary, pathwaySummary, dietSummary],
  );
  const [openSections, setOpenSections] = useState<string[]>(defaultOpen);
  const [printExpanded, setPrintExpanded] = useState(false);
  const [pathwayFilter, setPathwayFilter] = useState<"All" | "Significant" | "Mild">("All");
  const preToggleOpenRef = useRef<string[]>(defaultOpen);
  const openSectionsRef = useRef(openSections);
  const beforePrintRestoreRef = useRef<string[]>(defaultOpen);
  const restoredRef = useRef(false);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [estimatedPages, setEstimatedPages] = useState<number | null>(null);

  const handlePrintReport = () => {
    void trackAppEvent({
      type: "METABOLOMICS_EXAMPLE_REPORT_DOWNLOADED",
      path: window.location.pathname,
      meta: { asset: "example-metabolomics-report" },
    });
    window.print();
  };

  const normalizedPathways = useMemo(() => {
    return pathwayStates.map((state) => {
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
      const missingRequired = requiredAnalytes.filter((analyte) => !analyte.present);
      const coverageInputs = [...(state.debug?.requiredInputs ?? []), ...(state.debug?.optionalInputs ?? [])];
      const coveragePresent = coverageInputs.filter((input) => input.value != null || input.zScore != null).length;
      const coverageTotal = coverageInputs.length;
      const metaboliteLines = isComputedState(state) ? state.metaboliteLines : [];
      const supportiveCount = (state.debug?.optionalInputs ?? []).filter(
        (input) => input.value != null || input.zScore != null,
      ).length;
      const stateLine =
        state.status === "computed"
          ? state.partial
            ? completeness
              ? `Partial score (${completeness.presentCount}/${completeness.requiredCount} core analytes)`
              : "Partial score (insufficient data)"
            : formatStateLine(state)
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
      const ketoneRatioDebug = state.debug?.ratios?.find((ratio) => ratio.label === "Ketone redox ratio");
      const ketoneNumeratorValue =
        typeof ketoneRatioDebug?.numerator?.value === "number" ? ketoneRatioDebug.numerator.value : undefined;
      const ketoneDenominatorValue =
        typeof ketoneRatioDebug?.denominator?.value === "number" ? ketoneRatioDebug.denominator.value : undefined;
      const ketoneRawRatio = formatRatio(ketoneNumeratorValue, ketoneDenominatorValue);
      const ketoneRatioState = ratios.find((ratio) => ratio.label === "Ketone redox ratio");
      const ketoneRatioValue =
        typeof ketoneRatioState?.rawValue === "number"
          ? ketoneRatioState.rawValue
          : ketoneRawRatio ?? (typeof ketoneRatioState?.value === "number" ? Math.exp(ketoneRatioState.value) : undefined);
      const ketoneLogRatio =
        typeof ketoneRatioState?.value === "number"
          ? ketoneRatioState.value
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
              { title: "What this can mean", body: state.def.education?.whatMeans, kind: "text" },
              { title: "Common non-disease reasons this changes", body: state.def.education?.nonDiseaseReasons, kind: "text" },
              { title: "How to re-test for a cleaner baseline", body: state.def.education?.retest, kind: "text" },
              { title: "References", kind: "references" },
            ]
          : [];
      const ktDisclaimer =
        state.def.education?.disclaimer ?? "This pattern is not diagnostic by itself.";
      const metricLine =
        ratios.length > 0
          ? `Metric${ratios.length > 1 ? "s" : ""}: ${ratios
              .map((ratio) => {
                if (state.def.id === "C1_KYNURENINE" && ratio.label === "K/T ratio") {
                  return `K/T (×1000) ${typeof ktDisplayValue === "number" ? ktDisplayValue : "Insufficient data"}`;
                }
                return `${ratio.label} ${formatRatioValue(ratio.value)}`;
              })
              .join(" · ")}`
          : undefined;
      const summaryLine =
        state.def.id === "A2_ETC"
          ? undefined
          : state.def.id === "C1_KYNURENINE"
            ? undefined
            : metricLine;
      const metrics =
        state.status === "computed"
          ? metaboliteLines
              .filter((line) => !line.missing)
              .map((line) => ({
                label: line.displayLabel,
                value: formatLineMetric(line),
                zScore: line.zScore,
                note: formatLineNote(line),
              }))
          : missingRequired.map((missing) => ({
              label: missing.label,
              value: "Missing",
              note: formatMissingReason(missing.reason),
            }));
      const lineByNormalized = new Map(
        metaboliteLines.map((line) => [normalizeName(line.analyteId), line]),
      );
      const ratioTypicalLow = 0.8;
      const ratioTypicalHigh = 2.0;
      const ketoneMaxZ =
        state.status === "computed"
          ? metaboliteLines
              .filter((line) => ["acetoacetic", "3hydroxybutyric"].includes(normalizeName(line.analyteId)))
              .map((line) => line.zScore)
              .filter((z): z is number => typeof z === "number")
              .sort((a, b) => Math.abs(b) - Math.abs(a))[0]
          : undefined;
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
                    typicalLow: ratioTypicalLow,
                    typicalHigh: ratioTypicalHigh,
                    tooltip:
                      "This ratio can shift with fasting duration, diet, training, alcohol, and illness.",
                  },
                },
              ];
            })()
          : [];
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
      const drivers =
        state.status === "computed"
          ? (state.drivers?.length
              ? state.drivers.map((driver) => ({
                  label: driver.displayLabel,
                  zScore: driver.zScore,
                }))
              : metaboliteLines
                  .filter((line) => typeof line.zScore === "number")
                  .map((line) => ({
                    label: line.displayLabel,
                    zScore: line.zScore,
                  })))
              .filter((driver) => typeof driver.zScore === "number")
              .sort((a, b) => Math.abs((b.zScore as number) ?? 0) - Math.abs((a.zScore as number) ?? 0))
              .slice(0, 3)
              .map((driver) => {
                const z = formatZScore(driver.zScore);
                return z && driver.zScore != null
                  ? `${driver.label} ${driver.zScore >= 0 ? "+" : ""}${z}σ`
                  : driver.label;
              })
          : [];
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

      const severity = toSeverity(state);
      const statusTone: PathwaySummaryBadge["tone"] =
        severity === "Significant" ? "destructive" : severity === "Mild" ? "secondary" : "outline";

      return {
        id: state.def.id,
        title: state.def.title,
        subtitle: state.def.subtitle ?? `${titlePrefix} · ${state.def.frameworkTitle}`,
        stateLine: state.def.id === "C1_KYNURENINE" ? undefined : stateLine,
        summaryLine,
        flowLine: state.def.display.flowLabel,
        severity,
        statusTone,
        statusLabel: state.def.id === "C1_KYNURENINE"
          ? state.status === "computed"
            ? severity
            : "Insufficient data"
          : undefined,
        summaryBadges,
        metrics,
        summaryText: state.def.id === "C1_KYNURENINE" ? ktSummaryText : undefined,
        valueBadge:
          state.def.id === "C1_KYNURENINE"
            ? {
                label: ktMetricLabel,
                value: typeof ktDisplayValue === "number" ? `${ktDisplayValue}` : "Insufficient data",
                reference: ktReferenceRangeLabel,
              }
            : undefined,
        disclaimerText: state.def.id === "C1_KYNURENINE" ? ktDisclaimer : undefined,
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
        showPublicationsInDetails: state.def.id !== "A2_ETC",
        publications: state.def.publications ?? (state.def.pubmedPmids ?? []).map((pmid) => ({ pmid })),
        status: state.status,
        insufficientBanner: state.status === "insufficient_data" ? formatInsufficientCopy(state) : undefined,
        drivers,
        interpretation,
        actions,
        requiredAnalytes,
        completeness,
        supportiveCount,
        coverage: coverageTotal > 0 ? { present: coveragePresent, total: coverageTotal } : undefined,
        coverageNote:
          state.def.id === "A4_BETA_OX" && supportiveCount === 0 ? "Partial coverage" : undefined,
        coverageHint:
          state.def.id === "A4_BETA_OX" && supportiveCount === 0
            ? "Add acylcarnitine species (C3–C18) to strengthen FAO inference."
            : undefined,
      };
    });
  }, [pathwayStates]);

  const significantPathways = normalizedPathways.filter((pathway) => pathway.severity === "Significant");
  const mildPathways = normalizedPathways.filter((pathway) => pathway.severity === "Mild");
  const visiblePathways =
    pathwayFilter === "All"
      ? normalizedPathways
      : pathwayFilter === "Significant"
        ? significantPathways
        : mildPathways;

  useEffect(() => {
    openSectionsRef.current = openSections;
  }, [openSections]);

  useEffect(() => {
    if (typeof window === "undefined" || restoredRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const queryOpen = params.get("open");
    let restored: string[] | undefined;
    if (queryOpen) {
      restored = queryOpen.split(",").filter(isSectionId);
    } else {
      try {
        const stored = window.localStorage?.getItem("nv-report-open");
        if (stored) {
          restored = (JSON.parse(stored) as string[]).filter(isSectionId);
        }
      } catch {
        restored = undefined;
      }
    }
    if (restored && restored.length > 0) {
      setOpenSections(restored);
    }
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (openSections.length > 0) {
      params.set("open", openSections.join(","));
    } else {
      params.delete("open");
    }
    const query = params.toString();
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", newUrl);
    window.localStorage?.setItem("nv-report-open", JSON.stringify(openSections));
  }, [openSections]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleBeforePrint = () => {
      beforePrintRestoreRef.current = openSectionsRef.current;
      setOpenSections([...SECTION_IDS]);
    };
    const handleAfterPrint = () => {
      if (!printExpanded) {
        setOpenSections(beforePrintRestoreRef.current);
      }
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printExpanded]);

  const estimatePageCount = useCallback(() => {
    if (typeof document === "undefined") return null;
    const root = reportRef.current;
    if (!root) return null;
    const probe = document.createElement("div");
    probe.style.width = "1in";
    probe.style.height = "1in";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);
    const inchPx = probe.offsetHeight || 96;
    document.body.removeChild(probe);
    const marginPx = inchPx * 0.5;
    const usablePageHeight = inchPx * 11 - marginPx * 2;
    const contentHeight = root.scrollHeight;
    return Math.max(1, Math.ceil(contentHeight / usablePageHeight));
  }, []);

  const recomputePageCount = useCallback(() => {
    if (!printExpanded) {
      setEstimatedPages(null);
      return;
    }
    const nextCount = estimatePageCount();
    setEstimatedPages(nextCount);
  }, [estimatePageCount, printExpanded]);

  useEffect(() => {
    if (!printExpanded) {
      setEstimatedPages(null);
      return;
    }
    const raf = window.requestAnimationFrame(recomputePageCount);
    window.addEventListener("resize", recomputePageCount);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", recomputePageCount);
    };
  }, [printExpanded, recomputePageCount]);

  useEffect(() => {
    if (!printExpanded) return;
    const raf = window.requestAnimationFrame(recomputePageCount);
    return () => window.cancelAnimationFrame(raf);
  }, [printExpanded, openSections, pathwayFilter, visiblePathways.length, recomputePageCount]);

  const handlePrintToggle = (value: boolean) => {
    setPrintExpanded(value);
    if (value) {
      preToggleOpenRef.current = openSections;
      setOpenSections([...SECTION_IDS]);
    } else {
      setOpenSections(preToggleOpenRef.current.length ? preToggleOpenRef.current : defaultOpen);
    }
  };

  const handleNavClick = (id: SectionId) => {
    setOpenSections((prev) => (prev.includes(id) ? prev : [...prev, id]));
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const atAGlanceItems = [
    keySummary.count
      ? `${keySummary.highPriorityCount || keySummary.count} key finding${keySummary.count > 1 ? "s" : ""} flagged.`
      : "No key findings logged yet.",
    pathwaySummary.significant
      ? `${pathwaySummary.significant} pathway${pathwaySummary.significant > 1 ? "s" : ""} significant (${pathwaySummary.mild} mild).`
      : pathwaySummary.mild
        ? `${pathwaySummary.mild} pathway${pathwaySummary.mild > 1 ? "s" : ""} mild.`
        : "Pathways currently within cohort range.",
    dietSummary.signalCount
      ? `${dietSummary.signalCount} diet signal${dietSummary.signalCount > 1 ? "s" : ""}${
          dietDetection.signals[0] ? `; top: ${dietDetection.signals[0].title}` : ""
        }`
      : "No diet signals detected.",
    `${analyteSummary.abnormalCount} of ${analyteSummary.measuredCount} analytes fall outside cohort range.`,
  ];

  const sections: { id: SectionId; chips: string[]; content: ReactNode }[] = [
    {
      id: "key",
      chips: buildKeyFindingChips(keySummary),
      content: (
        <div className="text-sm text-slate-300 space-y-4">
          <p>Simulated interpretation report combining LC/MS, cognitive scores, and clinician notes.</p>
          <div className="overflow-auto rounded-2xl border border-slate-800/60">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Domain</th>
                  <th className="py-2 pr-4">Key markers</th>
                  <th className="py-2">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {findingsRows.map((row) => (
                  <tr key={row.domain} className="border-t border-slate-800/70">
                    <td className="py-3 pr-4 font-semibold text-white">{row.domain}</td>
                    <td className="py-3 pr-4">
                      <ul className="space-y-1">
                        {row.markers.map((marker) => (
                          <li key={marker.label}>
                            <span className={`font-semibold ${flagStyles[marker.flag] ?? "text-slate-300"}`}>
                              {marker.flag}
                            </span>
                            <span className="text-slate-400"> · {marker.label}: {marker.value}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 text-slate-300">{row.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "pathways",
      chips: buildPathwayChips(pathwaySummary),
      content: (
        <div className="text-sm text-slate-300 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>Interactive frames visualize the relative flow of metabolites and cite supporting literature.</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "All", label: "Total", count: normalizedPathways.length },
                { id: "Significant", label: "Significant", count: significantPathways.length },
                { id: "Mild", label: "Mild", count: mildPathways.length },
              ].map(({ id, label, count }) => (
                <Button
                  key={id}
                  type="button"
                  variant={pathwayFilter === id ? "default" : "outline"}
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  onClick={() => setPathwayFilter(id as "All" | "Significant" | "Mild")}
                >
                  {label} ({count})
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {visiblePathways.map((pathway, index) => (
              <PathwayFrame
                key={pathway.id}
                id={pathway.id}
                title={pathway.title}
                subtitle={pathway.subtitle}
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
                summaryText={pathway.summaryText}
                valueBadge={pathway.valueBadge}
                disclaimerText={pathway.disclaimerText}
                keyNumbers={pathway.keyNumbers}
                accordionSections={pathway.accordionSections}
                showPublicationsInDetails={pathway.showPublicationsInDetails}
                publications={pathway.publications}
                defaultOpen={index === 0}
                forceOpen={printExpanded}
                drivers={pathway.drivers}
                interpretation={pathway.interpretation}
                actions={pathway.actions}
                requiredAnalytes={pathway.requiredAnalytes}
                completeness={pathway.completeness}
                supportiveCount={pathway.supportiveCount}
                coverage={pathway.coverage}
                coverageNote={pathway.coverageNote}
                coverageHint={pathway.coverageHint}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "diet",
      chips: buildDietSummaryChips(dietSummary),
      content: <DietSection results={analyteResults} forceExpanded={printExpanded} />,
    },
    {
      id: "analytes",
      chips: buildAnalyteChips(analyteSummary),
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p>All concentrations are plasma-adjusted and normalized to age/sex cohorts.</p>
          <AnalyteSection results={analyteResults} forceExpanded={printExpanded} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-950 text-white" ref={reportRef}>
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        <div className="flex flex-col gap-4 text-center">
        <HeaderActions
          printExpanded={printExpanded}
          pageCount={estimatedPages}
          onTogglePrintExpanded={handlePrintToggle}
          onPrint={handlePrintReport}
        />
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Example metabolomics report</p>
          <h1 className="text-4xl font-display text-white">Example NeuroVantage metabolomics report</h1>
          <p className="text-base text-slate-400 max-w-3xl mx-auto">
            This sample shows how LC/MS analytes roll up into pathway-level findings, tie directly to cognitive markers,
            and translate into clinician-ready actions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">CLIA-required identifiers</p>
            <p className="text-sm text-slate-400">Demo patient record for validation only — not for diagnostic use.</p>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <tbody>
                {cliaMetadata.map((row, index) => (
                  <tr key={row.label} className={index === 0 ? "" : "border-t border-slate-800/80"}>
                    <th className="py-2 pr-6 font-semibold text-slate-200 whitespace-nowrap align-top">{row.label}</th>
                    <td className="py-2 text-slate-300 align-top">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">At a glance</p>
          <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
            {atAGlanceItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          {sections.map((section) => (
            <button
              type="button"
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className="rounded-full border border-slate-800/70 bg-slate-900/50 px-4 py-1.5 font-semibold text-slate-200 transition hover:border-slate-700 hover:text-white"
            >
              {SECTION_META[section.id].label}
            </button>
          ))}
        </nav>

        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={(value) => setOpenSections(value as string[])}
          className="space-y-4"
        >
          {sections.map((section) => {
            const meta = SECTION_META[section.id];
            const Icon = meta.icon;
            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                id={`section-${section.id}`}
                className="border-b-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60"
              >
                <AccordionTrigger className="px-4 py-3 text-left text-base font-semibold text-white hover:no-underline">
                  <div className="flex w-full items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-400" />
                    <div className="flex flex-col">
                      <span>{meta.label}</span>
                      <span className="text-xs font-normal text-slate-400">{meta.subtitle}</span>
                    </div>
                    <div className="ml-auto mr-4 flex flex-wrap gap-2 text-xs font-medium text-slate-200 print:text-slate-700">
                      {section.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wide text-slate-200 print:hidden"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-6 pt-2">{section.content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400">Want to see your own metabolomics overlay inside NeuroVantage?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="px-8">
              <Link href="/blood-testing/waitlist">Join the waitlist</Link>
            </Button>
            <Button variant="outline" className="px-8" asChild>
              <Link href="/blood-testing">Return to blood testing overview</Link>
            </Button>
            <Button variant="outline" className="px-8" asChild>
              <a
                href={analytesDownloadUrl}
                download="analytes.json"
                onClick={() => {
                  void trackAppEvent({
                    type: "METABOLOMICS_EXAMPLE_REPORT_DOWNLOADED",
                    path: window.location.pathname,
                    meta: { asset: "analytes.json" },
                  });
                }}
              >
                Download analytes.json
              </a>
            </Button>
          </div>
          <HeaderActions
            printExpanded={printExpanded}
            pageCount={estimatedPages}
            onTogglePrintExpanded={handlePrintToggle}
            onPrint={handlePrintReport}
          />
        </div>
      </div>
    </div>
  );
}
