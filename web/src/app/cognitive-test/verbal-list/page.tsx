"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import VerbalListTest from "@/components/tests/VerbalListTest";

export default function VerbalListPage() {
  return (
    <TestScaffold
      title="Verbal List Learning Test"
      description="Assess episodic memory and learning"
      kind="verbal-list"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number; totalTrials: number; wordList: string[] };
        // Max possible = 15 words * 3 trials = 45
        // Average is ~25-35 across 3 trials
        return Math.min(100, (result.rawScore / 45) * 100);
      }}
    >
      {({ onComplete }) => <VerbalListTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
