"use client";

import SignupEnticement from "@/components/SignupEnticement";
import TestScaffold from "@/components/tests/TestScaffold";
import VisualMemoryTest from "@/components/tests/VisualMemoryTest";

const MAX_MEMORY_LEVEL = 12;

// Simple percentile calculation based on score
// These are placeholder values - can be refined with actual normative data
function getMemoryPercentile(score: number): number {
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

export default function VisualMemoryPage() {
  return (
    <TestScaffold
      title="Visual Memory"
      description="Measures short-term memory for patterns and images. Free to take—create an account to save results."
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
      getPercentile={getMemoryPercentile}
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
