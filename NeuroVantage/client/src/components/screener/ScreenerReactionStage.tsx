import { Card } from "@/components/ui/card";
import { ReactionTest, type ReactionResult } from "@/components/cognitive/ReactionTest";

type Props = {
  onComplete: (score: number) => void;
};

export function ScreenerReactionStage({ onComplete }: Props) {
  const handleComplete = (result: ReactionResult) => {
    onComplete(result.rawScore);
  };

  return (
    <Card className="p-8 md:p-12 shadow-xl border-0 min-h-[500px] flex flex-col justify-center max-w-2xl mx-auto">
      <ReactionTest onComplete={handleComplete} />
    </Card>
  );
}
