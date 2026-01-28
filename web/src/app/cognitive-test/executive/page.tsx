"use client";

import SignupEnticement from "@/components/SignupEnticement";
import StroopTest from "@/components/tests/StroopTest";
import TestScaffold from "@/components/tests/TestScaffold";

// Simple percentile calculation based on score
// These are placeholder values - can be refined with actual normative data
function getExecutivePercentile(score: number): number {
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

export default function ExecutivePage() {
  return (
    <TestScaffold
      title="Executive Function"
      description="Stroop task (focus + inhibition). Free to take—create an account to save results."
      kind="executive-function"
      backHref="/try"
      backLabel="Back"
      scoreFromRaw={(raw) => {
        // Handle new result format with time tracking
        if (typeof raw === "object" && raw !== null) {
          const result = raw as {
            score?: number;
            elapsedMs?: number;
            correct?: number;
            total?: number;
          };

          const { correct = 0, total = 15, elapsedMs = 30000 } = result;

          // Accuracy score: 70% weight (0-70 points)
          const accuracyScore = (correct / total) * 70;

          // Speed score: 30% weight (0-30 points)
          // Faster completion gets higher score
          // Optimal time range: 15-25 seconds
          // Below 15s: might be rushed/random clicking
          // Above 30s: took too long
          const elapsedSec = elapsedMs / 1000;
          let speedScore = 0;

          if (elapsedSec < 10) {
            // Too fast, likely random clicking
            speedScore = 0;
          } else if (elapsedSec < 15) {
            // Very fast but potentially valid: 15-25 points
            speedScore = 15 + ((15 - elapsedSec) / 5) * 10;
          } else if (elapsedSec < 25) {
            // Optimal range: 25-30 points
            speedScore = 30 - ((elapsedSec - 15) / 10) * 5;
          } else if (elapsedSec < 35) {
            // Acceptable but slower: 10-25 points
            speedScore = 25 - ((elapsedSec - 25) / 10) * 15;
          } else {
            // Too slow: 0-10 points
            speedScore = Math.max(0, 10 - ((elapsedSec - 35) / 10) * 10);
          }

          const finalScore = accuracyScore + speedScore;
          return Math.max(0, Math.min(100, finalScore));
        }

        // Fallback for old format (just score number)
        const rawScore = typeof raw === "number" ? raw : 0;
        if (!Number.isFinite(rawScore)) return 0;
        const MAX_STROOP_SCORE = 15 * 160;
        return (rawScore / MAX_STROOP_SCORE) * 100;
      }}
      getPercentile={getExecutivePercentile}
      resultCallout={
        <SignupEnticement
          title="Save this score + see comparisons"
          subtitle="Create a free account to track your trend over time and compare today's score to your baseline."
        />
      }
    >
      {({ onComplete }) => <StroopTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
