import { useState } from "react";

type QuestionCategory =
  | "Cardiometabolic health"
  | "Vascular & neurologic"
  | "Sleep & breathing"
  | "Mood & mental health"
  | "Cognitive history"
  | "Substance use"
  | "Medications";

type Question = {
  id: string;
  label: string;
  questionText: string;
  category: QuestionCategory;
  domainDescription?: string;
};

const CATEGORY_KEYS: Record<QuestionCategory, string> = {
  "Cardiometabolic health": "cardiometabolic",
  "Vascular & neurologic": "vascularNeurologic",
  "Sleep & breathing": "sleepBreathing",
  "Mood & mental health": "moodMentalHealth",
  "Cognitive history": "cognitiveHistory",
  "Substance use": "substanceUse",
  Medications: "medications",
};

const QUESTIONS: Question[] = [
  {
    id: "htn",
    category: "Cardiometabolic health",
    label: "High blood pressure (hypertension)",
    questionText:
      "Has a doctor or other clinician ever told you that you have high blood pressure (hypertension)?",
    domainDescription: "Heart, blood pressure, blood sugar, and circulation",
  },
  {
    id: "diabetes",
    category: "Cardiometabolic health",
    label: "Diabetes or prediabetes",
    questionText:
      "Have you ever been told you have diabetes or prediabetes (high blood sugar)?",
  },
  {
    id: "cholesterol",
    category: "Cardiometabolic health",
    label: "High cholesterol or triglycerides",
    questionText:
      "Have you ever been told you have high cholesterol or high triglycerides?",
  },
  {
    id: "heart_disease",
    category: "Cardiometabolic health",
    label: "Heart disease",
    questionText:
      "Have you ever been diagnosed with heart disease (such as prior heart attack, coronary artery disease, or heart failure)?",
  },
  {
    id: "stroke_tia",
    category: "Vascular & neurologic",
    label: "Stroke or TIA",
    questionText: "Have you ever had a stroke or TIA ('mini-stroke')?",
    domainDescription: "Brain blood flow and neurologic events",
  },
  {
    id: "afib",
    category: "Vascular & neurologic",
    label: "Atrial fibrillation",
    questionText:
      "Have you ever been diagnosed with atrial fibrillation (an irregular heart rhythm)?",
  },
  {
    id: "head_injury",
    category: "Vascular & neurologic",
    label: "Significant head injury",
    questionText:
      "Have you ever had a head injury with loss of consciousness or confusion lasting more than 30 minutes?",
  },
  {
    id: "sleep_apnea",
    category: "Sleep & breathing",
    label: "Sleep apnea",
    questionText:
      "Have you ever been diagnosed with sleep apnea or used a CPAP or similar device at night?",
    domainDescription: "Sleep quality and nighttime breathing",
  },
  {
    id: "chronic_insomnia",
    category: "Sleep & breathing",
    label: "Chronic insomnia",
    questionText:
      "Do you have ongoing trouble falling or staying asleep most nights?",
  },
  {
    id: "depression_dx",
    category: "Mood & mental health",
    label: "Depression",
    questionText:
      "Have you ever been diagnosed with depression by a clinician?",
    domainDescription: "Mood and anxiety conditions that affect thinking",
  },
  {
    id: "anxiety_dx",
    category: "Mood & mental health",
    label: "Anxiety disorder",
    questionText:
      "Have you ever been diagnosed with an anxiety disorder (for example, generalized anxiety or panic attacks)?",
  },
  {
    id: "mci_dementia",
    category: "Cognitive history",
    label: "Mild cognitive impairment or dementia",
    questionText:
      "Have you ever been told you have mild cognitive impairment (MCI) or dementia?",
    domainDescription: "Prior diagnoses related to thinking and memory",
  },
  {
    id: "adhd_learning",
    category: "Cognitive history",
    label: "ADHD or learning difference",
    questionText:
      "Have you ever been diagnosed with ADHD or a learning difference that affects attention or reading?",
  },
  {
    id: "alcohol_concern",
    category: "Substance use",
    label: "Alcohol use disorder or concern",
    questionText:
      "In the past 5 years, has a clinician expressed concern about your alcohol use or diagnosed alcohol use disorder?",
    domainDescription: "Alcohol and other substances that can affect brain health",
  },
  {
    id: "drug_use",
    category: "Substance use",
    label: "Regular use of non-prescribed drugs",
    questionText:
      "In the past 5 years, have you regularly used non-prescribed drugs that could affect thinking or mood (for example, opioids, stimulants, or sedatives)?",
  },
  {
    id: "sedating_meds",
    category: "Medications",
    label: "Sedating medications",
    questionText:
      "Are you currently taking any medications that can make you sleepy or foggy (for example, benzodiazepines, strong pain medications, or prescription sleep aids)?",
    domainDescription: "Medications that can slow thinking or reaction speed",
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

interface MedicalHistoryFormProps {
  onComplete: (data: any) => void;
}

export function MedicalHistoryForm({ onComplete }: MedicalHistoryFormProps) {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionLock, setSelectionLock] = useState(false);
  const [flashChoice, setFlashChoice] = useState<"yes" | "no" | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

  const buildSubmission = (answerMap: Record<string, boolean | undefined>) => {
    const result: Record<string, any> = {
      cardiometabolic: [],
      vascularNeurologic: [],
      sleepBreathing: [],
      moodMentalHealth: [],
      cognitiveHistory: [],
      substanceUse: [],
      medications: [],
    };

    QUESTIONS.forEach((question) => {
      const response = answerMap[question.id];
      if (response === undefined) return;
      if (!response) return;

      const key = CATEGORY_KEYS[question.category];
      result[key] = [...result[key], question.label];
    });

    return result;
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const goNext = (updatedAnswers: Record<string, boolean | undefined>) => {
    if (currentIndex === TOTAL_QUESTIONS - 1) {
      onComplete(buildSubmission(updatedAnswers));
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleAnswer = (value: boolean) => {
    if (selectionLock) return;
    setSelectionLock(true);
    setFlashChoice(value ? "yes" : "no");

    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    window.setTimeout(() => {
      setFlashChoice(null);
      goNext(updatedAnswers);
      setSelectionLock(false);
    }, 200);
  };

  const skipQuestion = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      goNext(updated);
      return updated;
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900 text-center">
        Medical History &amp; Risk Factors
      </h1>
      <p className="mt-1 text-sm text-slate-600 text-center max-w-xl mx-auto">
        These questions help us understand your overall health so we can better interpret your results. Please answer yes or no for each item.
      </p>

      <div className="mt-5 flex items-center justify-between text-[11px] font-medium tracking-wide uppercase text-slate-500">
        <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
        <span>{currentQuestion.category}</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
      </div>
      {currentQuestion.domainDescription && (
        <p className="mt-2 text-xs text-slate-500">{currentQuestion.domainDescription}</p>
      )}

      <div className="mt-6 rounded-3xl border border-slate-100 bg-white shadow-sm px-5 py-6 md:px-8 md:py-7">
        <p className="text-sm font-semibold text-slate-900">Does this apply to you?</p>
        <p className="mt-1 text-base md:text-lg font-semibold text-slate-900">
          {currentQuestion.label}
        </p>
        <p className="mt-2 text-sm text-slate-600">{currentQuestion.questionText}</p>
        <p className="mt-1 text-xs text-slate-600">Select yes, no, or skip to move forward.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className={`w-full rounded-2xl border py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-slate-900 ${
              currentAnswer === true
                ? "border-primary ring-2 ring-primary/40"
                : "border-slate-300 hover:bg-slate-50"
            } ${flashChoice === "yes" ? "ring-2 ring-emerald-300" : ""}`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className={`w-full rounded-2xl border py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-slate-900 ${
              currentAnswer === false
                ? "border-primary ring-2 ring-primary/40"
                : "border-slate-300 hover:bg-slate-50"
            } ${flashChoice === "no" ? "ring-2 ring-emerald-300" : ""}`}
          >
            No
          </button>
        </div>

        <button
          type="button"
          onClick={skipQuestion}
          className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700 underline underline-offset-4"
        >
          Skip this question
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <span />
      </div>

      <p className="mt-4 text-[11px] text-slate-500 max-w-xl">
        Note: This information is used only to help interpret your results and make more personalized recommendations. It does not replace care from your personal healthcare provider.
      </p>

    </main>
  );
}
