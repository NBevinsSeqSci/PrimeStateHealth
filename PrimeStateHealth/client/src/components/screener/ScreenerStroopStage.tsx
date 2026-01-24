import { Card } from "@/components/ui/card";
import { StroopTest } from "@/components/cognitive/StroopTest";

type Props = {
  onComplete: (score: number) => void;
};

export function ScreenerStroopStage({ onComplete }: Props) {
  return (
    <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
      <StroopTest onComplete={onComplete} />
    </Card>
  );
}
