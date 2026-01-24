import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { sortEvidenceBySignificance, type DietEvidenceItem } from "@/lib/diet/format";

type EvidenceListProps = {
  items: DietEvidenceItem[];
  tone?: "light" | "dark";
};

const toneTokens = {
  light: {
    label: "text-slate-900",
    subtext: "text-slate-600",
    rowBorder: "border-slate-200",
    pill: "bg-slate-100 text-slate-800",
    arrowHigh: "text-rose-600",
    arrowLow: "text-sky-700",
  },
  dark: {
    label: "text-slate-100",
    subtext: "text-slate-400",
    rowBorder: "border-slate-800",
    pill: "bg-slate-800 text-slate-100",
    arrowHigh: "text-rose-300",
    arrowLow: "text-sky-300",
  },
};

export function EvidenceList({ items, tone = "light" }: EvidenceListProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(() => sortEvidenceBySignificance(items), [items]);
  const tokens = toneTokens[tone];

  if (sorted.length === 0) {
    return <p className={cn("text-sm", tokens.subtext)}>No direct analyte evidence captured.</p>;
  }

  return (
    <div className="space-y-2">
      {sorted.map((item, index) => {
        const hidden = !expanded && index >= 3;
        const valueText = item.value ? `${item.value}${item.unit ? ` ${item.unit}` : ""}` : undefined;
        const zText =
          item.zScore != null ? `z ${item.zScore >= 0 ? "+" : ""}${item.zScore.toFixed(1)}` : undefined;
        const isLow = item.direction === "down";
        const isHigh = item.direction === "up";
        const directionSymbol = isLow ? "↓" : isHigh ? "↑" : null;
        const directionClass = isLow ? tokens.arrowLow : isHigh ? tokens.arrowHigh : undefined;

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border px-3 py-2 text-sm",
              tokens.rowBorder,
              "flex flex-wrap items-center justify-between gap-2",
              hidden && "hidden print:flex print:flex-wrap print:items-center print:justify-between print:gap-2",
            )}
          >
            <div>
              <p className={cn("font-semibold", tokens.label)}>{item.label}</p>
              {valueText && <p className={cn("text-xs", tokens.subtext)}>{valueText}</p>}
            </div>
            <div className="flex items-center gap-2">
              {directionSymbol && <span className={cn("text-base", directionClass)}>{directionSymbol}</span>}
              {zText && (
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", tokens.pill)}>{zText}</span>
              )}
            </div>
          </div>
        );
      })}
      {sorted.length > 3 && (
        <button
          type="button"
          className={cn("text-xs font-semibold underline decoration-dotted underline-offset-4", tokens.label, "print:hidden")}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show top evidence only" : `Show all evidence (${sorted.length})`}
        </button>
      )}
    </div>
  );
}
