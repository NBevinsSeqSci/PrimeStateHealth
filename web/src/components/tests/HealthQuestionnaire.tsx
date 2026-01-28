"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";

interface QuestionnaireProps {
  onComplete: (scores: {
    depression: number;
    attention: number;
    answered: number;
    total: number;
  }) => void;
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
    ],
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
    ],
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
    ],
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
    ],
  },
];

export default function HealthQuestionnaire({ onComplete }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let depScore = 0;
    let attScore = 0;

    questions.forEach((q) => {
      const val = answers[q.id] || 0;
      if (q.category === "depression") depScore += val;
      if (q.category === "attention") attScore += val;
    });

    onComplete({
      depression: depScore,
      attention: attScore,
      answered: Object.keys(answers).length,
      total: questions.length,
    });
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 text-center mb-8">
        <h3 className="text-2xl font-semibold text-slate-900">Health Assessment</h3>
        <p className="text-slate-600">
          Please answer the following questions honestly to help us build your
          profile.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <div className="flex gap-4">
              <span className="font-bold text-slate-400 text-lg">{idx + 1}.</span>
              <Label className="text-base font-medium leading-relaxed pt-0.5">
                {q.text}
              </Label>
            </div>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(q.id, opt.value)}
                  className={`flex items-center space-x-3 rounded-lg border p-3 transition-all cursor-pointer text-left ${
                    answers[q.id] === opt.value
                      ? "bg-slate-100 border-slate-900 ring-1 ring-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      answers[q.id] === opt.value
                        ? "border-slate-900"
                        : "border-slate-300"
                    }`}
                  >
                    {answers[q.id] === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-slate-900" />
                    )}
                  </div>
                  <span className="flex-1 text-sm font-normal text-slate-700">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full max-w-xs h-12 text-lg rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
}
