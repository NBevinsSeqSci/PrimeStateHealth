"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type StroopTestProps = {
  onComplete: (score: number) => void;
};

const COLORS = [
  { name: "RED", value: "#ef4444" },
  { name: "BLUE", value: "#3b82f6" },
  { name: "GREEN", value: "#22c55e" },
  { name: "YELLOW", value: "#eab308" },
];

const TOTAL_ROUNDS = 15;

export default function StroopTest({ onComplete }: StroopTestProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">(
    "intro"
  );
  const [currentWord, setCurrentWord] = useState({ text: "", color: "" });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("finished");
    onComplete(scoreRef.current);
  }, [onComplete]);

  const nextRound = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      endGame();
      return;
    }

    const randomTextIndex = Math.floor(Math.random() * COLORS.length);
    let randomColorIndex = Math.floor(Math.random() * COLORS.length);

    if (Math.random() > 0.3 && randomColorIndex === randomTextIndex) {
      randomColorIndex = (randomColorIndex + 1) % COLORS.length;
    }

    setCurrentWord({
      text: COLORS[randomTextIndex].name,
      color: COLORS[randomColorIndex].value,
    });
    setRound((value) => value + 1);
  }, [endGame]);

  useEffect(() => {
    if (gameState === "playing") {
      nextRound();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, nextRound, endGame]);

  const handleAnswer = (colorValue: string) => {
    if (colorValue === currentWord.color) {
      setScore((value) => value + 100 + timeLeft * 2);
    } else {
      setScore((value) => Math.max(0, value - 50));
    }
    nextRound();
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      {gameState === "intro" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Executive Function Challenge
            </h3>
            <p className="text-sm text-slate-300">
              Select the <strong>COLOR of the ink</strong>, not the word itself.
              <br />
              Example: If you see{" "}
              <span className="font-semibold text-red-400">BLUE</span>, select
              Red.
            </p>
          </div>
          <button
            onClick={() => setGameState("playing")}
            className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            type="button"
          >
            Start Challenge
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-8">
          <div className="flex justify-between text-sm font-medium text-slate-300">
            <span>
              Round {Math.min(Math.max(round, 1), TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
            </span>
            <span>Time: {timeLeft}s</span>
          </div>

          <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 shadow-inner">
            <div
              key={round}
              className="text-5xl font-black tracking-wider transition-transform duration-150"
              style={{ color: currentWord.color }}
            >
              {currentWord.text}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleAnswer(color.value)}
                className="h-14 rounded-2xl border-2 bg-slate-950/40 text-base font-semibold transition hover:bg-slate-900/70"
                style={{ borderColor: color.value, color: color.value }}
                type="button"
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">Challenge Complete!</h3>
          <p className="text-4xl font-black text-emerald-300">{score}</p>
          <p className="text-sm text-slate-300">Raw score. Your score appears below.</p>
        </div>
      )}
    </div>
  );
}
