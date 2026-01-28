"use client";

import TestScaffold from "@/components/tests/TestScaffold";
import SymbolCodingTest from "@/components/tests/SymbolCodingTest";

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
    >
      {({ onComplete }) => <SymbolCodingTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
