"use client";

import { useState } from "react";

type QuestionKey = "mood" | "anxiety" | "focus" | "motivation" | "stress" | "sleep" | "energy";

interface QuestionData {
  label: string;
  lowLabel: string;
  highLabel: string;
}

const questions: Record<QuestionKey, QuestionData> = {
  mood: {
    label: "Overall mood",
    lowLabel: "Very low",
    highLabel: "Very good",
  },
  anxiety: {
    label: "Anxiety/worry",
    lowLabel: "None",
    highLabel: "Very high",
  },
  focus: {
    label: "Focus/attention",
    lowLabel: "Very poor",
    highLabel: "Very sharp",
  },
  motivation: {
    label: "Motivation",
    lowLabel: "Very low",
    highLabel: "Very high",
  },
  stress: {
    label: "Stress level",
    lowLabel: "None",
    highLabel: "Very high",
  },
  sleep: {
    label: "Sleep quality (last night)",
    lowLabel: "Very poor",
    highLabel: "Excellent",
  },
  energy: {
    label: "Energy level",
    lowLabel: "Very low",
    highLabel: "Very high",
  },
};

export default function QuickCheckIn() {
  const [ratings, setRatings] = useState<Partial<Record<QuestionKey, number>>>({});
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleRating = (key: QuestionKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const allAnswered = Object.keys(questions).every((key) =>
      ratings[key as QuestionKey] !== undefined
    );

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ratings,
          notes: notes.trim() || undefined,
        }),
      });

      if (response.ok) {
        setStatus("success");
        // Reset after success
        setTimeout(() => {
          setRatings({});
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Quick Check-In</h3>
      <p className="mt-1 text-sm text-slate-600">
        How are you feeling right now? Rate each aspect on a scale of 0-4.
      </p>

      <div className="mt-6 space-y-5">
        {(Object.keys(questions) as QuestionKey[]).map((key) => {
          const q = questions[key];
          const currentValue = ratings[key];

          return (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700">
                {q.label}
              </label>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">{q.lowLabel}</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRating(key, value)}
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all",
                        currentValue === value
                          ? "border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-400 scale-110"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500">{q.highLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-slate-700">
          Notes <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything affecting you today? (sleep, travel, alcohol, illness, stressors, training, etc.)"
          rows={3}
          maxLength={2000}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300"
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={status === "submitting"}
          className="ps-btn-primary disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Submit Check-In"}
        </button>
        {status === "success" && (
          <p className="text-sm font-medium text-green-600">Submitted successfully!</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">Failed to submit. Try again.</p>
        )}
      </div>
    </div>
  );
}
