"use client";

import SignupEnticement from "@/components/SignupEnticement";
import ReactionTest from "@/components/tests/ReactionTest";
import TestScaffold from "@/components/tests/TestScaffold";

export default function ReactionTimePage() {
  return (
    <TestScaffold
      title="Reaction Time"
      description="A quick baseline of speed and consistency."
      kind="reaction-time"
      backHref="/try"
      backLabel="Back"
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
      resultCallout={
        <SignupEnticement
          title="Track your speed over time"
          subtitle="Create a free account to save results, compare today vs your baseline, and see your trendline."
        />
      }
    >
      {({ onComplete }) => <ReactionTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
