import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";

interface ScreenersFormProps {
  onComplete: (data: any) => void;
}

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure",
  "Trouble concentrating on things, such as reading or watching TV",
  "Moving or speaking so slowly that other people could have noticed",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

type ScreenerQuestion = {
  id: string;
  text: string;
  sectionTitle: "PHQ-9" | "GAD-7";
};

const SCREENER_OPTIONS = [
  { val: "0", label: "Not at all" },
  { val: "1", label: "Several days" },
  { val: "2", label: "More than half the days" },
  { val: "3", label: "Nearly every day" },
];

const SCREENERS: ScreenerQuestion[] = [
  ...PHQ9_QUESTIONS.map((text, idx) => ({
    id: `phq9_${idx}`,
    text,
    sectionTitle: "PHQ-9" as const,
  })),
  ...GAD7_QUESTIONS.map((text, idx) => ({
    id: `gad7_${idx}`,
    text,
    sectionTitle: "GAD-7" as const,
  })),
];

const TOTAL_SCREENERS = SCREENERS.length;
const ATTENTION_QUESTIONS = [
  "How often do you have trouble finishing the final details of a project once the challenging parts have been done?",
  "How often do you have difficulty organizing tasks or activities when they require sustained effort?",
  "How often do you avoid or delay starting tasks that require a lot of thought?",
  "How often are you distracted by activity or noise around you when you need to focus?",
  "How often do you misplace important items like your phone, keys, or paperwork?",
];

const ATTENTION_OPTIONS = [
  { val: "0", label: "Never" },
  { val: "1", label: "Rarely" },
  { val: "2", label: "Sometimes" },
  { val: "3", label: "Often" },
  { val: "4", label: "Very Often" },
];

const TOTAL_ATTENTION = ATTENTION_QUESTIONS.length;

