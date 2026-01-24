import { Card } from "@/components/ui/card";
import { MemoryTest, type MemoryTestResult } from "@/components/cognitive/MemoryTest";

type Props = {
  onComplete: (score: number) => void;
};

export function ScreenerMemoryStage({ onComplete }: Props) {
  const handleComplete = (result: MemoryTestResult) => {
    onComplete(result.rawScore);
  };

  return (
    <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
      <MemoryTest onComplete={handleComplete} />
    </Card>
  );
}
