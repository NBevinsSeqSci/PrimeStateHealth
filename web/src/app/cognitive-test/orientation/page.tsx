import TestScaffold from "@/components/tests/TestScaffold";
import OrientationTest from "@/components/tests/OrientationTest";

export default function OrientationPage() {
  return (
    <TestScaffold
      title="Orientation Test"
      description="Assess temporal and situational awareness"
      kind="orientation"
      scoreFromRaw={(raw) => {
        if (!raw || typeof raw !== "object") return 0;
        const result = raw as { score: number; maxScore: number };
        return (result.score / result.maxScore) * 100;
      }}
    >
      {({ onComplete }) => <OrientationTest onComplete={onComplete} />}
    </TestScaffold>
  );
}
