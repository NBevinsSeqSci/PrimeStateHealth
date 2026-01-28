"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import TrailsTest from "@/components/tests/TrailsTest";

const trailsAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Trail Making (set-shifting) reflects visual attention, sequencing, and
      cognitive flexibility — your ability to alternate between numbers and
      letters while maintaining speed and accuracy.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 generally reflect faster completion with fewer errors
      during this session. Sleep, stress, distraction, and familiarity with the
      task can influence results. Tracking trends over time is more informative
      than any single attempt.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Trail Making Test is widely used to assess attention and
      set-shifting (Reitan, 1958; Bowie &amp; Harvey, 2006).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

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
      aboutScore={trailsAboutScore}
    >
      {({ onComplete }) => <TrailsTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
