import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PublicationsLinks } from "@/components/pathways/PublicationsLinks";
import { formatZScore } from "@/lib/analytes/format";
import { normalizeName } from "@/lib/analytes/normalize";
import { formatZ } from "@/lib/metabolomics/format";
import { cn } from "@/lib/utils";
import type { PathwayMetaboliteLineState, PathwayState } from "@/types/pathways";

const OVERALL_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  significant: "destructive",
  mild: "secondary",
  normal: "outline",
  insufficient: "outline",
};

const Z_SEVERITY_VARIANTS: Record<"normal" | "mild" | "moderate" | "high", "default" | "secondary" | "destructive" | "outline"> = {
  normal: "outline",
  mild: "secondary",
  moderate: "default",
  high: "destructive",
};

const formatFoldChange = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
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

const formatRatioValue = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(2);
};

const formatLineMetric = (line: PathwayMetaboliteLineState) => {
  if (line.displayMetric === "foldChange") {
    return formatFoldChange(line.foldChange);
  }
  if (line.displayMetric === "zScore") {
    const z = formatZScore(line.zScore);
    return z ? `${z}σ` : "—";
  }
  return formatValue(line.value, line.unit) ?? "—";
};

const formatRefRange = (range?: { low?: number; high?: number }) => {
  if (!range || (range.low == null && range.high == null)) return null;
  if (range.low != null && range.high != null) return `${range.low}–${range.high}`;
  if (range.low != null) return `≥ ${range.low}`;
  if (range.high != null) return `≤ ${range.high}`;
  return null;
};

const getZSeverity = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "normal";
  const abs = Math.abs(value);
  if (abs < 1) return "normal";
  if (abs < 2) return "mild";
  if (abs < 3) return "moderate";
  return "high";
};

const formatStateLabel = (state: Extract<PathwayState, { status: "computed" }>) => {
  const sigma = formatZ(state.sigma);
  if (state.category === "stable" && (state.severity === "significant" || state.severity === "mild")) {
    const label = state.severity === "significant" ? "Significant" : "Mild";
    return `${label} (${sigma})`;
  }
  if (state.category === "overactive") return `Elevated pattern (${sigma})`;
  if (state.category === "underactive") return `Underactive (${sigma})`;
  return `Stable (${sigma})`;
};

interface PathwayFrameProps {
  state: PathwayState;
  highlighted?: boolean;
  onAnalyteNavigate?: (normalizedName: string) => void;
}

