"use client";

import { useCallback, useEffect, useState } from "react";

export type VisualMemoryResult = {
  rawScore: number;
  highestLevel: number;
  sequences: number[][];
  failureSequence: number[] | null;
  completedLevels: number;
};

type VisualMemoryTestProps = {
  onComplete: (result: VisualMemoryResult) => void;
};

export default function VisualMemoryTest({ onComplete }: VisualMemoryTestProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playbackIdx, setPlaybackIdx] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<
    "intro" | "idle" | "playing" | "input" | "success" | "fail"
  >("intro");
  const [level, setLevel] = useState(1);
  const [sequenceHistory, setSequenceHistory] = useState<number[][]>([]);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [finalResult, setFinalResult] = useState<VisualMemoryResult | null>(null);

  const startTest = () => {
    setGameState("idle");
  };

  const playSequence = useCallback((seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setPlaybackIdx(null);
        setGameState("input");
        return;
      }
      setPlaybackIdx(seq[i]);
      setTimeout(() => setPlaybackIdx(null), 500);
      i++;
    }, 1000);
  }, []);

  useEffect(() => {
    if (gameState !== "idle") return;
    const newSequence =
      sequence.length === 0
        ? Array.from({ length: level }, () => Math.floor(Math.random() * 9))
        : [...sequence, Math.floor(Math.random() * 9)];
    setSequence(newSequence);
    setSequenceHistory((prev) => [...prev, newSequence]);
    setGameState("playing");
    playSequence(newSequence);
  }, [gameState, level, sequence, playSequence]);

  const handleGridClick = (idx: number) => {
    if (gameState !== "input") return;

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setGameState("fail");
      const result: VisualMemoryResult = {
        rawScore: Math.max(0, level - 1),
        highestLevel: Math.max(0, level - 1),
        sequences: sequenceHistory,
        failureSequence: [...sequence],
        completedLevels,
      };
      setFinalResult(result);
      onComplete(result);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameState("success");
      setTimeout(() => {
        setLevel((value) => value + 1);
        setUserSequence([]);
        setCompletedLevels((prev) => prev + 1);
        setGameState("idle");
      }, 1000);
    }
  };

  if (gameState === "intro") {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-ink-900">
            Visual Memory Test
          </h3>
          <p className="text-sm text-ink-500">
            This test evaluates your short-term visual memory.
          </p>
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-left text-sm text-ink-600">
            <p className="font-semibold text-ink-700">Instructions:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-600">
              <li>A sequence of tiles will flash.</li>
              <li>Memorize the pattern.</li>
              <li>
                Repeat the pattern by clicking the tiles in the same order.
              </li>
              <li>The sequence gets one step longer each round.</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
            type="button"
          >
            Start Memory Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-ink-900">Visual Memory Test</h3>
        <p className="text-sm text-ink-500">
          Memorize the pattern and repeat it.
          <br />
          Level {level}
        </p>
      </div>

      <div className="mx-auto grid aspect-square w-full max-w-xs grid-cols-3 gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleGridClick(i)}
            disabled={gameState !== "input"}
            className={[
              "memory-tile aspect-square rounded-xl border transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              playbackIdx === i ? "memory-tile-active" : "",
              gameState === "input" ? "cursor-pointer active:scale-[0.97]" : "cursor-default",
              gameState === "success" ? "bg-brand-100 border-brand-300" : "",
              gameState === "fail" ? "bg-rose-50 border-rose-300" : "",
            ].join(" ")}
            type="button"
          />
        ))}
      </div>

      {finalResult ? (
        <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-left text-sm text-ink-600">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500">
            Results
          </p>
          <div className="mt-3 grid gap-2">
            <div>
              Highest level:{" "}
              <span className="font-semibold text-ink-900">
                {finalResult.highestLevel}
              </span>
            </div>
            <div>
              Completed levels:{" "}
              <span className="font-semibold text-ink-900">
                {finalResult.completedLevels}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Your score appears below.
          </p>
        </div>
      ) : null}

      <div className="h-6 text-sm font-medium">
        {gameState === "playing" && (
          <span className="animate-pulse text-brand-600">
            Watch carefully...
          </span>
        )}
        {gameState === "input" && (
          <span className="text-ink-500">Your turn</span>
        )}
        {gameState === "success" && (
          <span className="text-brand-600">Correct! Next level...</span>
        )}
        {gameState === "fail" && (
          <span className="text-rose-600">Incorrect sequence</span>
        )}
      </div>
    </div>
  );
}
