import { Fragment, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyteRow } from "@/lib/analytes/types";
import { AnalyteRowDetails } from "@/components/report/analytes/AnalyteRowDetails";
import { findAnalyteMetadata } from "@/lib/analytes/metadata";
import { formatAnalyteValue, hasMeasuredValue } from "@/lib/analytes/format";

interface AnalyteTableProps {
  rows: AnalyteRow[];
  highlightedId?: string;
  forcePrint?: boolean;
  forceExpanded?: boolean;
  onPathwayNavigate?: (pathwayId: string) => void;
}

const renderValue = (row: AnalyteRow) => {
  const measured = hasMeasuredValue(row.result);
  if (!measured) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-base text-slate-900 tabular-nums">—</span>
        <span className="text-xs text-slate-500">Not reported</span>
      </div>
    );
  }
  const { value, unit } = formatAnalyteValue(row.result);
  return (
    <div className="flex flex-wrap items-baseline gap-2 font-mono text-base text-slate-900 tabular-nums">
      <span>{value ?? "—"}</span>
      {unit && <span className="font-sans text-xs text-slate-500">{unit}</span>}
    </div>
  );
};

const resolveFlag = (row: AnalyteRow): "High" | "Low" | undefined => {
  const z = row.result?.zScore;
  if (typeof z === "number") {
    if (z >= 1) return "High";
    if (z <= -1) return "Low";
  }
  return undefined;
};

const renderFlag = (row: AnalyteRow) => {
  const flag = resolveFlag(row);
  if (!flag) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const tone =
    flag === "High"
      ? "bg-rose-100 text-rose-800 border border-rose-200"
      : "bg-amber-100 text-amber-800 border border-amber-200";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>
      {flag}
    </span>
  );
};

const renderReferenceGauge = (row: AnalyteRow) => {
  const rangeLow = row.result?.refRange?.low;
  const rangeHigh = row.result?.refRange?.high;
  const numericValue = typeof row.result?.value === "number" ? row.result.value : undefined;
  const hasNumericRange =
    typeof rangeLow === "number" &&
    typeof rangeHigh === "number" &&
    Number.isFinite(rangeLow) &&
    Number.isFinite(rangeHigh) &&
    rangeHigh > rangeLow;
  if (!hasNumericRange || typeof numericValue !== "number") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const span = rangeHigh - rangeLow;
  const min = rangeLow - span;
  const max = rangeHigh + span;
  const normalized = max > min ? (numericValue - min) / (max - min) : 0.5;
  const gaugePosition = Math.min(1, Math.max(0, normalized));

  return (
    <div className="relative h-5 w-40">
      <div
        className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #ef4444 0%, #f59e0b 22%, #22c55e 50%, #f59e0b 78%, #ef4444 100%)",
        }}
      />
      <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${gaugePosition * 100}%` }}>
        <div className="flex flex-col items-center -translate-x-1/2">
          <div className="h-0 w-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-amber-400" />
          <div className="-mt-1 h-2.5 w-2.5 rounded-full bg-black" />
          <div className="-mt-1 h-0 w-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-amber-400" />
        </div>
      </div>
    </div>
  );
};

export function AnalyteTable({ rows, highlightedId, forcePrint, forceExpanded = false, onPathwayNavigate }: AnalyteTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (forcePrint) {
      setExpandedId(null);
    }
  }, [forcePrint]);

  const handleToggle = (id: string) => {
    if (forceExpanded) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Analyte</th>
            <th className="px-4 py-3 text-left font-semibold">Value</th>
            <th className="px-4 py-3 text-left font-semibold">Flag</th>
            <th className="px-4 py-3 text-left font-semibold">Reference Range</th>
            <th className="px-4 py-3 text-right font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isHighlighted = highlightedId === row.def.normalized;
            const shouldBreak = index > 0 && index % 30 === 0;
            const isExpanded = forceExpanded || expandedId === row.def.id;
            return (
              <Fragment key={row.def.id}>
                <tr
                  id={`analyte-${row.def.normalized}`}
                  className={cn(
                    "cursor-pointer border-t transition hover:bg-slate-50",
                    isHighlighted && "bg-amber-50",
                  )}
                  style={shouldBreak ? { breakBefore: "page" } : undefined}
                  onClick={() => handleToggle(row.def.id)}
                  aria-expanded={isExpanded}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.def.display}</td>
                  <td className="px-4 py-3">{renderValue(row)}</td>
                  <td className="px-4 py-3">{renderFlag(row)}</td>
                  <td className="px-4 py-3 text-slate-600">{renderReferenceGauge(row)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    <ChevronDown
                      className={cn(
                        "inline h-4 w-4 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-t">
                    <td colSpan={5} className="px-4 py-4">
                      <AnalyteRowDetails
                        row={row}
                        metadata={findAnalyteMetadata(row.def.id)}
                        onPathwayNavigate={onPathwayNavigate}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
