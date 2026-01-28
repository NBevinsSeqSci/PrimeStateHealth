"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import TrailsTest from "@/components/tests/TrailsTest";

export default function TrailsPage() {
  return (
    <TestScaffold
      title="Trail Making Test"
      description="Assess visual attention and task switching"
      kind="trails"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { adjustedTimeSec: number | null; errors: number };
        if (result.adjustedTimeSec === null) return 0;
        // Average completion time is ~30-45 seconds
        // Faster = better, normalize inversely
        // 20s = 100, 60s = ~50, 120s = ~25
        const timePenalty = Math.min(result.adjustedTimeSec, 120);
        const score = 100 - (timePenalty - 20) * (75 / 100);
        return Math.max(0, Math.min(100, score));
      }}
    >
      {({ onComplete }) => <TrailsTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
