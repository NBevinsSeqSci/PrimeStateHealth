"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import DigitSpanTest from "@/components/tests/DigitSpanTest";

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
    >
      {({ onComplete }) => <DigitSpanTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
