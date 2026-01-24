"use client";

import ReactionTest from "@/components/tests/ReactionTest";
import TestScaffold from "@/components/tests/TestScaffold";

export default function ReactionTimePage() {
  return (
    <TestScaffold
      title="Reaction Time"
      description="A quick baseline of speed and consistency."
      kind="reaction-time"
      scoreFromRaw={(raw) => {
        const data = raw as {
          rawScore?: number;
          meanMs?: number;
          medianMs?: number;
          earlyClicks?: number;
        };
        const mean = Number(data?.rawScore ?? data?.meanMs ?? data?.medianMs);
        const early = Number(data?.earlyClicks ?? 0);
        if (!Number.isFinite(mean)) return 0;
        const speedScore = 100 - ((mean - 250) / (600 - 250)) * 100;
        const penalty = Math.min(40, early * 8);
        return speedScore - penalty;
      }}
    >
      {({ onComplete }) => <ReactionTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
