import type { DietSignal } from "@/lib/diet/signals";
import { DietSignalRow } from "@/components/report/diet/DietSignalRow";

const CATEGORY_META: Record<DietSignal["category"], { label: string; description: string }> = {
  Deficiency: {
    label: "Deficiency / insufficiency heuristics",
    description: "Conservative, non-diagnostic patterns that may align with nutrient or cofactor gaps.",
  },
  DietSource: {
    label: "Recent diet or exposure signals",
    description: "Analytes shaped by near-term intake, fasting window, or supplements.",
  },
  Microbiome: {
    label: "Microbiome-linked diet patterns",
    description: "Metabolites influenced by gut fermentation, transit time, and diet quality.",
  },
  Macronutrient: {
    label: "Macronutrient patterns",
    description: "Signals pointing to broader macronutrient intake or methyl demand.",
  },
};

type DietSignalsSectionProps = {
  signals: DietSignal[];
  renalCaution: boolean;
  summaryText: string;
  interpretNote: string;
  strengthNote: string;
  summaryChips: string[];
  retestChips: string[];
  forceExpanded?: boolean;
};

export function DietSignalsSection({
  signals,
  renalCaution,
  summaryText,
  interpretNote,
  strengthNote,
  summaryChips,
  retestChips,
  forceExpanded = false,
}: DietSignalsSectionProps) {
  const grouped = signals.reduce<Record<DietSignal["category"], DietSignal[]>>(
    (acc, signal) => {
      if (!acc[signal.category]) acc[signal.category] = [];
      acc[signal.category].push(signal);
      return acc;
    },
    { Deficiency: [], Macronutrient: [], DietSource: [], Microbiome: [] },
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Diet summary</p>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-slate-500">
            {summaryChips.map((chip) => (
              <span key={chip} className="rounded-full border border-slate-200 px-2 py-1">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <p className="text-base text-slate-800">{summaryText}</p>
        <p className="text-sm text-muted-foreground">{interpretNote}</p>
        <p className="text-xs text-muted-foreground">{strengthNote}</p>
        {renalCaution && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Renal clearance markers are elevated; kidney function, hydration, or retention can inflate diet-related metabolites.
          </div>
        )}
      </div>

      {Object.entries(grouped).map(([category, categorySignals]) => {
        if (categorySignals.length === 0) return null;
        const meta = CATEGORY_META[category as DietSignal["category"]];
        return (
          <div key={category} className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{meta.description}</p>
            </div>
            <div className="space-y-4">
              {categorySignals.map((signal) => (
                <DietSignalRow key={signal.id} signal={signal} forceExpanded={forceExpanded} />
              ))}
            </div>
          </div>
        );
      })}

      {signals.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
          No high-confidence diet signals detected; interpret alongside intake history.
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Re-test standardization</p>
            <p className="text-xs text-muted-foreground">Use these steps when you want a baseline (not stress-response) draw.</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {retestChips.map((chip) => (
            <span key={chip} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
