"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import HealthQuestionnaire from "@/components/tests/HealthQuestionnaire";

export default function HealthQuestionnairePage() {
  return (
    <TestScaffold
      title="Health Questionnaire"
      description="Brief mood and attention screening"
      kind="visual-memory"
      scoreFromRaw={() => {
        // This is a questionnaire, not a scored test
        // Return NaN to hide the score display
        return NaN;
      }}
    >
      {({ onComplete }) => <HealthQuestionnaire onComplete={onComplete} />}
    </TestScaffold>
  );
}
