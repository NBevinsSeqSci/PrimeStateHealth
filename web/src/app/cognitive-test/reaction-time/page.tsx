"use client";

import SignupEnticement from "@/components/SignupEnticement";
import ReactionTest from "@/components/tests/ReactionTest";
import TestScaffold from "@/components/tests/TestScaffold";

// Percentile calculation not used for reaction time test
// We show raw metrics (ms) instead of normalized score
function getReactionPercentile(): null {
  return null;
}

export default function ReactionTimePage() {
  return (
    <TestScaffold
      title="Reaction Time"
      description="A quick baseline of speed and consistency. Free to take—create an account to save results."
      kind="reaction-time"
      backHref="/try"
      backLabel="Back"
      scoreFromRaw={() => {
        // Return NaN to hide the /100 score display
        // Useful metrics (Average, Fastest, Slowest, Early clicks) are shown in ReactionTest component
        return NaN;
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
