"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import DigitSpanTest from "@/components/tests/DigitSpanTest";

const digitSpanAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Digit span measures working memory capacity — the ability to hold and
      manipulate information in mind over short intervals. It draws on attention,
      concentration, and short-term verbal storage.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 generally reflect longer sequences recalled
      accurately during this session. Sleep, stress, distraction, and
      familiarity with the task can influence results. Tracking trends over time
      is more informative than any single attempt.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Digit span tasks are a core component of standardized memory
      batteries (Wechsler, WAIS Digit Span; Lezak et al., Neuropsychological
      Assessment).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function DigitSpanPage() {
  return (
    <TestScaffold
      title="Digit Span Test"
      description="Assess working memory and attention"
      kind="digit-span"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number };
        // Normalize to 0-100: typical span is 3-9 digits, average 7
        return Math.min(100, (result.rawScore / 16) * 100);
      }}
      aboutScore={digitSpanAboutScore}
    >
      {({ onComplete }) => <DigitSpanTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
