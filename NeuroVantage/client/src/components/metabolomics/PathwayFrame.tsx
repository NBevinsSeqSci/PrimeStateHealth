import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PublicationsLinks } from "@/components/pathways/PublicationsLinks";
import { formatZ } from "@/lib/metabolomics/format";
import { formatMissingReason, type MissingReason } from "@/lib/metabolomics/missing";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type PathwaySeverity = "Significant" | "Mild" | "Stable" | "Insufficient data";

export type PathwayMetric = {
  label: string;
  value?: string;
  zScore?: number;
  flag?: "High" | "Low" | "Normal" | string;
  onClick?: () => void;
  note?: string;
  tooltip?: string;
};

export type PathwayMetricGroup = {
  label: string;
  items: PathwayMetric[];
};

export type PathwaySummaryBadge = {
  label: string;
  tone?: "default" | "secondary" | "destructive" | "outline";
};

export type PathwayKeyFinding = {
  label: string;
  value?: string;
  zScore?: number;
  note?: string;
};

export type PathwayPublication = {
  pmid?: string;
  note?: string;
};

type PathwayValueBadge = {
  label: string;
  value?: string;
  reference?: string;
};

type PathwayRatioMeter = {
  value?: number;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
  min?: number;
  max?: number;
  typicalLow?: number;
  typicalHigh?: number;
  tooltip?: string;
};

type PathwayKeyNumber = {
  label: string;
  value?: string;
  reference?: string;
  zScore?: number;
  note?: string;
  tooltip?: string;
  meter?: PathwayRatioMeter;
};

type PathwayAccordionSection = {
  title: string;
  body?: string | string[];
  kind?: "text" | "list" | "references";
};

export type PathwayMarker = {
  id: string;
  label: string;
};

interface PathwayFrameProps {
  id: string;
  title: string;
  subtitle?: string;
  titleMetric?: string;
  stateLine?: string;
  summaryLine?: string;
  flowLine?: string;
  severity: PathwaySeverity;
  statusLabel?: string;
  statusTone?: "default" | "secondary" | "destructive" | "outline";
  status?: "computed" | "insufficient" | "insufficient_data";
  summaryBadges?: PathwaySummaryBadge[];
  metrics?: PathwayMetric[];
  metricGroups?: PathwayMetricGroup[];
  publications?: PathwayPublication[];
  defaultOpen?: boolean;
  forceOpen?: boolean;
  highlighted?: boolean;
  drivers?: string[];
  interpretation?: string;
  actions?: string[];
  requiredAnalytes?: Array<{ id: string; label: string; present: boolean; reason?: MissingReason }>;
  completeness?: { presentCount: number; requiredCount: number; pct: number };
  contextMarkers?: PathwayMarker[];
  supportiveCount?: number;
  coverage?: { present: number; total: number };
  coverageMissing?: string[];
  coverageNote?: string;
  coverageHint?: string;
  missingMarkers?: string[];
  keyFinding?: PathwayKeyFinding;
  insufficientBanner?: string;
  calculationDetails?: string[];
  calculationTitle?: string;
  summaryText?: string;
  valueBadge?: PathwayValueBadge;
  disclaimerText?: string;
  keyNumbers?: PathwayKeyNumber[];
  accordionSections?: PathwayAccordionSection[];
  showPublicationsInDetails?: boolean;
}

const SEVERITY_BADGE_VARIANTS: Record<PathwaySeverity, "default" | "secondary" | "destructive" | "outline"> = {
  Significant: "destructive",
  Mild: "secondary",
  Stable: "outline",
  "Insufficient data": "outline",
};

const FLAG_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  High: "destructive",
  Low: "secondary",
  Normal: "outline",
};

const Z_BADGE_VARIANTS: Record<"normal" | "mild" | "moderate" | "high", "default" | "secondary" | "destructive" | "outline"> = {
  normal: "outline",
  mild: "secondary",
  moderate: "default",
  high: "destructive",
};

