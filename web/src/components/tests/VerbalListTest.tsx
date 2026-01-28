"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export type VerbalListResult = {
  rawScore: number;
  trials: Array<{
    trial: number;
    recalled: string[];
    correctCount: number;
  }>;
  totalTrials: number;
  wordList: string[];
};

const WORD_LIST = [
  "DRUM",
  "CURTAIN",
  "BELL",
  "COFFEE",
  "SCHOOL",
  "PARENT",
  "MOON",
  "GARDEN",
  "HAT",
  "FARMER",
  "NOSE",
  "TURKEY",
  "COLOR",
  "HOUSE",
  "RIVER",
];

export default function VerbalListTest({
  onComplete,
}: {
  onComplete: (result: VerbalListResult) => void;
}) {
  const [phase, setPhase] = useState<"intro" | "learning" | "recall" | "finished">("intro");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [trial, setTrial] = useState(1);
  const [recallInput, setRecallInput] = useState("");
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  const [trialData, setTrialData] = useState<VerbalListResult["trials"]>([]);

  const wordList = WORD_LIST;

  useEffect(() => {
    if (phase === "learning") {
      if (currentWordIdx < wordList.length) {
        const timer = setTimeout(() => {
          setCurrentWordIdx((i) => i + 1);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setPhase("recall");
        setRecalledWords([]);
        setRecallInput("");
      }
    }
  }, [phase, currentWordIdx, wordList.length]);

  const startTrial = () => {
    setCurrentWordIdx(0);
    setPhase("learning");
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = recallInput.toUpperCase().trim();
    if (word && !recalledWords.includes(word)) {
      setRecalledWords([...recalledWords, word]);
    }
    setRecallInput("");
  };

  const finishTrial = () => {
    const correctCount = recalledWords.filter((w) => wordList.includes(w)).length;
    setTrialData((prev) => [...prev, { trial, recalled: recalledWords, correctCount }]);

    if (trial < 3) {
      setTrial((t) => t + 1);
      setPhase("intro");
    } else {
      setPhase("finished");
      setTimeout(() => {
        const total = [...trialData, { trial, recalled: recalledWords, correctCount }].reduce(
          (sum, entry) => sum + entry.correctCount,
          0
        );
        onComplete({
          rawScore: total,
          trials: [...trialData, { trial, recalled: recalledWords, correctCount }],
          totalTrials: 3,
          wordList,
        });
      }, 1500);
    }
  };

  if (phase === "intro") {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">Verbal List Learning</h3>
        <p className="text-slate-600">
          {trial === 1
            ? "You will see a list of words. Try to remember as many as you can. We will do this 3 times."
            : `Ready for Trial ${trial} of 3? The same words will be shown again.`}
        </p>
        <button
          onClick={startTrial}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start Trial {trial}
        </button>
      </div>
    );
  }

  if (phase === "learning") {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        {currentWordIdx < wordList.length ? (
          <div className="text-5xl font-bold text-slate-900 animate-in zoom-in duration-300">
            {wordList[currentWordIdx]}
          </div>
        ) : (
          <div className="text-2xl text-slate-600">Get ready to recall...</div>
        )}
      </div>
    );
  }

  if (phase === "recall") {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">Recall Phase</h3>
        <p className="text-slate-600">
          Type as many words as you can remember from the list.
        </p>

        <form onSubmit={handleAddWord} className="flex gap-2">
          <Input
            value={recallInput}
            onChange={(e) => setRecallInput(e.target.value)}
            placeholder="Type word and press Enter"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add
          </button>
        </form>

        <div className="min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 content-start">
          {recalledWords.map((w, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium shadow-sm"
            >
              {w}
            </span>
          ))}
        </div>

        <button
          onClick={finishTrial}
          className="w-full rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          I can't remember any more
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-semibold text-slate-900">Section Complete</h3>
      <p className="text-slate-600">Saving results...</p>
    </div>
  );
}
