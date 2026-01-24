import { Card } from "@/components/ui/card";
import { HealthQuestionnaire } from "@/components/cognitive/HealthQuestionnaire";

type QuestionnaireResult = {
  depression: number;
  attention: number;
  answered: number;
  total: number;
};

type Props = {
  onComplete: (result: QuestionnaireResult) => void;
};

export function ScreenerQuestionnaireStage({ onComplete }: Props) {
  return (
    <Card className="p-8 md:p-12 shadow-xl border-0 w-full">
      <HealthQuestionnaire onComplete={onComplete} />
    </Card>
  );
}
