import { cn } from "@/lib/utils";
import type { DietEvidenceItem } from "@/lib/diet/format";

export function EvidenceChip({ item }: { item: DietEvidenceItem }) {
  if (!item) return null;
  const label = item.label ?? item.analyte;
  const valueText = item.value ? `${item.value}${item.unit ? ` ${item.unit}` : ""}` : undefined;
  const zText =
    item.zScore != null ? `(z ${item.zScore >= 0 ? "+" : ""}${item.zScore.toFixed(1)})` : undefined;

  return (
    <span
      className={cn(
        "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700",
        "whitespace-nowrap",
      )}
    >
      <span className="text-slate-900">{label}</span>
      {valueText && <span className="ml-1 font-normal text-slate-600">{valueText}</span>}
      {zText && <span className="ml-1 font-normal text-slate-500">{zText}</span>}
    </span>
  );
}
