"use client";

import { useState, useEffect, useRef } from "react";

export default function SymbolCodingTest({
  onComplete,
}: {
  onComplete: (score: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentSymbol, setCurrentSymbol] = useState(0);
  const [highlightSymbol, setHighlightSymbol] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "none">("none");
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const symbols = ["★", "●", "▲", "■"];
  const [trials, setTrials] = useState<number[]>([]);

  useEffect(() => {
    setTrials(Array.from({ length: 100 }, () => Math.floor(Math.random() * 4)));
  }, []);

  const isFinished = trials.length > 0 && currentSymbol >= trials.length;
  const currentTargetIndex = trials[currentSymbol];
  const currentShape =
    typeof currentTargetIndex === "number" ? symbols[currentTargetIndex] : null;

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, score, onComplete]);

  useEffect(() => {
    if (!started) return;
    if (isFinished) {
      onComplete(score);
    }
  }, [started, isFinished, score, onComplete]);

  useEffect(() => {
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, []);

  const handleInput = (num: number) => {
    if (!started || isFinished || typeof currentTargetIndex !== "number") return;
    const expectedNum = trials[currentSymbol] + 1;

    const isCorrect = num === expectedNum;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setHighlightSymbol(true);
    flashTimeout.current = setTimeout(() => setHighlightSymbol(false), 200);

    window.setTimeout(() => {
      setFeedback("none");
      setCurrentSymbol((c) => c + 1);
    }, 200);
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">Digital Symbol Coding</h3>
        <p className="text-slate-600">
          Using the key at the top, match the symbols to the correct numbers as
          fast as you can. You have 90 seconds.
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-center gap-6 text-xl">
          <div className="flex flex-col items-center">
            <span className="font-bold text-slate-900">1</span>
            <span className="text-2xl">★</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-slate-900">2</span>
            <span className="text-2xl">●</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-slate-900">3</span>
            <span className="text-2xl">▲</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-slate-900">4</span>
            <span className="text-2xl">■</span>
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <div className="flex justify-between items-center px-4">
        <div className="text-sm font-medium text-slate-600">Score: {score}</div>
        <div className="flex items-center gap-2 font-bold bg-slate-100 px-4 py-2 rounded-full text-slate-900">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {timeLeft}s
        </div>
      </div>

      {/* Key */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-center gap-8 text-xl">
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-900">1</span>
          <span className="text-2xl">★</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-900">2</span>
          <span className="text-2xl">●</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-900">3</span>
          <span className="text-2xl">▲</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-900">4</span>
          <span className="text-2xl">■</span>
        </div>
      </div>

      {/* Current Task */}
      <div className="py-12">
        <div
          className={[
            "inline-flex items-center justify-center rounded-2xl p-6 transition-colors duration-150 mb-4",
            feedback === "correct"
              ? "bg-emerald-100"
              : feedback === "incorrect"
                ? "bg-red-100"
                : "bg-transparent",
          ].join(" ")}
        >
          {currentShape ? (
            <div
              className={`text-6xl transition-transform ${
                highlightSymbol ? "scale-110 text-slate-900" : ""
              }`}
            >
              {currentShape}
            </div>
          ) : (
            <div className="text-base text-slate-500">Great job—finishing up…</div>
          )}
        </div>
        <div className="h-6 mb-6" />

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handleInput(num)}
              className="h-20 text-3xl font-bold rounded-xl border-2 border-slate-300 bg-white text-slate-900 transition-colors hover:bg-slate-900 hover:text-white hover:border-slate-900"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
