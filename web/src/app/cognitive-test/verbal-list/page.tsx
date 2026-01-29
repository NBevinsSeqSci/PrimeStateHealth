"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import VerbalListTest from "@/components/tests/VerbalListTest";

const verbalListAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this score reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      Verbal list learning measures episodic memory and learning efficiency —
      your ability to encode, store, and retrieve a list of words across
      repeated trials. It draws on attention, verbal encoding strategy, and
      consolidation.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Scores closer to 100 reflect more words recalled across trials during this
      session. Sleep, stress, distraction, and familiarity with the task can
      influence results. Tracking trends over time is more informative than any
      single attempt.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: Verbal list-learning paradigms such as the Rey Auditory Verbal
      Learning Test (Schmidt, RAVLT Handbook) and California Verbal Learning
      Test (Delis et al., CVLT-II) are widely used to assess episodic memory in
      research and clinical settings.{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function VerbalListPage() {
  return (
    <TestScaffold
      title="Verbal List Learning Test"
      description="Assess episodic memory and learning"
      kind="verbal-list"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { rawScore: number; totalTrials: number; wordList: string[] };
        // Max possible = 15 words * 3 trials = 45
        // Average is ~25-35 across 3 trials
        return Math.min(100, (result.rawScore / 45) * 100);
      }}
      aboutScore={verbalListAboutScore}
    >
      {({ onComplete }) => <VerbalListTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
