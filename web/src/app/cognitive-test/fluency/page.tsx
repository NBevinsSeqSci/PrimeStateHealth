"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import FluencyTest from "@/components/tests/FluencyTest";

const fluencyAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Verbal fluency reflects how quickly you can generate words within a
      category while following a rule — a mix of language production and
      executive control.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 generally reflect more valid category words produced
      within the time limit and fewer repeats. Sleep, stress, distraction, and
      familiarity with the category can influence results. Tracking changes over
      time is more informative than any single attempt.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Category (semantic) verbal fluency is commonly used to assess
      lexical access and executive function (Henry &amp; Crawford, 2004).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function FluencyPage() {
  return (
    <TestScaffold
      title="Verbal Fluency Test"
      description="Assess language production and executive function"
      kind="fluency"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number };
        // Average is ~15-20 animals in 60 seconds
        // Normalize: 20 animals = 100 score
        return Math.min(100, (result.rawScore / 20) * 100);
      }}
      aboutScore={fluencyAboutScore}
    >
      {({ onComplete }) => <FluencyTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
