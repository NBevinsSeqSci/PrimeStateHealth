"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import FluencyTest from "@/components/tests/FluencyTest";

export default function FluencyPage() {
  return (
    <TestScaffold
      title="Verbal Fluency Test"
      description="Assess language production and executive function"
      kind="fluency"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number };
        // Average is ~15-20 animals in 60 seconds
        // Normalize: 20 animals = 100 score
        return Math.min(100, (result.rawScore / 20) * 100);
      }}
    >
      {({ onComplete }) => <FluencyTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
