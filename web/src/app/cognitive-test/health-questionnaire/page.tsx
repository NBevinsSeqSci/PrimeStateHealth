"use client";

import Link from "next/link";
import TestScaffold from "@/components/tests/TestScaffold";
import HealthQuestionnaire from "@/components/tests/HealthQuestionnaire";

const healthQuestionnaireAboutScore = (
  <>
    <h3 className="text-sm font-semibold text-slate-900">
      What this screening reflects
    </h3>
    <p className="mt-2 text-sm text-slate-700">
      This brief questionnaire includes items adapted from well-validated mood
      (PHQ-2) and attention (ASRS) screening tools. It captures a snapshot of
      how you have been feeling and functioning recently.
    </p>
    <p className="mt-2 text-sm text-slate-700">
      Higher totals in either domain suggest greater symptom frequency during the
      past two weeks. Scores are not diagnostic — they are intended to help you
      notice patterns over time and decide when to seek professional guidance.
    </p>
    <p className="mt-3 text-xs text-slate-500">
      Reference: PHQ-2 (Kroenke, Spitzer &amp; Williams, 2003); ASRS-v1.1
      Screener (Kessler et al., 2005).{" "}
      <Link
        href="/how-it-works#scoring-methodology"
        className="text-brand-600 underline hover:text-brand-500"
      >
        Learn more
      </Link>
    </p>
  </>
);

export default function HealthQuestionnairePage() {
  return (
    <TestScaffold
      title="Health Questionnaire"
      description="Brief mood and attention screening"
      kind="health-questionnaire"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return NaN;
        const result = raw as {
          depression: number;
          attention: number;
          answered: number;
          total: number;
        };
        // Only show a score if the user answered all questions
        if (result.answered < result.total) return NaN;
        // Combine depression (max 6) + attention (max 8) = max 14
        // Lower raw total = better → invert so higher score = better
        const maxTotal = 14;
        const combined = result.depression + result.attention;
        return ((maxTotal - combined) / maxTotal) * 100;
      }}
      aboutScore={healthQuestionnaireAboutScore}
    >
      {({ onComplete }) => <HealthQuestionnaire onComplete={onComplete} />}
    </TestScaffold>
  );
}
