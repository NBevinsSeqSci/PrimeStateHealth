"use client";

import SignupEnticement from "@/components/SignupEnticement";
import StroopTest from "@/components/tests/StroopTest";
import TestScaffold from "@/components/tests/TestScaffold";

const MAX_STROOP_SCORE = 15 * 160;

export default function ExecutivePage() {
  return (
    <TestScaffold
      title="Executive Function"
      description="Stroop task (focus + inhibition). No signup required."
      kind="executive-function"
      backHref="/try"
      backLabel="Back"
      scoreFromRaw={(raw) => {
        const rawScore =
          typeof raw === "number" ? raw : Number((raw as { score?: number })?.score);
        if (!Number.isFinite(rawScore)) return 0;
        return (rawScore / MAX_STROOP_SCORE) * 100;
      }}
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
