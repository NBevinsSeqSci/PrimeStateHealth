"use client";

import SignupEnticement from "@/components/SignupEnticement";
import ReactionTest from "@/components/tests/ReactionTest";
import TestScaffold from "@/components/tests/TestScaffold";
import type { ReactionResult } from "@/components/tests/ReactionTest";

/**
 * Convert average reaction time (ms) to a 0–100 score.
 * ~200ms (elite) => 100, ~600ms (very slow) => 0.
 */
function reactionTimeToScore(avgMs: number): number {
  const best = 200;
  const worst = 600;
  const t = (worst - avgMs) / (worst - best);
  return Math.round(Math.max(0, Math.min(1, t)) * 100);
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
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as ReactionResult;
        if (!result.rawScore || result.rawScore <= 0) return 0;
        return reactionTimeToScore(result.rawScore);
      }}
      aboutScore={
        <>
          <h3 className="text-sm font-semibold text-slate-900">About this score</h3>
          <p className="mt-2 text-sm text-slate-700">
            Score is derived from your average reaction time (lower is better).
            Faster average responses map to a higher score out of 100.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Reaction time can be affected by alertness, caffeine, fatigue, and
            device input lag. Tracking changes across sessions is more
            informative than any single result.
          </p>
        </>
      }
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
