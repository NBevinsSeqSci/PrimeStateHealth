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
      setTimeout(() => onComplete(result), 1500);
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
          <h3 className="text-2xl font-semibold text-white">
            Visual Memory Test
          </h3>
          <p className="text-sm text-slate-300">
            This test evaluates your short-term visual memory.
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left text-sm text-slate-200">
            <p className="font-semibold text-slate-100">Instructions:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
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
            className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
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
        <h3 className="text-xl font-semibold text-white">Visual Memory Test</h3>
        <p className="text-sm text-slate-300">
          Memorize the pattern and repeat it.
          <br />
          Level {level}
        </p>
      </div>

      <div className="grid aspect-square grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleGridClick(i)}
            disabled={gameState !== "input"}
            className={`
              rounded-xl border transition-all duration-200
              ${playbackIdx === i ? "bg-emerald-400 scale-95 shadow-lg shadow-emerald-500/20" : "bg-slate-900/60 border-white/10 hover:border-emerald-300/40"}
              ${gameState === "input" ? "cursor-pointer active:scale-95" : "cursor-default"}
              ${gameState === "success" ? "bg-emerald-400/20 border-emerald-300" : ""}
              ${gameState === "fail" ? "bg-rose-500/10 border-rose-400" : ""}
            `}
            type="button"
          />
        ))}
      </div>

      <div className="h-6 text-sm font-medium">
        {gameState === "playing" && (
          <span className="animate-pulse text-emerald-200">
            Watch carefully...
          </span>
        )}
        {gameState === "input" && (
          <span className="text-slate-300">Your turn</span>
        )}
        {gameState === "success" && (
          <span className="text-emerald-300">Correct! Next level...</span>
        )}
        {gameState === "fail" && (
          <span className="text-rose-300">Incorrect sequence</span>
        )}
      </div>
    </div>
  );
}
