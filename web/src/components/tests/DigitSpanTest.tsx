"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export type DigitSpanResult = {
  rawScore: number;
  forwardSpan: number;
  backwardSpan: number;
  forwardSequences: string[][];
  backwardSequences: string[][];
  totalTrials: number;
};

export default function DigitSpanTest({
  onComplete,
}: {
  onComplete: (result: DigitSpanResult) => void;
}) {
  const [phase, setPhase] = useState<"intro" | "display" | "input" | "finished">("intro");
  const [mode, setMode] = useState<"forward" | "backward">("forward");
  const [level, setLevel] = useState(3);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [forwardSpan, setForwardSpan] = useState(0);
  const [backwardSpan, setBackwardSpan] = useState(0);
  const [forwardSequences, setForwardSequences] = useState<string[][]>([]);
  const [backwardSequences, setBackwardSequences] = useState<string[][]>([]);
  const [showBlank, setShowBlank] = useState(false);

  useEffect(() => {
    if (phase === "display") {
      if (currentDigitIndex < sequence.length) {
        if (!showBlank) {
          const timer = setTimeout(() => setShowBlank(true), 700);
          return () => clearTimeout(timer);
        } else {
          const timer = setTimeout(() => {
            setShowBlank(false);
            setCurrentDigitIndex((i) => i + 1);
          }, 200);
          return () => clearTimeout(timer);
        }
      } else {
        setPhase("input");
      }
    }
  }, [phase, currentDigitIndex, sequence, showBlank]);

  const startTrial = () => {
    const newSeq = Array.from({ length: level }, () =>
      Math.floor(Math.random() * 10).toString()
    );
    setSequence(newSeq);
    if (mode === "forward") {
      setForwardSequences((prev) => [...prev, newSeq]);
    } else {
      setBackwardSequences((prev) => [...prev, newSeq]);
    }
    setCurrentDigitIndex(0);
    setUserInput("");
    setPhase("display");
  };

  const startForwardPhase = () => {
    setMode("forward");
    setLevel(3);
    setForwardSpan(0);
    setBackwardSpan(0);
    setForwardSequences([]);
    setBackwardSequences([]);
    startTrial();
  };

  const beginBackwardPhase = () => {
    setMode("backward");
    setLevel(3);
    setPhase("intro");
  };

  const finishTest = () => {
    setPhase("finished");
    const result: DigitSpanResult = {
      rawScore: forwardSpan + backwardSpan,
      forwardSpan,
      backwardSpan,
      forwardSequences,
      backwardSequences,
      totalTrials: forwardSequences.length + backwardSequences.length,
    };
    setTimeout(() => onComplete(result), 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target =
      mode === "forward"
        ? sequence.join("")
        : [...sequence].reverse().join("");

    if (userInput === target) {
      if (mode === "forward") {
        setForwardSpan((prev) => Math.max(prev, level));
      } else {
        setBackwardSpan((prev) => Math.max(prev, level));
      }
      setLevel((l) => l + 1);
      startTrial();
    } else {
      if (mode === "forward") {
        beginBackwardPhase();
      } else {
        finishTest();
      }
    }
  };

  if (phase === "intro") {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">
          Digit Span {mode === "backward" ? "(Reverse)" : ""}
        </h3>
        <p className="text-slate-600">
          {mode === "forward"
            ? "A sequence of numbers will appear. Remember them and type them in the SAME order."
            : "Now, type the numbers in REVERSE order. (e.g., if you see 1-2-3, type 321)."}
        </p>
        <button
          onClick={mode === "forward" ? startForwardPhase : startTrial}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start {mode === "forward" ? "Forward" : "Backward"} Test
        </button>
      </div>
    );
  }

  if (phase === "display") {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        {currentDigitIndex < sequence.length ? (
          <div className="text-8xl font-bold text-slate-900 animate-in zoom-in duration-200">
            {showBlank ? "" : sequence[currentDigitIndex]}
          </div>
        ) : (
          <div className="text-2xl text-slate-600">Your turn...</div>
        )}
      </div>
    );
  }

  if (phase === "input") {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">Enter Sequence</h3>
        <p className="text-slate-600">
          {mode === "forward"
            ? "Type the numbers in order."
            : "Type the numbers in REVERSE order."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={userInput}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setUserInput(val);
            }}
            placeholder="Numbers only..."
            className="text-center text-2xl tracking-widest h-16"
            autoFocus
            maxLength={20}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-semibold text-slate-900">Test Complete</h3>
      <p className="text-slate-600">Saving results...</p>
    </div>
  );
}
