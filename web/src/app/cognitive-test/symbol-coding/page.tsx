"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import SymbolCodingTest from "@/components/tests/SymbolCodingTest";

const symbolCodingAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Symbol coding performance reflects processing speed, visual scanning,
      attention, and rapid decision-making.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 generally indicate faster and more accurate matching
      of symbols to numbers during this session. Day-to-day factors like sleep,
      stress, distraction, and familiarity with the task can influence results.
      Tracking trends over time is more informative than any single attempt.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Symbol-digit substitution tasks are widely used to measure
      processing speed and attention (Wechsler, WAIS Digit Symbol-Coding;
      Lezak et al., Neuropsychological Assessment).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function SymbolCodingPage() {
  return (
    <TestScaffold
      title="Symbol Coding Test"
      description="Measure processing speed and attention"
      kind="symbol-coding"
      scoreFromRaw={(raw) => {
        if (typeof raw !== "number") return 0;
        // Average is ~40-60 correct in 90 seconds
        // Normalize: 60 correct = 100 score
        return Math.min(100, (raw / 60) * 100);
      }}
      aboutScore={symbolCodingAboutScore}
    >
      {({ onComplete }) => <SymbolCodingTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
