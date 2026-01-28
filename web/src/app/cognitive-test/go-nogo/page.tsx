"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import GoNoGoTask from "@/components/tests/GoNoGoTask";

export default function GoNoGoPage() {
  return (
    <TestScaffold
      title="Go/No-Go Test"
      description="Measure impulse control and response inhibition"
      kind="go-nogo"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number };
        return result.rawScore;
      }}
    >
      {({ onComplete }) => <GoNoGoTask onComplete={onComplete} />}
    </TestScaffold>
  );
}
