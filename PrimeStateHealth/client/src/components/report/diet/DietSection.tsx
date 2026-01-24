import type { MetaboliteResult } from "@/lib/pathways/types";
import {
  detectDietSignals,
  dietRetestChecklist,
  FISH_RETEST_STEP,
  POLYOL_RETEST_STEP,
  CAFFEINE_RETEST_STEP,
} from "@/lib/diet/signals";
import { summarizeDietSignals } from "@/lib/report/summaryCounts";
import { DietSignalsSection } from "@/components/report/diet/DietSignalsSection";

type DietSectionProps = {
  results?: MetaboliteResult[];
  patientContext?: Record<string, any>;
  forceExpanded?: boolean;
};

export function DietSection({ results = [], patientContext, forceExpanded = false }: DietSectionProps) {
  const { signals, renalCaution, hasFishSignal, hasPolyolSignal, hasCaffeineSignal } = detectDietSignals(
    results,
    patientContext,
  );
  const summary = summarizeDietSignals(signals);
  const deficiencyCount = signals.filter((signal) => signal.category === "Deficiency").length;
  const macronutrientCount = signals.filter((signal) => signal.category === "Macronutrient").length;
  const dietCount = signals.filter((signal) => signal.category === "DietSource").length;
  const microbiomeCount = signals.filter((signal) => signal.category === "Microbiome").length;

  const phrases: string[] = [];
  if (deficiencyCount > 0) phrases.push(`${deficiencyCount} potential insufficiency pattern${deficiencyCount > 1 ? "s" : ""}`);
  if (macronutrientCount > 0)
    phrases.push(`${macronutrientCount} macronutrient/methyl demand signal${macronutrientCount > 1 ? "s" : ""}`);
  if (dietCount > 0) phrases.push(`${dietCount} recent intake signal${dietCount > 1 ? "s" : ""}`);
  if (microbiomeCount > 0) phrases.push(`${microbiomeCount} microbiome-linked trend${microbiomeCount > 1 ? "s" : ""}`);

  const summaryText =
    phrases.length > 0
      ? `Detected ${phrases.join(", ")}. Confirm with intake history and standard labs before intervening.`
      : "No high-confidence diet signals detected; interpret alongside clinical history.";

  const interpretNote =
    "Heuristics linking analyte patterns to common diet and microbiome signals. Confirm with intake history and standard labs when relevant.";

  const signalStrengthNote =
    "Signal strength reflects how consistently the analyte pattern aligns with a diet-related explanation — it is not diagnostic.";

  const retestChips = Array.from(
    new Set([
      ...dietRetestChecklist,
      ...(hasFishSignal ? [FISH_RETEST_STEP] : []),
      ...(hasPolyolSignal ? [POLYOL_RETEST_STEP] : []),
      ...(hasCaffeineSignal ? [CAFFEINE_RETEST_STEP] : []),
    ]),
  );

  const summaryChips = buildDietSummaryChips(summary);

  return (
    <DietSignalsSection
      signals={signals}
      renalCaution={renalCaution}
      summaryText={summaryText}
      interpretNote={interpretNote}
      strengthNote={signalStrengthNote}
      summaryChips={summaryChips}
      retestChips={retestChips}
      forceExpanded={forceExpanded}
    />
  );
}

export const buildDietSummaryChips = (summary: ReturnType<typeof summarizeDietSignals>) => {
  const chips: string[] = [];
  chips.push(`${summary.signalCount} signal${summary.signalCount === 1 ? "" : "s"}`);
  if (summary.highCount) chips.push(`${summary.highCount} high`);
  if (summary.moderateCount) chips.push(`${summary.moderateCount} moderate`);
  if (summary.markerCount) chips.push(`${summary.markerCount} marker${summary.markerCount === 1 ? "" : "s"}`);
  if (summary.deficientCount) chips.push(`${summary.deficientCount} deficient`);
  if (summary.sufficientCount) chips.push(`${summary.sufficientCount} sufficient`);
  if (summary.indeterminateCount) chips.push(`${summary.indeterminateCount} indeterminate`);
  return chips;
};