const getZSeverity = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "normal";
  const abs = Math.abs(value);
  if (abs < 1) return "normal";
  if (abs < 2) return "mild";
  if (abs < 3) return "moderate";
  return "high";
};

const getMissingReasonBadge = (reason?: MissingReason) => {
  const label = formatMissingReason(reason);
  const isPanelMissing = reason === "missing_in_panel";
  return {
    label,
    className: isPanelMissing
      ? "border-slate-200 bg-slate-100 text-slate-600"
      : "border-amber-200 bg-amber-50 text-amber-700",
  };
};

export function PathwayFrame({
  id,
  title,
  subtitle,
  titleMetric,
  stateLine,
  summaryLine,
  flowLine,
  severity,
  statusLabel,
  statusTone,
  status: statusOverride,
  summaryBadges = [],
  metrics = [],
  metricGroups = [],
  publications = [],
  defaultOpen = false,
  forceOpen = false,
  highlighted = false,
  drivers = [],
  interpretation,
  actions = [],
  requiredAnalytes = [],
  completeness,
  contextMarkers = [],
  supportiveCount = 0,
  coverage,
  coverageMissing = [],
  coverageNote,
  coverageHint,
  missingMarkers = [],
  keyFinding,
  insufficientBanner,
  calculationDetails = [],
  calculationTitle = "Calculation",
  summaryText,
  valueBadge,
  disclaimerText,
  keyNumbers = [],
  accordionSections = [],
  showPublicationsInDetails = true,
}: PathwayFrameProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [missingOpen, setMissingOpen] = React.useState(false);
  const [tipsOpen, setTipsOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState<Record<string, boolean>>({});
  const [markersOpen, setMarkersOpen] = React.useState(false);
  const isOpen = forceOpen || open;
  const status = statusOverride ?? (severity === "Insufficient data" ? "insufficient" : "computed");
  const pmids = publications
    .map((entry) => entry.pmid)
    .filter((pmid): pmid is string => Boolean(pmid));
  const isIncomplete = status !== "computed";
  const missingRequired = requiredAnalytes.filter((analyte) => !analyte.present);
  const missingInPanel = missingRequired.some((analyte) => analyte.reason === "missing_in_panel");
  const completenessText = completeness
    ? `${completeness.presentCount}/${completeness.requiredCount} analytes`
    : undefined;
  const showCompleteness = status === "insufficient" && Boolean(completenessText);
  const showRequiredChips = id === "E4_AROMATIC" && requiredAnalytes.length > 0;
  const isKynurenine = id === "C1_KYNURENINE";
  const ktReferences = publications.filter((entry) => entry.pmid);
  const statusChip = typeof statusLabel === "string" ? statusLabel : `Overall: ${severity}`;
  const incompleteLabel = status === "insufficient_data"
    ? "Insufficient data"
    : missingInPanel
      ? "Unavailable"
      : "Incomplete";
  const statusChipTone = statusTone ?? SEVERITY_BADGE_VARIANTS[severity];
  const showDrivers = !isKynurenine && drivers.length > 0 && status === "computed" && (severity === "Significant" || severity === "Mild");
  const renderMetricRow = (metric: PathwayMetric, index: number, keyPrefix: string) => (
    <div
      key={`${id}-${keyPrefix}-${metric.label}-${index}`}
      className="rounded-2xl border border-slate-100 bg-white px-3 py-2 sm:px-4"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
        <div className="min-w-0">
          {metric.tooltip ? (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {metric.onClick ? (
                    <button
                      type="button"
                      className="text-left text-sm font-semibold text-emerald-700 hover:underline"
                      onClick={metric.onClick}
                    >
                      {metric.label}
                    </button>
                  ) : (
                    <span className="text-sm text-slate-700">{metric.label}</span>
                  )}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs text-slate-100">
                  {metric.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : metric.onClick ? (
            <button
              type="button"
              className="text-left text-sm font-semibold text-emerald-700 hover:underline"
              onClick={metric.onClick}
            >
              {metric.label}
            </button>
          ) : (
            <span className="text-sm text-slate-700">{metric.label}</span>
          )}
          {metric.note && <p className="text-xs text-slate-500">{metric.note}</p>}
        </div>
        <div className="flex items-center justify-between gap-3 sm:contents">
          <span className="font-mono text-sm tabular-nums text-slate-900 sm:text-right">
            {metric.value ?? "-"}
          </span>
          {typeof metric.zScore === "number" ? (
            <Badge
              variant={Z_BADGE_VARIANTS[getZSeverity(metric.zScore)]}
              className="rounded-full px-2 py-0.5 text-xs tabular-nums"
            >
              {formatZ(metric.zScore)}
            </Badge>
          ) : metric.flag ? (
            <Badge
              variant={FLAG_BADGE_VARIANTS[metric.flag] ?? "outline"}
              className="rounded-full px-2 py-0.5 text-xs"
            >
              {metric.flag}
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
  const getMeterPosition = (value?: number, min = 0, max = 1) => {
    if (typeof value !== "number" || Number.isNaN(value)) return null;
    if (max <= min) return null;
    const ratio = (value - min) / (max - min);
    return Math.min(Math.max(ratio, 0), 1);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={forceOpen ? undefined : setOpen}>
      <article
        id={`pathway-${id}`}
        className={cn(
          "rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5",
          highlighted && "ring-2 ring-emerald-400",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full flex-wrap items-start justify-between gap-3 text-left"
            aria-expanded={isOpen}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
                {titleMetric && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {titleMetric}
                  </span>
                )}
                {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
              </div>
              {summaryLine && <p className="text-sm font-medium text-slate-700">{summaryLine}</p>}
              {summaryText && <p className="text-sm leading-relaxed text-slate-700">{summaryText}</p>}
              {showDrivers && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Top drivers</span>
                  {drivers.map((driver) => (
                    <span
                      key={`${id}-${driver}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600"
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              )}
              {summaryBadges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {summaryBadges.map((badge) => (
                    <Badge
                      key={`${id}-${badge.label}`}
                      variant={badge.tone ?? "outline"}
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
              {coverage && (
                <p className="text-xs text-muted-foreground">
                  Coverage: {coverage.present} / {coverage.total} markers present
                  {coverageNote ? ` · ${coverageNote}` : ""}
                </p>
              )}
              {coverageMissing.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Missing markers: {coverageMissing.join(", ")}
                </p>
              )}
              {flowLine && (
                <p className="text-xs text-muted-foreground">
                  Pathway flow: <span className="font-mono">{flowLine}</span>
                </p>
              )}
              {coverageHint && <p className="text-xs text-muted-foreground">{coverageHint}</p>}
              {showRequiredChips && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {requiredAnalytes.map((analyte) => {
                    const missingBadge = analyte.present ? undefined : getMissingReasonBadge(analyte.reason);
                    return (
                      <span
                        key={`${id}-${analyte.id}`}
                        className={cn(
                          "rounded-full border px-2.5 py-1",
                          analyte.present
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : missingBadge?.className ?? "border-rose-200 bg-rose-50 text-rose-700",
                        )}
                      >
                        {analyte.present ? "✅" : analyte.reason === "missing_in_panel" ? "N/A" : "❌"} {analyte.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={statusChipTone}
                className="rounded-full px-3 py-1 text-xs font-semibold"
              >
                {isIncomplete
                  ? `${incompleteLabel}${showCompleteness ? ` (${completenessText})` : ""}`
                  : statusChip}
              </Badge>
              {valueBadge && (
                <span className="inline-flex flex-wrap items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  <span className="text-slate-500">Your value:</span>
                  <span className="ml-1 text-slate-900">
                    {valueBadge.label} {valueBadge.value ?? "-"}
                  </span>
                  {valueBadge.reference && (
                    <span className="ml-2 text-slate-500">{valueBadge.reference}</span>
                  )}
                </span>
              )}
              {stateLine && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {stateLine}
                </span>
              )}
              <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "rotate-180")} />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={cn("mt-4 space-y-4", isKynurenine && "px-6 sm:px-8")}>
            {isKynurenine && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Key numbers
                  </p>
                  {keyNumbers.length > 0 ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {keyNumbers.map((item) => (
                        <div key={`${id}-${item.label}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            {item.tooltip && (
                              <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-[10px] font-semibold text-slate-500"
                                      aria-label={`How we calculate ${item.label}`}
                                    >
                                      ?
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-xs text-slate-100">
                                    {item.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-lg font-semibold tabular-nums text-slate-900">
                              {item.value ?? "-"}
                            </span>
                            {typeof item.zScore === "number" && (
                              <Badge
                                variant={Z_BADGE_VARIANTS[getZSeverity(item.zScore)]}
                                className="rounded-full px-2 py-0.5 text-xs tabular-nums"
                              >
                                {formatZ(item.zScore)}
                              </Badge>
                            )}
                          </div>
                          {item.reference && <p className="mt-1 text-xs text-slate-500">{item.reference}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">No numeric details available.</p>
                  )}
                </div>
                {disclaimerText && <p className="text-xs text-slate-500">{disclaimerText}</p>}
                {accordionSections.length > 0 && (
                  <div className="space-y-2">
                    {accordionSections.map((section, index) => (
                      <details
                        key={`${id}-${section.title}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-white px-4 py-3"
                      >
                        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                          {section.title}
                        </summary>
                        <div className="mt-2 text-sm text-slate-600">
                          {section.kind === "references" ? (
                            ktReferences.length > 0 ? (
                              <div className="space-y-3">
                                {ktReferences.map((entry) => (
                                  <div key={`${entry.pmid}-${entry.note ?? ""}`} className="space-y-1">
                                    {entry.pmid && (
                                      <a
                                        href={`https://pubmed.ncbi.nlm.nih.gov/${entry.pmid}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-xs font-semibold text-emerald-700 hover:underline"
                                      >
                                        PMID {entry.pmid}
                                      </a>
                                    )}
                                    {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500">No references available.</p>
                            )
                          ) : Array.isArray(section.body) ? (
                            <ul className="space-y-2">
                              {section.body.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="text-slate-400">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="leading-relaxed">{section.body ?? "Content unavailable."}</p>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!isKynurenine && keyFinding && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Key finding</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                  <span>{keyFinding.label}</span>
                  <span className="font-mono tabular-nums">{keyFinding.value ?? "-"}</span>
                  {typeof keyFinding.zScore === "number" && (
                    <Badge
                      variant={Z_BADGE_VARIANTS[getZSeverity(keyFinding.zScore)]}
                      className="rounded-full px-2 py-0.5 text-xs tabular-nums"
                    >
                      {formatZ(keyFinding.zScore)}
                    </Badge>
                  )}
                </div>
                {keyFinding.note && <p className="mt-1 text-xs text-amber-700/80">{keyFinding.note}</p>}
              </div>
            )}
            {!isKynurenine && keyNumbers.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Key numbers
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {keyNumbers.map((item) => (
                    <div
                      key={`${id}-${item.label}`}
                      className={cn(
                        "rounded-2xl border border-slate-100 bg-white px-4 py-3",
                        item.meter && "sm:col-span-2",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm tabular-nums text-slate-900">
                            {item.value ?? "-"}
                          </span>
                          {typeof item.zScore === "number" && (
                            <Badge
                              variant={Z_BADGE_VARIANTS[getZSeverity(item.zScore)]}
                              className="rounded-full px-2 py-0.5 text-xs tabular-nums"
                            >
                              {formatZ(item.zScore)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {item.meter && (
                        <div className="mt-3 space-y-2">
                          <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-200 via-emerald-200 to-sky-200">
                            {getMeterPosition(
                              item.meter.value,
                              item.meter.min ?? 0,
                              item.meter.max ?? 1,
                            ) !== null && (
                              <span
                                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-slate-400 bg-white shadow"
                                style={{
                                  left: `calc(${(getMeterPosition(
                                    item.meter.value,
                                    item.meter.min ?? 0,
                                    item.meter.max ?? 1,
                                  ) ?? 0) * 100}% - 6px)`,
                                }}
                              />
                            )}
                            {typeof item.meter.typicalLow === "number" &&
                              typeof item.meter.typicalHigh === "number" && (
                                <span
                                  className="absolute top-0 h-full rounded-full bg-emerald-300/40"
                                  style={{
                                    left: `${Math.min(
                                      Math.max(
                                        ((item.meter.typicalLow - (item.meter.min ?? 0)) /
                                          ((item.meter.max ?? 1) - (item.meter.min ?? 0))) * 100,
                                        0,
                                      ),
                                      100,
                                    )}%`,
                                    width: `${Math.min(
                                      Math.max(
                                        ((item.meter.typicalHigh - item.meter.typicalLow) /
                                          ((item.meter.max ?? 1) - (item.meter.min ?? 0))) * 100,
                                        0,
                                      ),
                                      100,
                                    )}%`,
                                  }}
                                />
                              )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{item.meter.lowLabel}</span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <span>{item.meter.midLabel}</span>
                              {item.meter.tooltip && (
                                <TooltipProvider delayDuration={150}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help rounded-full border border-slate-200 px-1 text-[10px] text-slate-500">
                                        i
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs text-xs text-slate-100">
                                      {item.meter.tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <span>{item.meter.highLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!isKynurenine && insufficientBanner && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                {insufficientBanner}
              </div>
            )}
            {id === "E4_AROMATIC" && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Context markers ({contextMarkers.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {contextMarkers.length > 0 ? (
                    contextMarkers.map((marker) => (
                      <span key={`${id}-${marker.id}`} className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">
                        {marker.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No supporting markers detected.</span>
                  )}
                </div>
              </div>
            )}
            {!isKynurenine && requiredAnalytes.length > 0 && isIncomplete && (
              <div className="space-y-2">
                {completeness && (
                  <div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-emerald-400"
                        style={{ width: `${Math.round(completeness.pct * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Present: {completeness.presentCount} / {completeness.requiredCount} core analytes
                      {supportiveCount > 0 ? ` · +${supportiveCount} supportive analytes available` : ""}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  {requiredAnalytes.map((analyte) => {
                    const missingBadge = analyte.present ? undefined : getMissingReasonBadge(analyte.reason);
                    return (
                      <span
                        key={`${id}-${analyte.id}`}
                        className={cn(
                          "rounded-full border px-2.5 py-1",
                          analyte.present
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : missingBadge?.className ?? "border-rose-200 bg-rose-50 text-rose-700",
                        )}
                      >
                        {analyte.present ? "✅" : analyte.reason === "missing_in_panel" ? "N/A" : "❌"} {analyte.label}
                        {!analyte.present && missingBadge && (
                          <span
                            className={cn(
                              "ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              missingBadge.className,
                            )}
                          >
                            {missingBadge.label}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {!isKynurenine && metrics.length > 0 && (
              <Collapsible open={markersOpen} onOpenChange={setMarkersOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                  >
                    {markersOpen ? "Hide measured markers" : `Show all measured markers (${metrics.length})`}
                    <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", markersOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 space-y-2">
                    {metrics.map((metric, index) => (
                      <div
                        key={`${id}-marker-${metric.label}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-white px-3 py-2 sm:px-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{metric.label}</p>
                            {metric.note && <p className="text-xs text-slate-500">{metric.note}</p>}
                          </div>
                          <div className="text-right text-xs text-slate-600">
                            <p className="font-mono tabular-nums text-slate-900">{metric.value ?? "-"}</p>
                            {typeof metric.zScore === "number" && (
                              <p className="text-xs text-slate-500">{formatZ(metric.zScore)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
            {!isKynurenine && (
            <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  Details: analytes, calculations, references
                  <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", detailsOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Analyte concentrations
                    </p>
                    {metricGroups.length > 0 ? (
                      <div className="space-y-4">
                        {metricGroups.map((group) => (
                          <div key={`${id}-${group.label}`} className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                              {group.label}
                            </p>
                            <div className="space-y-2">
                              {group.items.map((metric, index) => renderMetricRow(metric, index, group.label))}
                            </div>
                          </div>
                        ))}
                        {missingMarkers.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Missing markers: {missingMarkers.join(", ")}
                          </p>
                        )}
                      </div>
                    ) : metrics.length > 0 ? (
                      <div className="space-y-2">
                        {metrics.map((metric, index) => renderMetricRow(metric, index, "metrics"))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No measured analyte values available.</p>
                    )}
                  </div>
                  {calculationDetails.length > 0 && (
                    <Card className="rounded-2xl border bg-background p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      {calculationTitle}
                    </p>
                      <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                        {calculationDetails.map((detail) => (
                          <li key={detail} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span className="max-w-prose">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                  {showPublicationsInDetails && (
                    <PublicationsLinks entries={publications} pmids={pmids} status={status} />
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
            )}
            {!isKynurenine && (interpretation || actions.length > 0 || isIncomplete) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {interpretation && (
                  <Card className="rounded-2xl border bg-background p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Interpretation
                    </p>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-foreground/90">{interpretation}</p>
                  </Card>
                )}
                {actions.length > 0 && !isIncomplete && (
                  <Card className="rounded-2xl border bg-background p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Actions</p>
                    <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                      {actions.map((action) => (
                        <li key={action} className="flex gap-2">
                          <span className="text-muted-foreground">✓</span>
                          <span className="max-w-prose">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
                {isIncomplete && status === "insufficient" && (
                  <Card className="rounded-2xl border bg-background p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Next steps</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setMissingOpen(true)}>
                        Add missing analytes to next draw
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTipsOpen(true)}>
                        View standardized collection tips
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
            {!isKynurenine && accordionSections.length > 0 && (
              <div className="space-y-2">
                {accordionSections.map((section, index) => {
                  const key = `${id}-${section.title}-${index}`;
                  const open = accordionOpen[key] ?? false;
                  return (
                    <Collapsible
                      key={key}
                      open={open}
                      onOpenChange={(nextOpen) =>
                        setAccordionOpen((prev) => ({ ...prev, [key]: nextOpen }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700"
                        >
                          {section.title}
                          <ChevronDown
                            className={cn("h-4 w-4 text-slate-500 transition-transform", open && "rotate-180")}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-slate-600">
                          {section.kind === "references" ? (
                            <PublicationsLinks entries={publications} pmids={pmids} status={status} />
                          ) : Array.isArray(section.body) ? (
                            <ul className="space-y-2">
                              {section.body.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="text-slate-400">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="leading-relaxed">{section.body ?? "Content unavailable."}</p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </article>
      <Dialog open={missingOpen} onOpenChange={setMissingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Missing analytes</DialogTitle>
            <DialogDescription>
              Add these analytes on the next draw to complete the pathway score.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-slate-600">
            {missingRequired.length > 0
              ? missingRequired.map((item) => {
                  const missingBadge = getMissingReasonBadge(item.reason);
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          missingBadge.className,
                        )}
                      >
                        {missingBadge.label}
                      </span>
                    </div>
                  );
                })
              : "No missing analytes listed."}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Standardized collection tips</DialogTitle>
            <DialogDescription>Keep pre-analytics consistent for comparability.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Fasting status consistency (if recommended).</li>
            <li>Time-of-day consistency.</li>
            <li>Avoid heavy exercise 24 hours prior.</li>
            <li>Note acute illness or inflammation.</li>
            <li>Record supplements that affect NO (L-arginine, citrulline, nitrates).</li>
          </ul>
        </DialogContent>
      </Dialog>
    </Collapsible>
  );
}