export function ScreenersForm({ onComplete }: ScreenersFormProps) {
  const [phase, setPhase] = useState<"screeners" | "attention" | "scd">("screeners");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attentionIndex, setAttentionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [selectionLock, setSelectionLock] = useState(false);

  const currentQuestion = SCREENERS[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentAttentionQuestion = ATTENTION_QUESTIONS[attentionIndex];
  const currentAttentionAnswer = answers[`attention_${attentionIndex}`];

  const handleScreenersAnswer = (value: string) => {
    if (!currentQuestion || selectionLock) return;

    setSelectionLock(true);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: parseInt(value),
    }));

    window.setTimeout(() => {
      if (currentIndex === TOTAL_SCREENERS - 1) {
        setPhase("attention");
        setAttentionIndex(0);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setSelectionLock(false);
    }, 150);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const skipCurrentQuestion = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });

    if (currentIndex === TOTAL_SCREENERS - 1) {
      setPhase("attention");
      setAttentionIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleScdAnswer = (questionIdx: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [`scd_${questionIdx}`]: parseInt(value),
    }));
  };

  const handleAttentionAnswer = (value: string) => {
    if (!currentAttentionQuestion || selectionLock) return;
    setSelectionLock(true);
    setAnswers((prev) => ({
      ...prev,
      [`attention_${attentionIndex}`]: parseInt(value),
    }));

    window.setTimeout(() => {
      if (attentionIndex === TOTAL_ATTENTION - 1) {
        setPhase("scd");
      } else {
        setAttentionIndex((prev) => prev + 1);
      }
      setSelectionLock(false);
    }, 150);
  };

  const goBackAttention = () => {
    if (attentionIndex === 0) {
      setPhase("screeners");
      setCurrentIndex(TOTAL_SCREENERS - 1);
      return;
    }
    setAttentionIndex((prev) => prev - 1);
  };

  const skipAttentionQuestion = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[`attention_${attentionIndex}`];
      return updated;
    });

    if (attentionIndex === TOTAL_ATTENTION - 1) {
      setPhase("scd");
    } else {
      setAttentionIndex((prev) => prev + 1);
    }
  };

  const finishScreeners = () => {
    onComplete(answers);
  };

  const getTitle = () => {
    if (phase === "screeners") return "Emotional Health Screeners";
    if (phase === "attention") return "Attention Screening Questionnaire";
    return "Cognitive Self-Assessment";
  };

  const getSubtitle = () => {
    if (phase === "screeners") {
      return "Over the last 2 weeks, how often have you been bothered by the following problems?";
    }
    if (phase === "attention") {
      return "Respond based on your experiences with focus and organization in the past 6 months.";
    }
    return "Please let us know about subjective cognitive changes you may have noticed.";
  };

  const progressPercent =
    phase === "screeners"
      ? ((currentIndex + 1) / TOTAL_SCREENERS) * 100
      : phase === "attention"
      ? ((attentionIndex + 1) / TOTAL_ATTENTION) * 100
      : 100;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900 text-center">
        {getTitle()}
      </h1>
      <p className="mt-1 text-sm text-slate-600 text-center">{getSubtitle()}</p>
      <div className="mt-5 flex items-center justify-between text-[11px] font-medium tracking-wide uppercase text-slate-500">
        <span>
          {phase === "screeners" && `Question ${currentIndex + 1} of ${TOTAL_SCREENERS}`}
          {phase === "attention" && `Attention Question ${attentionIndex + 1} of ${TOTAL_ATTENTION}`}
          {phase === "scd" && "Subjective cognitive questions"}
        </span>
        <span>
          {phase === "screeners"
            ? currentQuestion?.sectionTitle
            : phase === "attention"
            ? "Attention Screen"
            : "Self-Report"}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-100 bg-white shadow-sm px-5 py-6 md:px-8 md:py-7 space-y-6">
        {phase === "screeners" && currentQuestion && (
          <div>
            <p className="text-sm font-semibold text-slate-900">Over the last 2 weeks...</p>
            <p className="mt-1 text-base md:text-lg font-semibold text-slate-900">{currentQuestion.text}</p>
            <p className="mt-1 text-xs text-slate-600">Select the option that best matches your experience.</p>
            <RadioGroup
              value={currentAnswer !== undefined ? String(currentAnswer) : ""}
              onValueChange={handleScreenersAnswer}
              className="mt-4 grid gap-3"
            >
              {SCREENER_OPTIONS.map((opt) => (
                <Label
                  key={opt.val}
                  htmlFor={`${currentQuestion.id}_${opt.val}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 cursor-pointer text-sm font-medium"
                >
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.val} id={`${currentQuestion.id}_${opt.val}`} />
                </Label>
              ))}
            </RadioGroup>
            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={goBack}
                disabled={currentIndex === 0}
                className="hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={skipCurrentQuestion}
                className="font-medium text-slate-500 hover:text-slate-700 underline underline-offset-4"
              >
                Skip this question
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 text-right">
              You can skip if a question does not apply.
            </p>
          </div>
        )}

        {phase === "attention" && currentAttentionQuestion && (
          <div>
            <p className="text-sm font-semibold text-slate-900">In the past 6 months...</p>
            <p className="mt-1 text-base md:text-lg font-semibold text-slate-900">{currentAttentionQuestion}</p>
            <p className="mt-1 text-xs text-slate-600">Provide your best estimate; you can skip if unsure.</p>
            <RadioGroup
              value={currentAttentionAnswer !== undefined ? String(currentAttentionAnswer) : ""}
              onValueChange={handleAttentionAnswer}
              className="mt-4 grid gap-3"
            >
              {ATTENTION_OPTIONS.map((opt) => (
                <Label
                  key={opt.val}
                  htmlFor={`attention_${attentionIndex}_${opt.val}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 cursor-pointer text-sm font-medium"
                >
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.val} id={`attention_${attentionIndex}_${opt.val}`} />
                </Label>
              ))}
            </RadioGroup>
            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <button type="button" onClick={goBackAttention} className="hover:text-slate-700">
                ← Back
              </button>
              <button
                type="button"
                onClick={skipAttentionQuestion}
                className="font-medium text-slate-500 hover:text-slate-700 underline underline-offset-4"
              >
                Skip this question
              </button>
            </div>
          </div>
        )}

        {phase === "scd" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Have you noticed memory or thinking problems over the last 1–2 years?
              </Label>
              <RadioGroup onValueChange={(v) => handleScdAnswer(0, v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="scd_1_y" />
                  <Label htmlFor="scd_1_y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="scd_1_n" />
                  <Label htmlFor="scd_1_n">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Are your memory problems getting worse?</Label>
              <RadioGroup onValueChange={(v) => handleScdAnswer(1, v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="scd_2_y" />
                  <Label htmlFor="scd_2_y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="scd_2_n" />
                  <Label htmlFor="scd_2_n">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Are you more worried about your memory than others your age?</Label>
              <RadioGroup onValueChange={(v) => handleScdAnswer(2, v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="scd_3_y" />
                  <Label htmlFor="scd_3_y">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="scd_3_n" />
                  <Label htmlFor="scd_3_n">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

      {phase === "scd" && (
        <div className="mt-6">
          <Button
            onClick={finishScreeners}
            className="w-full rounded-full bg-slate-900 text-white text-sm font-semibold h-12 hover:bg-slate-800"
          >
            Start Cognitive Tests <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

    </main>
  );
}
