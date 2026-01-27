"use client";

import SignupEnticement from "@/components/SignupEnticement";
import ReactionTest from "@/components/tests/ReactionTest";
import TestScaffold from "@/components/tests/TestScaffold";

// Simple percentile calculation based on score
// These are placeholder values - can be refined with actual normative data
function getReactionPercentile(score: number): number {
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

export default function ReactionTimePage() {
  return (
    <TestScaffold
      title="Reaction Time"
      description="A quick baseline of speed and consistency. Free to take—create an account to save results."
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
      getPercentile={getReactionPercentile}
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