export function PathwayFrame({ state, highlighted, onAnalyteNavigate }: PathwayFrameProps) {
  const { def } = state;
  const titlePrefix = `${def.framework}${String(def.order).padStart(2, "0")}`;
  const statusChip =
    state.status === "computed" ? state.severity : "insufficient";
  const insufficientCopy =
    state.status === "insufficient_data"
      ? "Insufficient data (not included in this panel)."
      : "Insufficient data";
  const debugEnabled = import.meta.env?.DEV || import.meta.env?.VITE_SHOW_DEBUG === "true";
  const computedState = state.status === "computed" ? state : null;
  const ratios = useMemo(() => {
    if (!computedState) return [];
    return computedState.ratios ?? (computedState.ratio ? [computedState.ratio] : []);
  }, [computedState]);
  const ratioRefRanges = useMemo(() => ratios.map((ratio) => formatRefRange(ratio.refRange)), [ratios]);
  const coverageInputs = [...(state.debug?.requiredInputs ?? []), ...(state.debug?.optionalInputs ?? [])];
  const coveragePresent = coverageInputs.filter((input) => input.value != null || input.zScore != null).length;
  const coverageTotal = coverageInputs.length;
  const optionalPresent = (state.debug?.optionalInputs ?? []).filter(
    (input) => input.value != null || input.zScore != null,
  ).length;
  const showCoverage = coverageTotal > 0;
  const showPartialHint = def.id === "A4_BETA_OX" && optionalPresent === 0 && showCoverage;
  const isAromaticBalance = def.id === "E4_AROMATIC";
  const requiredMarkers = isAromaticBalance
    ? (state.debug?.requiredInputs ?? []).map((input) => ({
        label: input.displayName,
        present: input.value != null || input.zScore != null,
      }))
    : [];
  const supportingMarkers = isAromaticBalance
    ? (state.debug?.optionalInputs ?? []).filter((input) => input.value != null || input.zScore != null)
    : [];

  return (
    <article
      id={`pathway-${def.id}`}
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:p-5",
        highlighted && "ring-2 ring-emerald-400",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span>{titlePrefix}</span>
            <span>·</span>
            <span>{def.frameworkTitle}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{def.title}</h2>
            {def.subtitle && <span className="text-sm text-muted-foreground">{def.subtitle}</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={OVERALL_BADGE_VARIANTS[statusChip]}
            className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
          >
            {state.status === "computed" ? `Overall: ${state.severity}` : "Insufficient"}
          </Badge>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
            {state.status === "computed"
              ? formatStateLabel(state)
              : insufficientCopy}
          </span>
        </div>
      </div>
      {showCoverage && (
        <p className="mt-2 text-xs text-muted-foreground">
          Coverage: {coveragePresent} / {coverageTotal} markers present
          {showPartialHint ? " · Partial coverage" : ""}
        </p>
      )}
      {def.display.flowLabel && (
        <p className="mt-2 text-xs text-muted-foreground">
          Pathway flow: <span className="font-mono">{def.display.flowLabel}</span>
        </p>
      )}
      {showPartialHint && (
        <p className="mt-2 text-xs text-muted-foreground">
          Add acylcarnitine species (C3–C18) to strengthen FAO inference.
        </p>
      )}
      {isAromaticBalance && requiredMarkers.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Required</p>
          <div className="flex flex-wrap gap-2">
            {requiredMarkers.map((marker) => (
              <Badge
                key={marker.label}
                variant="secondary"
                className={cn(
                  "rounded-full px-3 py-1 text-xs",
                  marker.present ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800",
                )}
              >
                {marker.label}
                <span className="ml-1">{marker.present ? "✓" : "✕"}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
      {isAromaticBalance && (
        <details className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Context markers ({supportingMarkers.length})
          </summary>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
            {supportingMarkers.length > 0 ? (
              supportingMarkers.map((marker) => (
                <Badge key={marker.analyteId} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {marker.displayName}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-500">No supporting markers detected.</p>
            )}
          </div>
        </details>
      )}
      {ratios.length > 0 && (
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Metric{ratios.length > 1 ? "s" : ""}
          </p>
          {state.status === "computed" ? (
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              {ratios.map((ratio, index) => (
                <div key={ratio.label} className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-900">{ratio.label}</span>
                  <span className="font-mono text-slate-900">{formatRatioValue(ratio.value)}</span>
                  {ratioRefRanges[index] && (
                    <span className="text-xs text-slate-500">ref {ratioRefRanges[index]}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">{insufficientCopy}</p>
          )}
        </div>
      )}
      <div className="mt-4 space-y-3">
        {state.status === "computed" ? (
          state.metaboliteLines.filter((line) => !line.missing).length > 0 ? (
            <ul className="space-y-2">
              {state.metaboliteLines.filter((line) => !line.missing).map((line) => {
                const zSeverity = getZSeverity(line.zScore);
                const zVariant = Z_SEVERITY_VARIANTS[zSeverity];
                const valueLabel =
                  line.displayMetric === "zScore" ? formatValue(line.value, line.unit) ?? "—" : formatLineMetric(line);
                const showSecondaryValue = line.displayMetric === "foldChange" && line.value != null;
                return (
                  <li
                    key={`${state.def.id}-${line.analyteId}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2 sm:px-4"
                  >
                    <button
                      type="button"
                      className="w-full rounded-2xl px-2 py-2 text-left transition hover:bg-muted/60"
                      onClick={() => onAnalyteNavigate?.(normalizeName(line.analyteId))}
                    >
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
                        <span className="text-sm font-semibold text-slate-900">{line.displayLabel}</span>
                        <div className="flex items-center justify-between gap-3 sm:contents">
                          <div className="text-sm font-mono tabular-nums text-slate-900 sm:text-right">
                            {valueLabel}
                            {showSecondaryValue && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {formatValue(line.value, line.unit)}
                              </span>
                            )}
                          </div>
                          <Badge
                            variant={zVariant}
                            className="rounded-full px-2 py-0.5 text-xs tabular-nums sm:justify-self-end"
                          >
                            {formatZ(line.zScore)}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              No contributing analytes were detected for this pathway.
            </p>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">{insufficientCopy}</p>
            {state.missingAnalytes.length > 0 && (
              <p className="text-xs text-slate-500">
                Missing: {state.missingAnalytes.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <PublicationsLinks entries={def.publications} pmids={def.pubmedPmids} status={state.status} />
      </div>
      {debugEnabled && state.debug && (
        <details className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-xs text-slate-600">
          <summary className="cursor-pointer font-semibold text-slate-700">Debug</summary>
          <div className="mt-3 space-y-2 font-mono">
            <p>Score method: {state.debug.scoreMethod}</p>
            {state.debug.sigma != null && <p>Sigma: {state.debug.sigma.toFixed(2)}</p>}
            {state.debug.score != null && <p>Score: {state.debug.score.toFixed(2)}</p>}
            <div>
              <p className="font-semibold">Required inputs</p>
              <ul className="mt-1 space-y-1">
                {state.debug.requiredInputs.map((input) => (
                  <li key={input.analyteId}>
                    {input.displayName}: {formatValue(input.value, input.unit) ?? "—"} · z{" "}
                    {formatZScore(input.zScore) ?? "—"}
                  </li>
                ))}
              </ul>
            </div>
            {state.debug.optionalInputs.length > 0 && (
              <div>
                <p className="font-semibold">Optional inputs</p>
                <ul className="mt-1 space-y-1">
                  {state.debug.optionalInputs.map((input) => (
                    <li key={input.analyteId}>
                      {input.displayName}: {formatValue(input.value, input.unit) ?? "—"} · z{" "}
                      {formatZScore(input.zScore) ?? "—"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {state.debug.ratio && (
              <div>
                <p className="font-semibold">Ratio</p>
                <p>
                  {state.debug.ratio.numerator?.displayName ?? "—"} /{" "}
                  {state.debug.ratio.denominator?.displayName ?? "—"} ={" "}
                  {state.debug.ratio.value != null ? state.debug.ratio.value.toFixed(4) : "—"}
                </p>
              </div>
            )}
            {state.debug.ratios && (
              <div>
                <p className="font-semibold">Ratios</p>
                {state.debug.ratios.map((ratio) => (
                  <p key={ratio.label}>
                    {ratio.label}: {ratio.numerator?.displayName ?? "—"} /{" "}
                    {ratio.denominator?.displayName ?? "—"} ={" "}
                    {ratio.value != null ? ratio.value.toFixed(4) : "—"}
                  </p>
                ))}
              </div>
            )}
          </div>
        </details>
      )}
    </article>
  );
}
