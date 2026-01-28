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
  const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());

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
    setSelectedTiles(new Set());
    playSequence(newSequence);
  }, [gameState, level, sequence, playSequence]);

  const handleGridClick = (idx: number) => {
    if (gameState !== "input") return;

    // Add visual feedback for user selection
    setSelectedTiles((prev) => new Set([...prev, idx]));
    setTimeout(() => {
      setSelectedTiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet;
      });
    }, 300);

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

  const isInputPhase = gameState === "input";

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

      <div className="mx-auto grid aspect-square w-full max-w-xs grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
        {Array.from({ length: 9 }).map((_, i) => {
          const isCueTile = playbackIdx === i;
          const isSelectedTile = selectedTiles.has(i);

          return (
            <button
              key={i}
              onClick={() => handleGridClick(i)}
              disabled={!isInputPhase}
              aria-label={`Tile ${i + 1}`}
              type="button"
              className={[
                "relative aspect-square rounded-xl transition-all duration-150",
                "border shadow-sm",
                // Base clickable styling
                isInputPhase
                  ? "cursor-pointer border-slate-400/70 bg-white/70 hover:-translate-y-[1px] hover:border-slate-600 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 active:translate-y-0"
                  : "cursor-not-allowed border-slate-300/50 bg-slate-100/60 opacity-80",
                // Pattern cue (computer showing)
                isCueTile
                  ? "!bg-slate-900 !border-slate-900 shadow-lg shadow-slate-900/30 scale-[1.03]"
                  : "",
                // User selected in current attempt
                isSelectedTile
                  ? "!bg-slate-700 !border-slate-800 shadow-md shadow-slate-900/20 scale-[1.02]"
                  : "",
                // Success state
                gameState === "success"
                  ? "!bg-emerald-50 !border-emerald-300"
                  : "",
                // Fail state
                gameState === "fail"
                  ? "!bg-rose-50 !border-rose-300"
                  : "",
              ].join(" ")}
            >
              {/* Inner dot to help target + reinforce state */}
              <span
                className={[
                  "pointer-events-none absolute inset-0 m-auto h-3 w-3 rounded-full transition-all",
                  isCueTile || isSelectedTile
                    ? "bg-white/90 shadow-sm"
                    : "bg-slate-400/40",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      {finalResult ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Test Complete</p>
          <div className="mt-4">
            <div className="text-4xl font-bold text-slate-900">
              {finalResult.completedLevels}
            </div>
            <div className="mt-1 text-sm text-slate-600">Completed levels</div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
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
          <span className="text-slate-600">Your turn</span>
        )}
        {gameState === "success" && (
          <span className="text-emerald-600">Correct! Next level...</span>
        )}
        {gameState === "fail" && (
          <span className="text-rose-600">Incorrect sequence</span>
        )}
      </div>
    </div>
  );
}
