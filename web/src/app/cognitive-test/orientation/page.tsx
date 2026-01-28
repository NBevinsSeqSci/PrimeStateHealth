"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import OrientationTest from "@/components/tests/OrientationTest";

const orientationAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">About this score</h3>
    <p className="mt-2 text-sm text-slate-700">
      Orientation reflects your ability to correctly identify the current date,
      day of the week, season, and time of day.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 indicate stronger temporal awareness. Lower scores
      can be influenced by distraction, fatigue, stress, or unfamiliar routines.
      Watching how your results change over time is often more informative than
      any single test.
    </p>
  </>
);

export default function OrientationPage() {
  return (
    <TestScaffold
      title="Orientation Test"
      description="Assess temporal and situational awareness"
      kind="orientation"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { score: number; maxScore: number };
        return (result.score / result.maxScore) * 100;
      }}
      aboutScore={orientationAboutScore}
    >
      {({ onComplete }) => <OrientationTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
