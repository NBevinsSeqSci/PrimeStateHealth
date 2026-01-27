"use client";

import SignupEnticement from "@/components/SignupEnticement";
import StroopTest from "@/components/tests/StroopTest";
import TestScaffold from "@/components/tests/TestScaffold";

const MAX_STROOP_SCORE = 15 * 160;

// Simple percentile calculation based on score
// These are placeholder values - can be refined with actual normative data
function getExecutivePercentile(score: number): number {
  if (score >= 95) return 95;
  if (score >= 90) return 90;
  if (score >= 80) return 80;
  if (score >= 70) return 70;
  if (score >= 60) return 60;
  if (score >= 50) return 50;
  if (score >= 40) return 40;
  if (score >= 30) return 30;
  if (score >= 20) return 20;
  return 10;
}

export default function ExecutivePage() {
  return (
    <TestScaffold
      title="Executive Function"
      description="Stroop task (focus + inhibition). Free to take—create an account to save results."
      kind="executive-function"
      backHref="/try"
      backLabel="Back"
      scoreFromRaw={(raw) => {
        const rawScore =
          typeof raw === "number" ? raw : Number((raw as { score?: number })?.score);
        if (!Number.isFinite(rawScore)) return 0;
        return (rawScore / MAX_STROOP_SCORE) * 100;
      }}
      getPercentile={getExecutivePercentile}
      resultCallout={
        <SignupEnticement
          title="Save this score + see comparisons"
          subtitle="Create a free account to track your trend over time and compare today's score to your baseline."
        />
      }
    >
      {({ onComplete }) => <StroopTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
