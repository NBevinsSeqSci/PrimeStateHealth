"use client";

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
    >
      {({ onComplete }) => <StroopTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
