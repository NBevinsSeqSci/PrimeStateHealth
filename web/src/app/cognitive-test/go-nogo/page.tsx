"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import GoNoGoTask from "@/components/tests/GoNoGoTask";

const goNoGoAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Go/No-Go performance reflects response inhibition and impulse control —
      your ability to respond quickly when appropriate (Go) and withhold
      responses when needed (No-Go).
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 generally indicate fewer impulse errors and more
      consistent performance during this session. Day-to-day factors like sleep,
      stress, distraction, and caffeine can influence results. Tracking trends
      over time is more informative than any single test.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Go/No-Go is widely used in cognitive neuroscience to measure
      response inhibition (Aron, Robbins &amp; Poldrack, 2014).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function GoNoGoPage() {
  return (
    <TestScaffold
      title="Go/No-Go Test"
      description="Measure impulse control and response inhibition"
      kind="go-nogo"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number };
        return result.rawScore;
      }}
      aboutScore={goNoGoAboutScore}
    >
      {({ onComplete }) => <GoNoGoTask onComplete={onComplete} />}
    </TestScaffold>
  );
}
