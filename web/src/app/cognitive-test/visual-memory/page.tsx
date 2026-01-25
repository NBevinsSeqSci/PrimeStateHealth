"use client";

import SignupEnticement from "@/components/SignupEnticement";
import TestScaffold from "@/components/tests/TestScaffold";
import VisualMemoryTest from "@/components/tests/VisualMemoryTest";

const MAX_MEMORY_LEVEL = 12;

export default function VisualMemoryPage() {
  return (
    <TestScaffold
      title="Visual Memory"
      description="Measures short-term memory for patterns and images."
      kind="visual-memory"
      scoreFromRaw={(raw) => {
        const data = raw as {
          highestLevel?: number;
          rawScore?: number;
          completedLevels?: number;
          total?: number;
          correct?: number;
          percent?: number;
          score100?: number;
        };
        const level = Number(
          data?.highestLevel ?? data?.rawScore ?? data?.completedLevels
        );
        if (Number.isFinite(level)) {
          return (Math.min(level, MAX_MEMORY_LEVEL) / MAX_MEMORY_LEVEL) * 100;
        }
        const total = Number(data?.total);
        const correct = Number(data?.correct);
        if (Number.isFinite(total) && total > 0) {
          return (correct / total) * 100;
        }
        const percent = Number(data?.percent ?? data?.score100);
        return Number.isFinite(percent) ? percent : 0;
      }}
      resultCallout={
        <SignupEnticement
          title="See your memory trend"
          subtitle="Create a free account to save results, compare today vs your baseline, and track progress over time."
        />
      }
    >
      {({ onComplete }) => <VisualMemoryTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
