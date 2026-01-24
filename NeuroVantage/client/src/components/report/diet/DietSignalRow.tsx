import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DietSignal } from "@/lib/diet/signals";
import { EvidenceChip } from "@/components/report/diet/EvidenceChip";

const strengthClasses: Record<DietSignal["strength"], string> = {
  High: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Moderate: "bg-amber-100 text-amber-800 border border-amber-200",
  Low: "bg-slate-100 text-slate-700 border border-slate-200",
};

const statusClasses = {
  Deficient: "bg-rose-100 text-rose-800 border border-rose-200",
  Sufficient: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Indeterminate: "bg-slate-100 text-slate-700 border border-slate-200",
};

export function DietSignalRow({ signal, forceExpanded = false }: { signal: DietSignal; forceExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = forceExpanded || expanded;
  const extraEvidence = signal.allEvidence?.slice(signal.topEvidence.length) ?? [];

  const extraSteps = signal.nextSteps.slice(2);
  const showMore = extraEvidence.length > 0 || extraSteps.length > 0 || signal.caveats.length > 0;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
      <div className="space-y-4 md:grid md:grid-cols-12 md:gap-4 md:space-y-0">
        <div className="space-y-2 md:col-span-3">
          <p className="text-base font-semibold text-slate-900">{signal.title}</p>
          <div className="flex flex-wrap gap-2">
            <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", strengthClasses[signal.strength])}>
              Signal strength: {signal.strength}
            </span>
            {signal.statusMarker && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  statusClasses[signal.statusMarker.status],
                )}
              >
                {signal.statusMarker.label}: {signal.statusMarker.status}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 md:col-span-3">
          <p className="text-sm text-slate-700">{signal.takeaway}</p>
          {signal.contextFlags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {signal.contextFlags.map((chip) => (
                <span key={chip} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Top evidence</p>
          {signal.topEvidence.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {signal.topEvidence.map((item) => (
                <EvidenceChip key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No direct analyte evidence captured.</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Practical next steps</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {signal.nextSteps.slice(0, 2).map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          {!forceExpanded && showMore && (
            <button
              type="button"
              className="text-xs font-semibold text-slate-600 underline decoration-dotted underline-offset-4"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {isExpanded ? "Hide" : "More"}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          {extraEvidence.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Additional evidence</p>
              <div className="flex flex-wrap gap-2">
                {extraEvidence.map((item) => (
                  <EvidenceChip key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
          {extraSteps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Extended next steps</p>
              <ul className="space-y-1">
                {extraSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {signal.caveats.length > 0 && (
            <div className="space-y-1 text-xs text-slate-500">
              <p className="font-semibold uppercase tracking-[0.3em] text-slate-500">Caveats</p>
              {signal.caveats.map((caveat) => (
                <p key={caveat}>{caveat}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
