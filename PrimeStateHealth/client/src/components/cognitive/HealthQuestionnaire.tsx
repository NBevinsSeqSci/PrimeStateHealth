import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface QuestionnaireProps {
  onComplete: (scores: { depression: number; attention: number; answered: number; total: number }) => void;
}

const questions = [
  {
    id: "dep_1",
    category: "depression",
    text: "Over the last 2 weeks, how often have you been bothered by having little interest or pleasure in doing things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ]
  },
  {
    id: "dep_2",
    category: "depression",
    text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ]
  },
  {
    id: "att_1",
    category: "attention",
    text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" },
    ]
  },
  {
    id: "att_2",
    category: "attention",
    text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" },
    ]
  },
];

export function HealthQuestionnaire({ onComplete }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // Calculate simple scores
    let depScore = 0;
    let attScore = 0;

    questions.forEach(q => {
      const val = answers[q.id] || 0;
      if (q.category === "depression") depScore += val;
      if (q.category === "attention") attScore += val;
    });

    onComplete({ depression: depScore, attention: attScore, answered: Object.keys(answers).length, total: questions.length });
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 text-center mb-8">
        <h3 className="text-2xl font-bold text-primary">Health Assessment</h3>
        <p className="text-muted-foreground">
          Please answer the following questions honestly to help us build your profile.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-4 p-6 bg-slate-50 rounded-xl border">
            <div className="flex gap-4">
              <span className="font-display font-bold text-primary/50 text-lg">{idx + 1}.</span>
              <Label className="text-base font-medium leading-relaxed pt-0.5">
                {q.text}
              </Label>
            </div>
            <RadioGroup 
              onValueChange={(val) => handleSelect(q.id, parseInt(val))}
              className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {q.options.map((opt) => (
                <div key={opt.value} className={`
                  flex items-center space-x-3 rounded-lg border p-3 transition-all cursor-pointer
                  ${answers[q.id] === opt.value 
                    ? "bg-primary/5 border-primary ring-1 ring-primary" 
                    : "bg-white border-slate-200 hover:bg-slate-100"}
                `}>
                  <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                  <Label 
                    htmlFor={`${q.id}-${opt.value}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-center">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={!allAnswered}
          className="w-full max-w-xs h-12 text-lg"
        >
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}
