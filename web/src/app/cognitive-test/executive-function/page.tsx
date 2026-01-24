"use client";

import StroopTest from "@/components/tests/StroopTest";
import TestScaffold from "@/components/tests/TestScaffold";

const MAX_STROOP_SCORE = 15 * 160;

export default function ExecutiveFunctionPage() {
  return (
    <TestScaffold
      title="Executive Function"
      description="Measures inhibition and cognitive control (Stroop-style)."
      kind="executive-function"
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
